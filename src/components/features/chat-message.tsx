"use client"

import { useState, useEffect, useMemo } from "react"
import { motion } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { type Message, MessageType, type Source } from "@/types/chat"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import Image from "next/image"
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip"

// 辅助函数：提取PDF文件名
const extractPdfFileName = (text: string): string => {
  // 尝试匹配完整的PDF文件名
  const pdfRegex = /([^/\\]+\.(pdf|PDF))/;
  const match = text.match(pdfRegex);
  if (match) {
    return match[1];
  }
  
  // 尝试匹配PPT文件名
  const pptRegex = /([^/\\]+\.(ppt|pptx|PPT|PPTX))/;
  const pptMatch = text.match(pptRegex);
  if (pptMatch) {
    return pptMatch[1];
  }
  
  return text;
};

// 控制是否显示来源区的变量
// 可以修改为false来完全隐藏来源区
const SHOW_SOURCE_SECTION = true;

/**
 * 加载动画组件
 * 使用单个圆点实现加载效果
 */
function DotsLoadingIndicator() {
  return (
    <div className="flex items-center justify-center gap-2 py-3">
      <motion.span
        className="inline-block rounded-full"
        style={{
          width: 20,
          height: 20,
          backgroundColor: '#000000',
        }}
        animate={{
          scale: [0.5, 1, 0.5],
        }}
        transition={{
          duration: 0.8,
          ease: 'easeInOut',
          repeat: Infinity,
        }}
      />
    </div>
  );
}

/**
 * 聊天消息组件
 * 显示用户或AI的消息，包括加载动画
 */
interface ChatMessageProps {
  message: Message
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const [displayedText, setDisplayedText] = useState("")
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showAllSources, setShowAllSources] = useState(false)
  const [showInitialLoading, setShowInitialLoading] = useState(true)
  const [showSources, setShowSources] = useState(false)  // 控制来源的显示
  const isAI = message.type === MessageType.AI
  const [sourceHref,setSourceHref] = useState("")

  console.log("123465789",message);
  

  // 确保sources存在且不为空
  const hasSources = Array.isArray(message.sources) && message.sources.length > 0

  // 处理相同文件名的来源 - 合并相同文件名的来源
  const processedSources = useMemo(() => {
    if (!hasSources || !message.sources) return [];
    
    // 在控制台显示原始来源信息
    console.log("【原始来源数据】", message.sources);
    
    // 单独打印每个来源的文件名和URL
    message.sources.forEach((source, idx) => {
      console.log(`文档 ${idx+1}: 名称=[${source.title}], URL=[${source.url}]`);
    });
    
    // 用于存储已处理的文件名和对应的来源
    const uniqueSources: {[key: string]: Source} = {};
    
    message.sources.forEach((source) => {
      // 从URL或标题中提取文件名
      let displayName = source.title || 'Unknown Source';
      
      // 提取PDF或PPT文件名
      displayName = extractPdfFileName(displayName);
      
      // 使用文件名作为键，存储来源
      if (!uniqueSources[displayName]) {
        uniqueSources[displayName] = { ...source };
      }
    });
    
    // 将对象转换回数组
    const result = Object.values(uniqueSources);
    
    // 在控制台显示处理后的来源信息
    console.log("【合并后来源数据】", result);
    result.forEach((source, idx) => {
      console.log(`合并后文档 ${idx+1}: 名称=[${source.title}], URL=[${source.url}]`);
    });
    
    return result;
  }, [hasSources, message.sources]);

  // 检查是否有有效的URL (不是 "#")
  const hasValidSources = useMemo(() => {
    return processedSources.some(source => source.url && source.url !== '#');
  }, [processedSources]);
  

  // 确定是否需要折叠来源
  const shouldCollapseSources = processedSources.length > 3;

  // 要显示的来源
  const displayedSources = showAllSources ? processedSources : processedSources.slice(0, 3);

  console.log("displayedSources============",displayedSources);
  

  // 初始加载效果 - 仅对AI消息显示
 
  useEffect(() => {
    if (isAI && !message.isLoading) {
      // 设置初始加载显示时间，这里设置为1000毫秒(1秒)
      const loadingTimer = setTimeout(() => {
        setShowInitialLoading(false);
      }, 800);
      
      return () => clearTimeout(loadingTimer);
    }
  }, [isAI, message.isLoading]);

  useEffect(() => {
  if (isAI && message.isLoading) {
      setShowInitialLoading(true);
      const timer = setTimeout(() => {
        setShowInitialLoading(false);
      }, 1500);
     return () => clearTimeout(timer);
    }
  }, [isAI, message.isLoading]);


  // 打字机效果 - 仅用于AI消息且不在加载状态
  useEffect(() => {
    if (isAI && !message.isLoading && !showInitialLoading && currentIndex < message.content.length) {
      const timer = setTimeout(() => {
        setDisplayedText((prev) => prev + message.content[currentIndex])
        setCurrentIndex((prev) => prev + 1)
      }, 2) // 调整速度

      return () => clearTimeout(timer)
    }
  }, [currentIndex, isAI, message.content, message.isLoading, showInitialLoading])

  // 当打字机效果完成后显示来源
  useEffect(() => {
    if (isAI && !message.isLoading && currentIndex >= message.content.length && currentIndex > 0) {
      // 文本已完全显示，可以显示来源
      setShowSources(true);
    } else {
      // 文本未完全显示，不显示来源
      setShowSources(false);
    }
  }, [currentIndex, isAI, message.content.length, message.isLoading]);

  const getHref = async (item:any) => {
    console.log("获取链接地址",item);
    try{
      const response = await fetch(
        `/openapi/v1/dataset/collection?collection_id=${item.collectionId}`
        ,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      ).then(res=>res.json());

      console.log("response=========",response);
      // window.open(response.data.url + "&officePreviewType=pdf")
      window.open( "http://172.30.232.99:3003"+response.data.file_url )

      setSourceHref(`${response.data.url}&officePreviewType=pdf`)
      
    }catch(err){

    }
    
  }

  // 当消息内容变化时重置
  useEffect(() => {
    if (isAI && !message.isLoading) {
      setDisplayedText("")
      setCurrentIndex(0)
      setShowAllSources(false)
      setShowSources(false)  // 重置来源显示状态
      setShowInitialLoading(true) // 每次内容变化都重新显示初始加载动画
    }
  }, [isAI, message.content, message.isLoading])

  // 用户消息样式保持不变
  if (!isAI) {
    return (
      <div className="flex gap-3 items-start justify-end">
        <div className="max-w-[85%] rounded-[24px] p-4 ml-auto" style={{ backgroundColor: '#24C7D9', color: '#ffffff' }}>
          <div className="whitespace-pre-wrap">{message.content}</div>
        </div>
      </div>
    )
  }
