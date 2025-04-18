import { v4 as uuidv4 } from 'uuid';

// 定义消息类型
export type MessageRole = 'user' | 'assistant' | 'system';

// 定义引用类型
export type Reference = {
  name: string;
  url: string;
};

// 定义消息类型
export interface Message {
  role: MessageRole;
  content: string;
  references?: Reference[];
}

// 定义聊天响应类型
export interface ChatResponse {
  answer: string;
  references?: Reference[];
  chatId?: string;
}

// 存储IP地址的本地缓存
let cachedIp: string = 'unknown';

// 生成带有前缀的ChatID
function generateChatId(ip: string): string {
  return `PC-${ip.replace(/\./g, '_')}-${uuidv4().substring(0, 8)}`;
}

// 从localStorage获取ChatID，如果不存在则创建一个
function getChatId(): string {
  // 从localStorage获取ChatID
  const storedChatId = localStorage.getItem('chatId');
  
  if (storedChatId) {
    return storedChatId;
  }
  
  // 如果没有存储的ChatID，则使用IP创建一个新的
  const newChatId = generateChatId(cachedIp);
  localStorage.setItem('chatId', newChatId);
  return newChatId;
}

// 获取客户端IP地址
async function getClientIp(): Promise<string> {
  // 如果已经有缓存的IP，直接返回
  if (cachedIp !== 'unknown') {
    return cachedIp;
  }
  
  try {
    // 通过公共API获取IP地址
    const response = await fetch('https://api.ipify.org?format=json');
    const data = await response.json();
    cachedIp = data.ip;
    return cachedIp;
  } catch (error) {
    console.error('获取IP地址失败:', error);
    // 如果获取失败，使用一个随机字符串作为标识
    const randomId = Math.random().toString(36).substring(2, 10);
    cachedIp = `unknown_${randomId}`;
    return cachedIp;
  }
}

// 初始化函数，在应用启动时调用，获取IP地址
export async function initApi(): Promise<void> {
  try {
    await getClientIp();
  } catch (error) {
    console.error('API初始化失败:', error);
  }
}

// 发送聊天消息到API
export async function sendChatMessage(messages: Message[], variables?: Record<string, string>): Promise<ReadableStream<Uint8Array> | null> {
  try {
    // 获取或创建ChatID
    const chatId = getChatId();
    
    // 构建请求体
    const requestBody = {
      chatId,
      stream: true,
      detail: true,
      responseChatItemId: `resp-${uuidv4().substring(0, 8)}`,
      variables: {
        ...(variables || {}),
        uid: localStorage.getItem('userId') || uuidv4().substring(0, 16),
        // 可以添加其他默认变量
      },
      messages
    };
    
    // 发送请求到后端
    const response = await fetch('/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_FASTGPT_API_KEY || 'fastgpt-default-key'}`
      },
      body: JSON.stringify(requestBody)
    });
    
    // 检查响应
    if (!response.ok) {
      throw new Error(`API请求失败: ${response.status} ${response.statusText}`);
    }
    
    // 返回流式数据
    return response.body;
  } catch (error) {
    console.error('发送聊天消息失败:', error);
    return null;
  }
}

// 处理流式响应数据
export async function processStreamResponse(
  stream: ReadableStream<Uint8Array>,
  onContent: (content: string) => void,
  onComplete: (response: ChatResponse) => void,
  onError: (error: Error) => void,
  onStatus?: (status: { status: string; name: string }) => void
): Promise<void> {
  try {
    const reader = stream.getReader();
    const decoder = new TextDecoder();
    let buffer = '';
    let accumulatedContent = '';
    let references: Reference[] = [];
    
    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        break;
      }
      
      // 解码本次接收的数据
      const chunk = decoder.decode(value, { stream: true });
      buffer += chunk;
      
      // 逐行处理数据
      let newlineIndex;
      while ((newlineIndex = buffer.indexOf('\n')) !== -1) {
        const line = buffer.slice(0, newlineIndex);
        buffer = buffer.slice(newlineIndex + 1);
        
        if (line.trim() === '') continue;
        
        // 处理状态更新
        if (line.startsWith('event: flowNodeStatus')) {
          if (onStatus) {
            try {
              const statusMatch = line.match(/^event: flowNodeStatus\s+(.+)$/);
              if (statusMatch && statusMatch[1]) {
                const statusData = JSON.parse(statusMatch[1].trim());
                onStatus(statusData);
              }
            } catch (e) {
              console.error('解析状态数据失败:', e);
            }
          }
          continue;
        }
        
        // 检查是否是结束标记
        if (line.includes('[DONE]')) {
          onComplete({
            answer: accumulatedContent,
            references
          });
          return;
        }
        
        // 处理数据行
        if (line.startsWith('data: ')) {
          try {
            const data = JSON.parse(line.substring(6));
            
            // 处理内容增量
            if (data.choices && data.choices[0] && data.choices[0].delta) {
              const delta = data.choices[0].delta;
              
              // 处理文本内容
              if (delta.content) {
                accumulatedContent += delta.content;
                onContent(accumulatedContent);
              }
              
              // 处理引用
              if (delta.references && Array.isArray(delta.references)) {
                references = delta.references;
              }
            }
          } catch (e) {
            console.error('解析数据行失败:', e, line);
          }
        }
      }
    }
    
    // 处理最后的内容
    if (accumulatedContent.trim() !== '') {
      onComplete({
        answer: accumulatedContent,
        references
      });
    }
  } catch (error) {
    console.error('处理流式响应失败:', error);
    onError(error instanceof Error ? error : new Error(String(error)));
  }
} 