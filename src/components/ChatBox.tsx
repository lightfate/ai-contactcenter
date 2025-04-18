import React, { useState, useRef, useEffect } from 'react';
import ChatMessage from './ChatMessage';
import { sendChatMessage, processStreamResponse, Message as ApiMessage, Reference as ApiReference, initApi } from '../services/api';

// 定义消息类型
type MessageRole = 'user' | 'assistant' | 'system';

// 定义引用类型
type Reference = {
  name: string;
  url: string;
};

// 定义节点状态类型
type FlowNodeStatus = {
  status: string;
  name: string;
};

// 定义流程节点类型
const FLOW_NODE_MAPPINGS: Record<string, string> = {
  '问题分类': '内容安全审核',
  '问题优化': '问题理解',
  'HTTP 请求': '问题理解',
  '代码运行': '知识库搜索',
  '知识库搜索': '知识库搜索',
  'AI 对话': 'AI对话',
  '文本拼接': '组织答案',
  '指定回复': '组织答案'
};

// 定义标准流程步骤
const FLOW_STEPS = ['内容安全审核', '问题理解', '知识库搜索', 'AI对话', '组织答案'];

// 定义消息类型
interface Message {
  role: MessageRole;
  content: string;
  references?: Reference[];
  chatId?: string;
  messageId?: string;
  flowSteps?: {
    completed: string[];
    active: string[];
    all: string[];
  };
}

interface ChatBoxProps {
  initialMessages?: Message[];
  chatId?: string;
  className?: string;
}