/*
  // 显示初始加载动画 - 在AI卡片之前显示
  if (isAI && !message.isLoading && showInitialLoading) {
    return (
      <div className="mb-4 w-auto inline-block mx-auto">
        <DotsLoadingIndicator />
      </div>
    );
  }
  */
 // 1️⃣ 后端开始请求，且在小圆点阶段
 if (isAI && message.isLoading && showInitialLoading) {
   return (
     <div className="mb-4 w-auto inline-block mx-auto">
       <DotsLoadingIndicator />
     </div>
   );
  }

  // AI消息加载中状态
  if (message.isLoading) {
    return (
      <div className="mb-4 w-auto inline-block mx-auto">
        <div className="rounded-[32px] bg-[#F5F5F5] p-6">
          <ModernLoadingIndicator />
        </div>
      </div>
    );
  }

  // AI消息常规显示
  return (
    <div className="mb-4 w-auto inline-block mx-auto">
      <div className="rounded-[32px] bg-[#F5F5F5] p-6 relative" data-message-id={message.id}>
        {/* 标题行 */}
        {message.content&&<div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-auto h-auto text-blue-600">
            <div className="rounded-md ">
            <Image src="/service-avatar.webp" alt="头像" width={38} height={38} />
            </div>
            </div>
            <h2 className="text-base font-bold">青青（工号：7088，您的专属客服）</h2>
          </div>
          {message.content !== "请求出错，请稍后重试。" && (
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="w-5 h-5 text-gray-500 cursor-help">
                  <svg className="w-full h-full">
                    <use href="/icons.svg#icon-info" />
                  </svg>
                </div>
              </TooltipTrigger>
              <TooltipContent side="top">
                <p className="text-xs">内容由AI与人工客服协同生成，也可能会犯错。请核查重要信息。</p>
              </TooltipContent>
            </Tooltip>
          )}
        </div>}
        
        
        {/* 调试信息 */}
        <div className="hidden">
          <p>消息ID: {message.id}</p>
          <p>内容长度: {message.content?.length || 0}</p>
          <p>内容: {JSON.stringify(message.content)}</p>
        </div>
        
        {/* 内容区 */}
        <div className="message-content markdown-body text-base">
          {message.content && (
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                p: ({ node, ...props }) => <p className="whitespace-pre-wrap mb-4" {...props} />,
                a: ({ node, ...props }) => <a className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer" {...props} />,
                h1: ({ node, ...props }) => <h1 className="text-2xl font-bold my-4" {...props} />,
                h2: ({ node, ...props }) => <h2 className="text-xl font-bold my-3" {...props} />,
                h3: ({ node, ...props }) => <h3 className="text-lg font-bold my-2" {...props} />,
                ul: ({ node, ...props }) => <ul className="list-disc pl-5 mb-4" {...props} />,
                ol: ({ node, ...props }) => <ol className="list-decimal pl-5 mb-4" {...props} />,
                li: ({ node, ...props }) => <li className="mb-1" {...props} />,
                code: ({ node, className, children, ...props }: any) => {
                  const match = /language-(\w+)/.exec(className || '')
                  const isInline = !match && Array.isArray(children) && children.length > 0 && typeof children[0] === 'string' && !children[0].includes('\n')
                  
                  return isInline ? (
                    <code className="bg-gray-100 px-1 rounded text-sm" {...props}>
                      {children}
                    </code>
                  ) : (
                    <code className="block bg-gray-100 p-3 rounded-lg text-sm my-4 overflow-x-auto" {...props}>
                      {children}
                    </code>
                  )
                },
                pre: ({ node, ...props }) => <pre className="bg-gray-100 p-0 rounded-lg my-4 overflow-x-auto" {...props} />,
                blockquote: ({ node, ...props }) => <blockquote className="border-l-4 border-gray-300 pl-4 italic my-4" {...props} />,
                img: ({ node, ...props }) => <img className="max-w-full h-auto my-4 rounded" {...props} />
              }}
            >
              {displayedText}
            </ReactMarkdown>
          )
          //  : (
          //   <div className="text-gray-400">无内容</div>
          // )
          }
        </div>

        {/* 来源区 - 使用#e2e2e2分割线 */}
        {/* {SHOW_SOURCE_SECTION && hasSources && showSources && hasValidSources && ( */}
        {SHOW_SOURCE_SECTION && hasSources && showSources &&  (
          <div className="mt-4 pt-4 border-t border-[#e2e2e2]">
            <div className="flex items-center mb-2">
              <span className="text-sm font-medium text-gray-700">查看文档</span>
            </div>
            
            <div className="grid grid-cols-1 gap-2">
              {displayedSources.map((source, index) => {
                // 从URL或标题中提取文件名
                let displayName = source.title || 'Unknown Source';
                
                // 提取PDF文件名
                displayName = extractPdfFileName(displayName);
                
                // 如果标题太长，截取并添加省略号
                if (displayName.length > 50) {
                  displayName = displayName.substring(0, 47) + '...';
                }
                
                // 确保每个文件名后添加唯一标识
                const uniqueKey = `${index}-${source.id || Math.random()}`;
                
                // 检查URL是否有效 (不是 "#" 或空)
                // const hasValidUrl = source.url && source.url !== '#';
                
                // 如果URL无效，跳过该项
                // if (!hasValidUrl) return null;
                
                return (
                  <motion.div
                    key={uniqueKey}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 * index }}
                    onClick={()=>getHref(source)}
                  >
                    <a
                      // href={source.url}
                      className="flex items-center justify-between p-2 px-3 rounded-lg hover:bg-gray-200 text-sm transition-colors cursor-pointer"
                      target="_blank"
                      rel="noopener noreferrer"
                      title={`${source.title}`}
                    >
                      <div className="flex items-center gap-2">
                        <Image 
                          src="/icons/document-icon.svg" 
                          alt="文档图标" 
                          width={16} 
                          height={16}
                          className="text-gray-500"
                        />
                        <span className="truncate">{displayName}</span>
                      </div>
                      <Image 
                        src="/icons/arrow-right.svg" 
                        alt="打开" 
                        width={16} 
                        height={16}
                        className="text-gray-500 ml-2"
                      />
                    </a>
                  </motion.div>
                );
              })}
              
              {/* 显示更多/更少按钮 - 移到列表下方并左对齐 */}
              {shouldCollapseSources && (
                <Button
                variant="ghost"
                size="sm"
                className="text-xs text-gray-500 hover:bg-gray-200 transition-colors p-2 px-3 rounded-lg h-auto mt-1 ml-0 justify-start"
                onClick={() => setShowAllSources(!showAllSources)}
              >
                {showAllSources ? (
                  <>
                    <span>显示更少</span>
                    <Image 
                      src="/icons/arrow-up.svg" 
                      alt="收起" 
                      width={16} 
                      height={16}
                      className="ml-2"
                    />
                  </>
                ) : (
                  <>
                    <span>显示更多 ({processedSources.length - 3})</span>
                    <Image 
                      src="/icons/arrow-down.svg" 
                      alt="展开" 
                      width={16} 
                      height={16}
                      className="ml-2"
                    />
                  </>
                )}
              </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * 渐变文字加载组件
 * 类似 ChatGPT 的文字流光效果
 */
function ModernLoadingIndicator() {
  return (
    <div className="flex items-center h-8">
 <motion.span
  className="
    text-sm font-medium
    bg-gradient-to-r from-gray-800 via-gray-300 to-gray-800
    bg-[length:200%_100%] bg-clip-text text-transparent
  "
  initial={{ backgroundPosition: '200%% 0%' }}
  animate={{ backgroundPosition: ['200% 0%', '0% 0%'] }}
  transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
>
  正在输入中...
</motion.span>

    </div>
  )
}

