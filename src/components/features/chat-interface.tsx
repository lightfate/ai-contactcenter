// src/components/features/chat-interface.tsx
'use client'

import { useState, useRef, useEffect } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { Textarea } from "@/components/ui/textarea"
import { useMobile } from "@/hooks/use-mobile"
import ChatMessage from "./chat-message"
import WelcomeCard from "./welcome-card"
import Image from 'next/image'
import { type Message, MessageType } from "@/types/chat"
// 注意：不再使用Button组件，改用原生button来避免可能的事件问题

// 全局日志函数，确保始终打印，控制日志长度
const forceLog = (message: string, data?: any) => {
  // 处理数据，控制长度
  let formattedData = data;
  if (data) {
    try {
      if (typeof data === 'string' && data.length > 200) {
        formattedData = data.substring(0, 200) + '... [截断]';
      } else if (typeof data === 'object') {
        // 深拷贝以避免修改原始对象
        const clonedData = JSON.parse(JSON.stringify(data));
        
        // 如果是数组且长度超过5
        if (Array.isArray(clonedData) && clonedData.length > 5) {
          formattedData = [...clonedData.slice(0, 5), `... 及${clonedData.length - 5}项更多`];
        } 
        // 处理长字符串属性
        else if (typeof clonedData === 'object' && clonedData !== null) {
          Object.keys(clonedData).forEach(key => {
            if (typeof clonedData[key] === 'string' && clonedData[key].length > 100) {
              clonedData[key] = clonedData[key].substring(0, 100) + '... [截断]';
            }
          });
          formattedData = clonedData;
        }
      }
    } catch (e) {
      formattedData = "[无法格式化]";
    }
  }

  // 使用原始console.log确保输出
  window.console.log(`[DEBUG] ${message}`, formattedData);
  
  // 尝试将日志添加到页面，以防控制台被禁用
  try {
    const debugElem = document.getElementById('debug-output');
    if (debugElem) {
      const logItem = document.createElement('div');
      logItem.textContent = `${message}: ${formattedData ? JSON.stringify(formattedData) : ''}`;
      debugElem.appendChild(logItem);
      
      // 限制调试区域的子元素数量
      if (debugElem.children.length > 50) {
        debugElem.removeChild(debugElem.children[0]);
      }
    }
  } catch (e) {
    // 如果DOM操作失败，忽略错误
  }
};

// 添加模拟流式输出的辅助函数
const simulateStreamingOutput = (content: string, messageId: string, setMessagesFn: React.Dispatch<React.SetStateAction<Message[]>>) => {
  let currentIndex = 0;
  const chunkSize = 3; // 每次输出几个字符
  const delay = 20; // 每次输出的延迟(毫秒)

  const outputNextChunk = () => {
    if (currentIndex < content.length) {
      const endIndex = Math.min(currentIndex + chunkSize, content.length);
      const chunk = content.substring(currentIndex, endIndex);
      
      setMessagesFn((prev) =>
        prev.map((msg) => {
          if (msg.id !== messageId) return msg;
          return {
            ...msg,
            content: msg.content + chunk,
            isLoading: true,
          };
        })
      );

      // 尝试直接DOM更新
      try {
        const aiMsgElem = document.querySelector(`[data-message-id="${messageId}"]`);
        if (aiMsgElem) {
          const contentElem = aiMsgElem.querySelector('.message-content');
          if (contentElem) {
            contentElem.textContent = (contentElem.textContent || '') + chunk;
          }
        }
      } catch (e) {
        forceLog("DOM直接更新失败:", e);
      }

      currentIndex = endIndex;
      setTimeout(outputNextChunk, delay);
    } else {
      // 完成后，设置loading状态为false
      setMessagesFn((prev) =>
        prev.map((msg) =>
          msg.id === messageId ? { ...msg, isLoading: false } : msg
        )
      );
    }
  };

  // 开始输出
  setTimeout(outputNextChunk, delay);
};

