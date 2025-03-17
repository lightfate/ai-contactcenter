'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';

// 扩展消息类型定义，添加引用文档字段
type Reference = {
  name: string;
  url: string;
};

type Message = {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp?: Date;
  references?: Reference[]; // 添加引用文档字段
};

// 客服页面组件
export default function CustomerService() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'system',
      content: '您好，我是锐捷工程师闪电侠。请您描述下您的问题，比如参数查询，配置查询，维保查询，故障排查等，以便我为您解决问题。',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // 自动滚动到最新消息
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // 自动调整输入框高度
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 150)}px`;
    }
  }, [input]);

  // 发送消息到 API
  const sendMessage = async () => {
    if (!input.trim()) return;
    
    const userMessage: Message = {
      role: 'user',
      content: input.trim(),
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    
    try {
      // 准备发送到 API 的消息历史
      const messageHistory = messages
        .filter(msg => msg.role !== 'system' || messages.indexOf(msg) === 0)
        .map(({ role, content }) => ({ role, content }));
      
      // 添加用户最新消息
      messageHistory.push({ role: userMessage.role, content: userMessage.content });
      
      console.log('发送消息到 API:', messageHistory);
      
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo', // 兼容 OpenAI 格式
          messages: messageHistory,
          temperature: 0.7,
          max_tokens: 1000,
        }),
        // 修改超时设置为30秒，给予足够的处理时间
        signal: AbortSignal.timeout(30000)
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('API 响应错误:', {
          status: response.status,
          statusText: response.statusText,
          body: errorText
        });
        
        try {
          const errorData = JSON.parse(errorText);
          throw new Error(errorData.error || errorData.message || 'API 请求失败');
        } catch (e) {
          throw new Error(`API 请求失败 (${response.status}): ${response.statusText}`);
        }
      }
      
      let data;
      try {
        data = await response.json();
        console.log('API 响应:', data);
        
        // 添加详细日志
        console.log('API 响应格式检查:', {
          hasChoices: !!data.choices,
          hasFirstChoice: !!(data.choices && data.choices[0]),
          hasMessage: !!(data.choices && data.choices[0] && data.choices[0].message),
          model: data.model,
          hasReferences: !!(data.references && Array.isArray(data.references)),
          referencesLength: data.references ? data.references.length : 0,
          messageReferences: !!(data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.references),
          messageReferencesLength: (data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.references) ? data.choices[0].message.references.length : 0
        });
      } catch (parseError) {
        console.error('API 响应解析错误:', parseError);
        throw new Error('API 响应格式错误');
      }
      
      if (!data.choices || !data.choices[0] || !data.choices[0].message) {
        console.error('API 响应格式不正确:', data);
        throw new Error('API 响应格式不正确');
      }
      
      // 检查是否使用了备用响应
      if (data.model === 'fallback') {
        console.log('使用了备用响应');
      }
      
      // 提取引用文档信息
      let references: Reference[] = [];
      
      // 检查是否有引用文档信息
      if (data.references && Array.isArray(data.references)) {
        console.log('从 data.references 提取引用:', data.references);
        references = data.references;
      } else if (data.choices[0].message.references && Array.isArray(data.choices[0].message.references)) {
        console.log('从 message.references 提取引用:', data.choices[0].message.references);
        references = data.choices[0].message.references;
      }
      
      // 如果没有引用信息，尝试从内容中解析
      if (references.length === 0) {
        console.log('没有找到直接引用，尝试从内容中解析');
        const content = data.choices[0].message.content;
        // 尝试解析内容中的引用格式，例如 [1]: 文档名称 (http://example.com)
        const referenceRegex = /\[(\d+)\]:\s*(.*?)\s*\((https?:\/\/[^\s)]+)\)/g;
        let match;
        while ((match = referenceRegex.exec(content)) !== null) {
          console.log('从内容中解析到引用:', match);
          references.push({
            name: match[2],
            url: match[3]
          });
        }
      }
      
      console.log('最终提取的引用文档:', references);
      
      const assistantMessage: Message = {
        role: 'assistant',
        content: data.choices[0].message.content,
        timestamp: new Date(),
        // 暂时不添加引用文档到消息中
        // references: references.length > 0 ? references : undefined
      };
      
      console.log('创建的助手消息:', assistantMessage);
      // 仍然记录引用文档信息，但不用于显示
      if (references.length > 0) {
        console.log('有可用的引用文档，但当前已隐藏显示:', references);
      }
      
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('发送消息错误:', error);
      
      // 检查是否是超时错误
      if (error instanceof DOMException && error.name === 'AbortError') {
        setMessages(prev => [
          ...prev,
          {
            role: 'assistant',
            content: '抱歉，服务器响应时间过长，请稍后再试。',
            timestamp: new Date()
          }
        ]);
      } else {
        // 添加错误消息
        setMessages(prev => [
          ...prev,
          {
            role: 'assistant',
            content: `抱歉，我遇到了一些问题：${error instanceof Error ? error.message : '请稍后再试'}`,
            timestamp: new Date()
          }
        ]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // 处理按键事件
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* 顶部导航 */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 text-transparent bg-clip-text">
            闪电侠Beta
          </Link>
          <Link href="/" className="text-gray-600 hover:text-blue-600 transition-colors">
            返回首页
          </Link>
        </div>
      </header>

      {/* 聊天区域 */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6">
        <div className="max-w-3xl mx-auto space-y-6">
          {messages.map((message, index) => (
            <div 
              key={index} 
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div 
                className={`max-w-[80%] rounded-lg p-4 ${
                  message.role === 'user' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-white border border-gray-200 text-gray-800'
                }`}
              >
                <div className="text-sm mb-1">
                  {message.role === 'user' ? '您' : '闪电侠'}
                  {message.timestamp && (
                    <span className="text-xs opacity-70 ml-2">
                      {message.timestamp.toLocaleTimeString()}
                    </span>
                  )}
                </div>
                <div className="whitespace-pre-wrap">{message.content}</div>
                
                {/* 显示引用文档 - 暂时隐藏 
                {message.references && message.references.length > 0 && (
                  <div className="mt-3 pt-2 border-t border-gray-200">
                    <p className="text-xs text-gray-500 mb-1">参考文档:</p>
                    <ul className="space-y-1">
                      {message.references.map((ref, idx) => {
                        console.log(`渲染引用文档 ${idx}:`, ref);
                        return (
                          <li key={idx} className="text-xs">
                            <a 
                              href={ref.url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-blue-500 hover:underline flex items-center"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                              </svg>
                              {ref.name || `参考文档 ${idx + 1}`}
                            </a>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                )}
                */}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white border border-gray-200 rounded-lg p-4 text-gray-800 max-w-[80%]">
                <div className="text-sm mb-1">闪电侠</div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* 输入区域 */}
      <div className="bg-white border-t border-gray-200 p-4">
        <div className="max-w-3xl mx-auto">
          <div className="relative">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="输入您的问题..."
              className="w-full border border-gray-300 rounded-lg py-3 px-4 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              rows={1}
              disabled={isLoading}
            />
            <button
              onClick={sendMessage}
              disabled={isLoading || !input.trim()}
              className={`absolute right-3 bottom-3 p-1 rounded-full ${
                isLoading || !input.trim() 
                  ? 'text-gray-400 cursor-not-allowed' 
                  : 'text-blue-600 hover:bg-blue-100'
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>
          <div className="text-xs text-gray-500 mt-2 text-center">
            闪电侠随时为您提供帮助，请输入您的问题
          </div>
        </div>
      </div>
    </div>
  );
} 