const ChatBox: React.FC<ChatBoxProps> = ({
  initialMessages = [],
  chatId: initialChatId,
  className = '',
}) => {
  // 状态管理
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingContent, setStreamingContent] = useState('');
  const [chatId, setChatId] = useState<string | undefined>(initialChatId);
  const [error, setError] = useState<string | null>(null);
  const [currentNodeStatus, setCurrentNodeStatus] = useState<FlowNodeStatus | null>(null);
  const [completedNodes, setCompletedNodes] = useState<Set<string>>(new Set());
  const [activeNodes, setActiveNodes] = useState<Set<string>>(new Set());
  
  // 引用
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 初始化API
  useEffect(() => {
    initApi().catch(console.error);
  }, []);

  // 自动滚动到底部
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (!isLoading && !isStreaming) {
      scrollToBottom();
    }
  }, [messages, isLoading, isStreaming]);

  // 发送消息处理
  const handleSendMessage = async () => {
    if (!input.trim()) return;

    // 添加用户消息
    const userMessage: Message = {
      role: 'user',
      content: input.trim(),
    };

    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInput('');
    setIsLoading(true);
    setError(null);
    setCurrentNodeStatus(null);
    // 重置节点状态
    setCompletedNodes(new Set());
    setActiveNodes(new Set());

    try {
      // 准备发送给API的消息记录
      const apiMessages: ApiMessage[] = [...messages, userMessage].map(({ role, content }) => ({
        role,
        content,
      }));

      // 发送消息到API
      const streamResponse = await sendChatMessage(apiMessages);
      
      if (!streamResponse) {
        throw new Error('无法获取流式响应');
      }

      // 设置为流式状态
      setIsLoading(false);
      setIsStreaming(true);
      setStreamingContent('');

      // 处理流式响应
      await processStreamResponse(
        streamResponse,
        // 内容更新回调
        (content) => {
          setStreamingContent(content);
        },
        // 完成回调
        (response) => {
          // 流式传输完成，添加完整消息
          const assistantMessage: Message = {
            role: 'assistant',
            content: response.answer,
            references: response.references,
            chatId: response.chatId || chatId,
            // 添加自定义属性来保存流程步骤信息
            flowSteps: {
              completed: Array.from(completedNodes),
              active: [],
              all: FLOW_STEPS
            }
          };

          setMessages(prev => [...prev, assistantMessage]);
          setIsStreaming(false);
          setStreamingContent('');
          setCurrentNodeStatus(null);
          // 清空状态
          setCompletedNodes(new Set());
          setActiveNodes(new Set());
        },
        // 错误回调
        (error) => {
          console.error('流式传输错误:', error);
          setError(`请求出错: ${error.message}`);
          setIsStreaming(false);
          setIsLoading(false);
        },
        // 状态更新回调
        (status) => {
          setCurrentNodeStatus(status);
          
          // 将原始节点名称映射到标准流程步骤
          const standardNodeName = FLOW_NODE_MAPPINGS[status.name] || status.name;
          
          // 更新活跃节点集合
          setActiveNodes(prev => {
            const newSet = new Set<string>(prev);
            newSet.add(standardNodeName);
            
            // 找到当前节点在标准流程中的索引
            const currentIndex = FLOW_STEPS.indexOf(standardNodeName);
            if (currentIndex > 0) {
              // 添加所有之前的节点到已完成节点集合
              setCompletedNodes(prevCompleted => {
                const newCompleted = new Set<string>(prevCompleted);
                for (let i = 0; i < currentIndex; i++) {
                  newCompleted.add(FLOW_STEPS[i]);
                }
                return newCompleted;
              });
            }
            
            return newSet;
          });
          
          // 如果状态为"complete"，将其添加到已完成节点集合
          if (status.status === 'complete') {
            setCompletedNodes(prev => {
              const newSet = new Set<string>(prev);
              newSet.add(standardNodeName);
              return newSet;
            });
            
            // 从活跃节点中移除
            setActiveNodes(prev => {
              const newSet = new Set<string>(prev);
              newSet.delete(standardNodeName);
              return newSet;
            });
          }
        }
      );
    } catch (err) {
      console.error('发送消息失败:', err);
      setError(err instanceof Error ? err.message : '请求失败');
      setIsLoading(false);
    }
  };

  // 处理输入变化
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
  };

  // 处理按键事件
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // 重新生成回答
  const handleRefreshAnswer = async () => {
    if (messages.length < 2) return;

    // 删除最后一条助手消息
    setMessages(prevMessages => prevMessages.slice(0, -1));
    
    // 重新发送请求
    setIsLoading(true);
    setCurrentNodeStatus(null);
    setCompletedNodes(new Set());
    setActiveNodes(new Set());
    
    // 获取最后一条用户消息
    const lastUserMessage = [...messages].reverse().find(m => m.role === 'user');
    if (!lastUserMessage) {
      setIsLoading(false);
      return;
    }
    
    // 模拟用户发送该消息，重新触发请求
    setInput(lastUserMessage.content);
    setTimeout(() => {
      handleSendMessage();
    }, 100);
  };

  // 处理收到的点赞/点踩反馈
  const handleFeedback = async (type: 'like' | 'dislike') => {
    if (messages.length === 0 || !chatId) return;

    // 获取最后一条助手消息
    const lastAssistantMessage = [...messages].reverse().find(m => m.role === 'assistant');
    if (!lastAssistantMessage) return;
    
    // 如果没有messageId，使用内容的前10个字符作为临时ID
    const messageId = lastAssistantMessage.messageId || 
                     `temp-${lastAssistantMessage.content.substring(0, 10)}-${Date.now()}`;

    try {
      // 发送反馈到服务器
      await fetch('/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chatId: chatId,
          messageId: messageId,
          feedback: type,
        }),
      });
    } catch (err) {
      console.error('发送反馈失败:', err);
    }
  };

  return (
    <div className={`flex flex-col h-full ${className}`}>
      {/* 消息列表 */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div 
            key={index} 
            className={`${
              message.role === 'user' ? 'flex justify-end' : 'flex justify-start'
            }`}
          >
            <div 
              className={`max-w-3xl ${
                message.role === 'user' 
                  ? 'bg-blue-50 rounded-lg p-3' 
                  : 'w-full'
              }`}
            >
              {message.role === 'user' ? (
                <div className="whitespace-pre-wrap">{message.content}</div>
              ) : (
                <ChatMessage 
                  content={message.content}
                  references={message.references}
                  isLoading={false}
                  onCopy={() => navigator.clipboard.writeText(message.content)}
                  onLike={() => handleFeedback('like')}
                  onDislike={() => handleFeedback('dislike')}
                  onRefresh={handleRefreshAnswer}
                  // 如果有保存的流程步骤信息，使用它
                  completedSteps={(message as any).flowSteps?.completed || []}
                  activeSteps={(message as any).flowSteps?.active || []}
                  allSteps={(message as any).flowSteps?.all || FLOW_STEPS}
                />
              )}
            </div>
          </div>
        ))}

        {/* 正在加载或流式输出的消息 */}
        {(isLoading || isStreaming) && (
          <div className="flex justify-start">
            <div className="w-full">
              <ChatMessage 
                content=""
                isLoading={isLoading}
                isStreaming={isStreaming}
                streamingContent={streamingContent}
                flowNodeStatus={currentNodeStatus}
                completedSteps={Array.from(completedNodes)}
                activeSteps={Array.from(activeNodes)}
                allSteps={FLOW_STEPS}
              />
            </div>
          </div>
        )}

        {/* 错误消息 */}
        {error && (
          <div className="text-center py-2 px-4 bg-red-50 text-red-600 rounded-md">
            {error}
          </div>
        )}
        
        {/* 用于自动滚动的空元素 */}
        <div ref={messagesEndRef} />
      </div>

      {/* 输入框 */}
      <div className="border-t p-4">
        <div className="flex">
          <textarea
            ref={inputRef}
            className="flex-1 border border-gray-300 rounded-l-lg p-2 outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            placeholder="请输入您的问题..."
            rows={2}
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            disabled={isLoading || isStreaming}
          />
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 rounded-r-lg disabled:bg-gray-400"
            onClick={handleSendMessage}
            disabled={!input.trim() || isLoading || isStreaming}
          >
            发送
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatBox; 