export default function ChatInterface() {
  // —— 新增：启动时调用 /api/session 获取 chatId ——  
  const [chatId, setChatId] = useState<string | null>(null)
  // 添加DEBUG输出状态
  const [debugOutput, setDebugOutput] = useState<string[]>([])
  const [welcomeCardKey, setWelcomeCardKey] = useState(0)  // 添加状态用于刷新欢迎卡片
  
  // 添加自动调整输入框高度的方法
  const adjustTextareaHeight = (textarea: HTMLTextAreaElement | null) => {
    if (!textarea) return;
    
    // 重置高度，以便能够计算正确的scrollHeight
    textarea.style.height = 'auto';
    
    // 计算新的高度，但限制在一定范围内
    const lineHeight = 24; // 假设每行大约24px高
    const maxLines = 7;
    const maxHeight = lineHeight * maxLines;
    
    // 限制最大高度
    if (textarea.scrollHeight > maxHeight) {
      textarea.style.height = `${maxHeight}px`;
      textarea.style.overflowY = 'auto';
    } else {
      textarea.style.height = `${textarea.scrollHeight}px`;
      textarea.style.overflowY = 'hidden';
    }
  };
  
  useEffect(() => {
    forceLog("组件初始化");
    
    // 获取会话ID
    const fetchChatId = async () => {
      try {
        forceLog("开始获取会话ID");
        const res = await fetch("/api/session")
        if (!res.ok) throw new Error(`获取会话ID失败: ${res.status}`)
        const data = await res.json()
        forceLog("获取到chatId:", data.chatId)
        setChatId(data.chatId)
        
        // 移除localStorage相关逻辑
      } catch (error) {
        forceLog("获取会话ID错误:", error)
      }
    }

    fetchChatId()
  }, [])

  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const isMobile = useMobile()
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  
  // 输入框高度调整
  useEffect(() => {
    adjustTextareaHeight(textareaRef.current);
  }, [input]);

  // 消息列表变化时滚动到底部
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // 发送消息处理函数
  const handleSendMessage = async () => {
    forceLog("触发发送消息函数")
    // 基本验证
    if (!input.trim()) {
      forceLog("输入为空，无法发送")
      return
    }
    
    if (!chatId) {
      forceLog("会话ID未获取，无法发送")
      return
    }

    forceLog("准备发送消息:", { input, chatId })

    // 1. 添加用户消息
    const userMessage: Message = {
      id: Date.now().toString(),
      type: MessageType.USER,
      content: input,
      isLoading: false,
    }
    setMessages((prev) => [...prev, userMessage])
    
    // 清空输入并设置加载状态
    setInput("")
    setIsLoading(true)

    // 2. 添加 AI 占位消息
    const aiMessageId = `${Date.now()}_ai`
    const aiMessage: Message = {
      id: aiMessageId,
      type: MessageType.AI,
      content: "", // 确保初始化为空字符串而非undefined
      isLoading: true
    }
    
    setMessages((prev) => [...prev, aiMessage])

    try {
      // 3. 调用后端 API，接收 SSE 流
      const responseChatItemId = aiMessageId; // 使用aiMessageId作为响应ID
      
      // 构造请求参数，符合FastGPT API要求
      const requestBody = {
        chatId: chatId,
        stream: true,
        detail: true,
        responseChatItemId: responseChatItemId,
        variables: {},
        messages: [{ role: "user", content: input }]
      };
      
      forceLog("发送请求到API: /api/chat", requestBody);
      
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      })
      
      // 验证响应
      forceLog("收到API响应:", { 
        status: res.status, 
        statusText: res.statusText,
        headers: Object.fromEntries(res.headers.entries()),
        type: res.type
      })
      
      if (!res.ok) {
        const errorText = await res.text()
        forceLog("API响应错误:", { status: res.status, body: errorText })
        throw new Error(`API错误: ${res.status}`)
      }
      
      if (!res.body) {
        forceLog("API无响应体")
        throw new Error("无返回体")
      }
      
      forceLog("开始接收SSE流")

      // 调试: 克隆响应并获取原始文本
      const responseClone = res.clone();
      responseClone.text().then(text => {
        forceLog("完整响应原始文本:", text);
      }).catch(err => {
        forceLog("无法获取完整响应文本:", err);
      });
      
      // 读取SSE流
      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let buffer = ""

      // 持续读取流式数据
      while (true) {
        try {
          const { done, value } = await reader.read()
          if (done) {
            forceLog("SSE流读取完毕")
            break
          }
          
          const chunk = decoder.decode(value, { stream: true })
          forceLog("接收到原始数据块:", chunk)
          buffer += chunk
          
          // 使用更可靠的方式拆分SSE消息
          const parts = buffer.split(/\n\n/)
          buffer = parts.pop() || ""

          forceLog(`分割得到 ${parts.length} 个消息片段`)
          
          for (const part of parts) {
            forceLog("处理消息片段:", part)
            
            // 提取事件类型和数据
            const eventMatch = part.match(/^event:\s*(\w+)/m);
            const dataMatch = part.match(/^data:\s*(.+)$/m);
            
            if (!eventMatch || !dataMatch) {
              forceLog("无法解析事件或数据:", part);
              continue;
            }
            
            const eventType = eventMatch[1];
            const data = dataMatch[1].trim();
            
            forceLog(`解析到事件[${eventType}]，数据:`, data);
            
            if (data === "[DONE]") {
              forceLog("收到[DONE]标记，结束处理")
              continue
            }
            
            try {
              // 只解析JSON数据，非JSON数据(如[DONE])已在上面处理
              if (data.startsWith("{") || data.startsWith("[")) {
                const payload = JSON.parse(data)
                forceLog(`成功解析[${eventType}]事件数据:`, payload)
                
                // 处理不同的事件类型
                switch(eventType) {
                  case 'answer':
                    // 处理answer事件，FastGPT delta格式
                    if (payload.choices && payload.choices[0]?.delta?.content) {
                      const content = payload.choices[0].delta.content
                      forceLog("接收到delta内容:", content)
                      setMessages((prev) =>
                        prev.map((msg) => {
                          if (msg.id !== aiMessageId) return msg
                          const newContent = (msg.content || "") + content;
                          forceLog("更新消息内容:", { id: msg.id, oldContent: msg.content, newContent })
                          return {
                            ...msg,
                            content: newContent,
                            isLoading: true,
                          }
                        })
                      )
                      // 尝试直接使用DOM更新，以防React不更新
                      try {
                        const aiMsgElem = document.querySelector(`[data-message-id="${aiMessageId}"]`);
                        if (aiMsgElem) {
                          const contentElem = aiMsgElem.querySelector('.message-content');
                          if (contentElem) {
                            contentElem.textContent = (contentElem.textContent || '') + content;
                          }
                        }
                      } catch (e) {
                        forceLog("DOM直接更新失败:", e);
                      }
                    }
                    
                    // 处理没有content字段的情况，如果delta为空对象，确保仍有有效内容显示
                    if (payload.choices && payload.choices[0]?.delta && Object.keys(payload.choices[0]?.delta).length === 0) {
                      forceLog("接收到delta但无content字段:", payload.choices[0]?.delta)
                      setMessages((prev) =>
                        prev.map((msg) => {
                          if (msg.id !== aiMessageId) return msg
                          // 确保有内容，即使为空也设置为空字符串而非undefined
                          const content = msg.content || "";
                          return {
                            ...msg,
                            content: content,
                            isLoading: false, // 设置为false表示加载完成
                          }
                        })
                      )
                    }
                    break;
                    
                  case 'flowResponses':
                    // 处理flowResponses事件，包含AI回复或节点信息
                    forceLog("处理flowResponses事件:", payload);
                    
                    // 尝试从flowResponses中提取AI回复
                    if (Array.isArray(payload)) {
                      // 处理answerNode类型的节点，直接获取textOutput
                      const answerNode = payload.find((node: any) => 
                        node.moduleType === 'answerNode' && node.textOutput
                      );
                      
                      if (answerNode && answerNode.textOutput) {
                        const answer = answerNode.textOutput;
                        forceLog("从answerNode提取到回复:", answer);
                        
                        // 直接设置完整内容
                        setMessages((prev) =>
                          prev.map((msg) => {
                            if (msg.id !== aiMessageId) return msg
                            return {
                              ...msg,
                              content: answer,
                              isLoading: false,
                            }
                          })
                        );
                      }
                      
                      // 查找AI对话节点的回复
                      const aiChatNode = payload.find((node: any) => 
                        node.moduleType === 'chatNode' && node.moduleName?.includes('AI') && (node.answer || node.responseData?.choices?.[0]?.message?.content)
                      );
                      
                      if (aiChatNode) {
                        const answer = aiChatNode.answer || aiChatNode.responseData?.choices?.[0]?.message?.content;
                        if (answer) {
                          forceLog("从flowResponses提取到AI回复:", answer);
                          
                          // 重置消息内容，准备流式输出
                          setMessages((prev) =>
                            prev.map((msg) => {
                              if (msg.id !== aiMessageId) return msg
                              return {
                                ...msg,
                                content: "", // 重置为空字符串
                                isLoading: true,
                              }
                            })
                          );
                          
                          // 使用模拟流式输出的函数
                          simulateStreamingOutput(answer, aiMessageId, setMessages);
                        }
                      }
                      
                      // 查找知识库引用源
                      const searchNode = payload.find((node: any) => 
                        node.moduleType === 'datasetSearchNode' && node.quoteList
                      );
                      
                      if (searchNode && searchNode.quoteList && searchNode.quoteList.length > 0) {
                        forceLog("从flowResponses提取到引用来源:", searchNode.quoteList);
                        console.log("【调试】完整知识库引用数据:", JSON.stringify(searchNode.quoteList, null, 2));
                        
                        // 检查引用中是否有文件URL
                        searchNode.quoteList.forEach((quote: any, index: number) => {
                          console.log(`【调试】引用 ${index+1} 详情:`, {
                            sourceName: quote.sourceName,
                            q: quote.q?.substring(0, 50) + (quote.q?.length > 50 ? '...' : ''),
                            url: quote.url || '未提供',
                            fileId: quote.fileId || '未提供',
                            完整数据: quote
                          });
                        });
                        
                        // 转换为我们的引用格式，确保文件名正确显示
                        const references = searchNode.quoteList.map((quote: any) => {
                          // 优先使用sourceName作为标题，这是文件名
                          let title = '';
                          if (quote.sourceName) {
                            title = quote.sourceName;
                          } else if (quote.q) {
                            title = quote.q.length > 50 ? quote.q.substring(0, 47) + '...' : quote.q;
                          } else {
                            title = '参考资料';
                          }
                          
                          // 尝试构建有效的URL
                          let url = '#';
                          
                          // 如果有fileId，可以构建下载链接
                          if (quote.fileId) {
                            url = `/api/files/${quote.fileId}/download`;
                          } else if (quote.url && quote.url !== '#') {
                            url = quote.url;
                          }
                          
                          // 为调试添加一个随机ID，这样每个来源都是唯一的，方便检查
                          const uniqueId = Math.floor(Math.random() * 10000);
                          
                          return {
                            title: title,
                            url: url,
                            id: uniqueId, // 添加一个唯一ID，用于区分相同标题的来源
                            fileId: quote.fileId // 保留原始fileId以备后用
                          };
                        });
                        
                        setMessages((prev) =>
                          prev.map((msg) => {
                            if (msg.id !== aiMessageId) return msg
                            return {
                              ...msg,
                              sources: references,
                              isLoading: true,
                            }
                          })
                        );
                      }
                    }
                    break;
                    
                  case 'fastAnswer':
                    // 处理fastAnswer事件，提取完整内容直接设置
                    if (payload.choices && payload.choices[0]?.delta?.content) {
                      const content = payload.choices[0].delta.content
                      forceLog("接收到fastAnswer内容:", content)
                      
                      // 直接设置完整内容，而不是追加
                      setMessages((prev) =>
                        prev.map((msg) => {
                          if (msg.id !== aiMessageId) return msg
                          return {
                            ...msg,
                            content: content.trim(), // 移除前后空白字符
                            isLoading: false, // 直接设为完成状态
                          }
                        })
                      )
                      
                      // 在控制台输出内容以便调试
                      forceLog("设置了消息内容:", content.trim())
                    }
                    break;
                    
                  default:
                    // 处理传统内容格式
                    if (payload.content) {
                      forceLog("接收到content字段:", payload.content)
                      setMessages((prev) =>
                        prev.map((msg) => {
                          if (msg.id !== aiMessageId) return msg
                          return {
                            ...msg,
                            content: msg.content + payload.content,
                            isLoading: true,
                          }
                        })
                      )
                    }
                    
                    // 处理引用来源
                    if (payload.references) {
                      forceLog("接收到引用来源:", payload.references)
                      setMessages((prev) =>
                        prev.map((msg) => {
                          if (msg.id !== aiMessageId) return msg
                          return { 
                            ...msg, 
                            sources: payload.references,
                            isLoading: true
                          }
                        })
                      )
                    }
                }
              }
            } catch (error) {
              forceLog("解析SSE数据失败:", { error, data })
            }
          }
        } catch (readError) {
          forceLog("读取流数据时出错:", readError)
          break
        }
      }

      // 4. 关闭加载状态
      forceLog("响应处理完成，更新UI状态")
      setMessages((prev) => {
        // 查看最终的消息内容
        const aiMsg = prev.find(msg => msg.id === aiMessageId);
        if (aiMsg) {
          forceLog("最终AI消息内容:", {
            content: aiMsg.content,
            contentLength: aiMsg.content?.length || 0,
            isLoading: aiMsg.isLoading,
            hasSources: !!aiMsg.sources && aiMsg.sources.length > 0
          });
        }
        
        return prev.map((msg) =>
          msg.id === aiMessageId ? { ...msg, isLoading: false } : msg
        );
      });
    } catch (error) {
      forceLog("处理SSE流错误:", error)
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === aiMessageId
            ? { ...msg, content: "请求出错，请稍后重试。", isLoading: false }
            : msg
        )
      )
    } finally {
      setIsLoading(false)
      // 聚焦回文本输入框，提高用户体验
      setTimeout(() => textareaRef.current?.focus(), 100)
    }
  }

  // 在已有函数后添加创建新会话的函数
  const createNewChat = async () => {
    forceLog("开始创建新会话");
    setIsLoading(true);
    try {
      const res = await fetch("/api/session")
      if (!res.ok) throw new Error(`创建新会话失败: ${res.status}`)
      const data = await res.json()
      forceLog("创建新的chatId:", data.chatId)
      
      // 更新chatId并清空消息列表和输入框
      setChatId(data.chatId)
      setMessages([])
      setInput("")
      setWelcomeCardKey(prev => prev + 1)  // 更新welcomeCardKey
      
      // 聚焦输入框
      setTimeout(() => textareaRef.current?.focus(), 100)
    } catch (error) {
      forceLog("创建新会话错误:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-full w-full bg-white">
      {/* 调试输出区域 */}
      {/* 
      <div id="debug-output" className="text-xs bg-black text-white p-2 max-h-40 overflow-auto">
        <h3>调试输出</h3>
        {debugOutput.map((log, i) => (
          <div key={i}>{log}</div>
        ))}
      </div>*/}
      
      {/* 对话区域：统一背景色，调整底部边距使输入框遮挡部分内容 */}
      <div className="flex-1 p-4 pb-10 space-y-4 overflow-y-auto bg-white">
        {/* 欢迎卡片 - 始终显示为第一条消息 */}
        <WelcomeCard key={welcomeCardKey} />
        
        <AnimatePresence initial={false}>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              data-message-id={message.id}
            >
              <ChatMessage message={message} />
            </motion.div>
          ))}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      {/* 整体容器 */}
