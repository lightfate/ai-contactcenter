"use client"

import { useState, useEffect } from "react"
import { motion } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { type Message, MessageType } from "@/types/chat"
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
  return text;
};

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
  const isAI = message.type === MessageType.AI

  // 确保sources存在且不为空
  const hasSources = Array.isArray(message.sources) && message.sources.length > 0

  // 确定是否需要折叠来源
  const shouldCollapseSources = hasSources && message.sources && message.sources.length > 3

  // 要显示的来源
  const displayedSources = hasSources && message.sources ? 
    (showAllSources ? message.sources : message.sources.slice(0, 3)) : []

  // 打字机效果 - 仅用于AI消息且不在加载状态
  useEffect(() => {
    if (isAI && !message.isLoading && currentIndex < message.content.length) {
      const timer = setTimeout(() => {
        setDisplayedText((prev) => prev + message.content[currentIndex])
        setCurrentIndex((prev) => prev + 1)
      }, 8) // 调整速度

      return () => clearTimeout(timer)
    }
  }, [currentIndex, isAI, message.content, message.isLoading])

  // 当消息内容变化时重置
  useEffect(() => {
    if (isAI && !message.isLoading) {
      setDisplayedText("")
      setCurrentIndex(0)
      setShowAllSources(false)
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

  // AI消息新样式，参考欢迎卡片
  return (
    <div className="mb-4 w-auto inline-block mx-auto">
      {message.isLoading ? (
        <div className="rounded-[32px] bg-[#F5F5F5] p-6">
          <ModernLoadingIndicator />
        </div>
      ) : (
        <div className="rounded-[32px] bg-[#F5F5F5] p-6 relative" data-message-id={message.id}>
          {/* 标题行 */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-auto h-auto text-blue-600">
              <div className="rounded-md ">
              <Image src="/service-avatar.webp" alt="头像" width={38} height={38} />
              </div>
              </div>
              <h2 className="text-base font-bold">青青 · 客服助手</h2>
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
          </div>
          
          {/* 调试信息 */}
          <div className="hidden">
            <p>消息ID: {message.id}</p>
            <p>内容长度: {message.content?.length || 0}</p>
            <p>内容: {JSON.stringify(message.content)}</p>
          </div>
          
          {/* 内容区 */}
          <div className="message-content markdown-body text-base">
            {message.content ? (
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
                    const isInline = !match && !children[0]?.includes('\n')
                    
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
            ) : (
              <div className="text-gray-400">无内容</div>
            )}
          </div>

          {/* 来源区 - 使用#e2e2e2分割线 */}
          {hasSources && (
            <div className="mt-4 pt-4 border-t border-[#e2e2e2]">
              <div className="flex items-center mb-2">
                <span className="text-sm font-medium text-gray-700">来源</span>
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
                  
                  return (
                    <motion.div
                      key={uniqueKey}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.05 * index }}
                    >
                      <a
                        href={source.url}
                        className="flex items-center justify-between p-2 px-3 rounded-lg hover:bg-gray-200 text-sm transition-colors"
                        target="_blank"
                        rel="noopener noreferrer"
                        title={source.title}
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
                {shouldCollapseSources && message.sources && (
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
                      <span>显示更多 ({message.sources.length - 3})</span>
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
      )}
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
  资料查询中，请稍后...
</motion.span>

    </div>
  )
}