<div className="sticky bottom-0 left-0 right-0 p-4 bg-white z-10 border-gray-200">
  <div className="flex flex-col space-y-2">
          
    {/* 1. 附件展示区（无附件时不占位）  */}
    {/*
    {attachments?.length > 0 && (
      <div className="h-20 border border-gray-200 rounded-lg overflow-auto">
       
      </div>
    )}  */}

    {/* 1. 输入区 + 发送按钮 */}
  <div className="relative flex-1 bg-white border border-gray-200 rounded-3xl px-4 pt-2 pb-12 focus-within:border-gray-400 transition-colors duration-200">
    <Textarea
      ref={textareaRef}
      value={input}
      onChange={e => setInput(e.target.value)}
      placeholder="发消息..."
      className={`
        w-full resize-none
        max-h-[168px] overflow-y-auto
        outline-none bg-transparent
        whitespace-pre-wrap break-words
      `}
      onKeyDown={e => {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault()
          handleSendMessage()
        }
      }}
    />

    {/* 发送按钮：仍在输入框内 */}
    <button
      onClick={handleSendMessage}
      disabled={!input.trim() || isLoading || !chatId}
      type="button"
      className={`
        absolute bottom-2 right-2
        h-8 w-8 p-1 rounded-full flex items-center justify-center
        transition-colors duration-150
        ${input.trim() && !isLoading && chatId
          ? 'bg-[#24C7D9] hover:bg-[#1faabf] cursor-pointer'
          : 'bg-gray-100 cursor-not-allowed'}
      `}
    >
      <Image
        src="/icons/send.svg"
        alt="发送"
        width={20}
        height={20}
        className={input.trim() && !isLoading && chatId ? 'filter invert' : 'opacity-50'}
      />
    </button>
  </div>

  {messages.length > 0 && (
  <div className="flex items-center justify-center space-x-2 mt-2">
    {/* Tips 文本 */}
    <span className="text-xs text-gray-500">
      Tips: 点击清扫按钮，可以重新开始咨询
    </span>
    {/* 清扫按钮：透明背景，只图标变色 */}
    <button
      onClick={createNewChat}
      type="button"
      className="
        h-8 w-8 p-1 rounded-full flex items-center justify-center
        bg-transparent hover:bg-transparent
        transition-colors duration-150
      "
    >
      <Image
        src="/icons/clear.svg"
        alt="清除"
        width={16}
        height={16}
        className="
          filter
          transition duration-150
          hover:invert-[46%]
          hover:sepia-[92%]
          hover:saturate-[749%]
          hover:hue-rotate-[147deg]
        "
      />
    </button>

    
  </div>
)}


</div>
</div>


    </div>
  )
}
