import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { cookies } from 'next/headers';

// 从环境变量中获取 API 密钥和地址
const API_KEY = process.env.FASTGPT_API_KEY;
const API_URL = process.env.FASTGPT_API_URL;

// 创建一个Map存储IP地址和chatID的映射
const ipToChatIdMap = new Map<string, string>();

// 获取IP地址的函数
function getIpAddress(request: NextRequest): string {
  // 获取各种可能的IP头
  const forwardedFor = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  const clientIp = request.headers.get('CF-Connecting-IP') || request.headers.get('X-Client-IP');
  
  // 优先使用 x-forwarded-for，它通常包含原始客户端IP
  if (forwardedFor) {
    // x-forwarded-for 可能包含多个IP，第一个是客户端的原始IP
    const ips = forwardedFor.split(',');
    if (ips.length > 0) {
      return ips[0].trim();
    }
  }
  
  // 依次尝试其他IP头
  return realIp || clientIp || '0.0.0.0'; // 如果都没有，返回默认值
}

// 引用文档类型定义
type Reference = {
  name: string;
  url: string;
};

// 定义消息内容类型
type MessageContent = {
  type: 'text' | 'image_url' | 'file_url';
  text?: string;
  image_url?: {
    url: string;
  };
  name?: string;
  url?: string;
};

// 更新消息类型定义
type Message = {
  role: 'user' | 'assistant' | 'system';
  content: string | MessageContent[];
  references?: Reference[];
};

// 添加变量类型定义
type Variables = {
  [key: string]: string;
};

// 扩展 OpenAI 的 delta 类型
interface ExtendedDelta {
  content?: string;
  references?: Reference[];
  rawContent?: MessageContent[];
}

// 定义知识库项目类型
type KnowledgeItem = {
  sourceName?: string;
  sourceUrl?: string;
  source?: string;
  id?: string;
};

// 定义引用项类型
type QuoteItem = {
  sourceName?: string;
  sourceUrl?: string;
  source?: string;
  id?: string;
  name?: string;
  url?: string;
};

// 定义知识库节点类型
type KnowledgeNode = {
  moduleType: string;
  quoteList?: QuoteItem[];
};

// 定义响应数据节点类型
type ResponseDataNode = {
  moduleType: string;
  quoteList?: KnowledgeItem[];
};

// 备用响应函数，当 API 不可用时使用
function getFallbackResponse(messages: Message[]) {
  // 获取最后一条用户消息
  const lastUserMessage = messages.filter(msg => msg.role === 'user').pop();
  
  if (!lastUserMessage) {
    return {
      role: 'assistant',
      content: '您好，我是闪电侠。请问有什么可以帮助您的吗？'
    };
  }
  
  // 提取用户问题的文本内容
  let userQuestion = '';
  if (typeof lastUserMessage.content === 'string') {
    userQuestion = lastUserMessage.content.toLowerCase();
  } else if (Array.isArray(lastUserMessage.content)) {
    // 从多模态内容中提取文本
    userQuestion = lastUserMessage.content
      .filter(item => item.type === 'text')
      .map(item => (item.type === 'text' && item.text) || '')
      .join(' ')
      .toLowerCase();
  }
  
  // 问候关键词
  if (userQuestion.includes('你好') || userQuestion.includes('您好') || 
      userQuestion.includes('hi') || userQuestion.includes('hello') ||
      userQuestion.includes('嗨') || userQuestion.includes('早上好') ||
      userQuestion.includes('下午好') || userQuestion.includes('晚上好')) {
    return {
      role: 'assistant',
      content: '您好！我是闪电侠，很高兴为您服务。请问有什么可以帮助您的吗？'
    };
  }
  
  
  if (userQuestion.includes('功能') || userQuestion.includes('特点') || userQuestion.includes('能做什么')) {
    return {
      role: 'assistant',
      content: '我们的智能客服系统具有以下核心功能：\n1. 7x24小时自动回复\n2. 多渠道接入（网站、微信、APP等）\n3. 智能问题理解与解答\n4. 人机协作模式\n5. 数据分析与洞察\n6. 定制化知识库\n\n您对哪方面功能更感兴趣？我可以为您提供更详细的介绍。',
      references: [
        {
          name: '产品功能介绍',
          url: 'https://example.com/features'
        },
        {
          name: '技术白皮书',
          url: 'https://example.com/whitepaper'
        }
      ]
    };
  }
  
  if (userQuestion.includes('联系') || userQuestion.includes('咨询') || userQuestion.includes('电话') || userQuestion.includes('微信')) {
    return {
      role: 'assistant',
      content: '您可以通过以下方式联系我们：\n- 电话：400-123-4567\n- 邮箱：contact@example.com\n- 微信：扫描首页的二维码添加客服微信\n\n我们的工作时间是周一至周五 9:00-18:00。',
      references: [
        {
          name: '联系我们',
          url: 'https://example.com/contact'
        }
      ]
    };
  }
  
  // 默认回复
  return {
    role: 'assistant',
    content: '感谢您的咨询。目前我们的系统正在维护中，无法提供完整的智能回复。请您稍后再试，或通过电话400-123-4567联系我们的人工客服。'
  };
}

// 从 FastGPT 响应中提取引用文档
function extractReferences(data: {
  references?: Reference[];
  knowledge?: KnowledgeItem[];
  citation?: Reference[];
  responseData?: ResponseDataNode[];
  text?: string;
  content?: string;
  choices?: Array<{
    message: {
      references?: Reference[];
    };
  }>;
}): Reference[] {
  const references: Reference[] = [];
  
  console.log('开始提取引用文档，原始数据:', JSON.stringify(data).substring(0, 500) + '...');
  
  // 检查是否有引用文档信息
  if (data.references && Array.isArray(data.references)) {
    console.log('从 data.references 提取引用:', data.references);
    return data.references;
  }
  
  // 检查是否有知识库引用
  if (data.knowledge && Array.isArray(data.knowledge)) {
    console.log('从 knowledge 字段提取引用, 数量:', data.knowledge.length);
    data.knowledge.forEach((item: KnowledgeItem) => {
      if (item.sourceName && item.sourceUrl) {
        references.push({
          name: item.sourceName,
          url: item.sourceUrl
        });
      } else if (item.source) {
        references.push({
          name: item.source,
          url: `#${item.source}`
        });
      }
    });
  }
  
  // 检查是否有引用字段
  if (data.citation && Array.isArray(data.citation)) {
    console.log('从 citation 字段提取引用, 数量:', data.citation.length);
    data.citation.forEach((item: Reference) => {
      if (item.name && item.url) {
        references.push({
          name: item.name,
          url: item.url
        });
      }
    });
  }
  
  // 检查 responseData 中是否有知识库搜索节点
  if (data.responseData && Array.isArray(data.responseData)) {
    console.log('检查 responseData 中的知识库搜索节点');
    const knowledgeNodes = data.responseData.filter((node: KnowledgeNode) => 
      node.moduleType === 'datasetSearchNode' && node.quoteList && Array.isArray(node.quoteList)
    );
    
    if (knowledgeNodes.length > 0) {
      console.log('找到知识库搜索节点:', knowledgeNodes.length);
      knowledgeNodes.forEach((node: KnowledgeNode) => {
        console.log(`处理知识库节点, 引用数量:`, node.quoteList?.length);
        node.quoteList?.forEach((quote: QuoteItem) => {
          if (quote.sourceName || quote.source) {
            references.push({
              name: quote.sourceName || quote.source || '',
              url: quote.sourceUrl || `#${quote.id || quote.source}`
            });
          }
        });
      });
    }
  }
  
  // 尝试从内容中解析引用
  if (data.text || data.content) {
    const content = data.text || data.content || '';
    console.log('尝试从内容中解析引用:', content.substring(0, 200) + '...');
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
  
  // 检查 choices 中的消息是否包含引用
  if (data.choices && Array.isArray(data.choices) && data.choices.length > 0) {
    const message = data.choices[0].message;
    if (message && message.references && Array.isArray(message.references)) {
      console.log('从 choices[0].message.references 提取引用:', message.references);
      message.references.forEach((ref: any) => {
        if (ref.name && ref.url) {
          references.push(ref);
        }
      });
    }
  }
  
  console.log('最终提取的引用文档:', references);
  return references;
}

// 准备向 FastGPT 发送的消息，处理多模态内容
function prepareMessagesForFastGPT(messages: Message[]): Message[] {
  return messages.map(msg => {
    // 如果消息内容已经是数组格式，直接返回
    if (Array.isArray(msg.content)) {
      return msg;
    }
    
    // 如果是字符串，转换为 text 类型的数组格式
    if (typeof msg.content === 'string') {
      return {
        ...msg,
        content: [{ type: 'text', text: msg.content }]
      };
    }
    
    return msg;
  });
}

// 从消息内容中提取纯文本
function extractTextFromContent(content: string | MessageContent[]): string {
  if (typeof content === 'string') {
    return content;
  }
  
  // 从多模态内容中提取文本
  return content
    .filter(item => item.type === 'text')
    .map(item => (item.type === 'text' && item.text) || '')
    .join(' ');
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // 获取客户端IP地址
    const clientIp = getIpAddress(request);
    console.log('客户端IP地址:', clientIp);
    
    // 获取或创建chatID
    let chatId = body.chatId;
    
    // 如果请求中没有提供chatId，则检查是否有与IP关联的chatId
    if (!chatId) {
      // 检查是否已存在此IP的chatId
      if (ipToChatIdMap.has(clientIp)) {
        chatId = ipToChatIdMap.get(clientIp);
        console.log('使用已存在的IP关联chatId:', chatId);
      } else {
        // 创建新的chatId
        chatId = uuidv4();
        // 存储IP与chatId的映射
        ipToChatIdMap.set(clientIp, chatId);
        console.log('为IP创建新的chatId:', chatId);
      }
    } else {
      console.log('使用请求提供的chatId:', chatId);
      // 更新IP与chatId的映射
      ipToChatIdMap.set(clientIp, chatId);
    }
    
    // 创建响应对象，我们将在返回时设置cookie
    const cookieOptions = { 
      maxAge: 60 * 60 * 24 * 30, // 30天 
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production'
    };
    
    // 如果 API 配置缺失，使用备用响应
    if (!API_KEY || !API_URL) {
      console.log('API 配置缺失，使用备用响应');
      const fallbackResponse = getFallbackResponse(body.messages);
      
      const response = NextResponse.json({
        choices: [{ message: fallbackResponse }],
        model: 'fallback',
        usage: { total_tokens: 0 },
        references: fallbackResponse.references || [],
        chatId: chatId // 返回chatId给客户端
      });
      
      // 设置cookie
      response.cookies.set('chat_id', chatId, cookieOptions);
      
      return response;
    }

    // 构建 FastGPT API 端点 URL
    // 修复 URL 构建逻辑，避免路径重复
    let baseUrl = API_URL;
    // 移除末尾的斜杠
    baseUrl = baseUrl.replace(/\/+$/, '');
    // 移除末尾的 /api 路径
    baseUrl = baseUrl.replace(/\/api$/, '');
    
    // 根据提供的 curl 示例，正确的端点应该是 /api/v1/chat/completions
    const apiEndpoint = `${baseUrl}/api/v1/chat/completions`;
    
    console.log('发送请求到 FastGPT API:', apiEndpoint);
    
    try {
      // 准备 FastGPT API 请求体
      // 使用用户传入的参数，按照新的接口规范构建请求体
      const fastgptRequestBody: {
        chatId?: string;
        stream: boolean;
        detail: boolean;
        responseChatItemId?: string;
        variables?: Variables;
        messages: Message[];
      } = {
        // 使用获取或创建的chatId
        chatId: chatId,
        // 优先使用用户设置的stream值，默认为false
        stream: body.stream === true,
        // 优先使用用户设置的detail值，默认为true以获取引用文档
        detail: body.detail !== false,
        // 处理消息格式，确保兼容多模态内容
        messages: prepareMessagesForFastGPT(body.messages)
      };

      // 添加可选参数
      if (body.responseChatItemId) {
        fastgptRequestBody.responseChatItemId = body.responseChatItemId;
      }

      // 添加变量
      if (body.variables && typeof body.variables === 'object') {
        fastgptRequestBody.variables = body.variables;
      }
      
      console.log('FastGPT 请求体:', JSON.stringify(fastgptRequestBody));
      
      // 在处理完成后，所有的返回值添加chatId
      if (fastgptRequestBody.stream) {
        // 构建流式请求
        const streamResponse = await fetch(apiEndpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${API_KEY}`
          },
          body: JSON.stringify(fastgptRequestBody),
          signal: AbortSignal.timeout(25000)
        });
        
        // 检查响应状态
        if (!streamResponse.ok) {
          // 流式响应错误处理
          const errorText = await streamResponse.text();
          console.error('API 流式响应错误:', {
            status: streamResponse.status,
            statusText: streamResponse.statusText,
            body: errorText
          });
          
          // 使用备用响应
          console.log('API 流式请求失败，使用备用响应');
          const fallbackResponse = getFallbackResponse(body.messages);
          
          const jsonResponse = NextResponse.json({
            choices: [{ message: fallbackResponse }],
            model: 'fallback',
            usage: { total_tokens: 0 },
            references: fallbackResponse.references || [],
            chatId: chatId // 返回chatId给客户端
          });
          
          // 设置cookie
          jsonResponse.cookies.set('chat_id', chatId, cookieOptions);
          
          return jsonResponse;
        }
        
        // 返回流式响应
        const { readable, writable } = new TransformStream();
        const writer = writable.getWriter();
        const encoder = new TextEncoder();
        
        // 处理 FastGPT 的流式响应并转换为 OpenAI 格式
        (async () => {
          try {
            if (!streamResponse.body) {
              throw new Error('流式响应无效');
            }
            
            const reader = streamResponse.body.getReader();
            const decoder = new TextDecoder();
            let buffer = '';
            
            console.log('开始处理FastGPT流式响应');
            
            // 发送初始的loading事件，这里添加了状态信息
            await writer.write(encoder.encode('event: flowNodeStatus{"status":"running","name":"准备中"}\n\n'));
            
            // 处理 FastGPT 返回的流式数据
            while (true) {
              const { done, value } = await reader.read();
              if (done) {
                break;
              }
              
              // 解码本次接收的数据
              const chunk = decoder.decode(value, { stream: true });
              console.log('收到FastGPT原始数据块:', chunk);
              buffer += chunk;
              
              // 逐行处理数据
              let newlineIndex;
              while ((newlineIndex = buffer.indexOf('\n')) !== -1) {
                const line = buffer.slice(0, newlineIndex);
                buffer = buffer.slice(newlineIndex + 1);
                
                if (line.trim() === '') continue;
                
                // 直接处理 "event: flowNodeStatus..." 格式
                if (line.startsWith('event: flowNodeStatus')) {
                  console.log('收到flowNodeStatus事件:', line);
                  // 直接传递整个事件，包括JSON数据
                  // 检查是否已经有空格分隔
                  if (line.indexOf('event: flowNodeStatus ') === 0) {
                    // 已经有空格，直接传递
                    await writer.write(encoder.encode(`${line}\n\n`));
                  } else {
                    // 没有空格，添加空格再传递
                    const eventPrefix = 'event: flowNodeStatus';
                    const jsonContent = line.substring(eventPrefix.length);
                    await writer.write(encoder.encode(`${eventPrefix} ${jsonContent}\n\n`));
                  }
                  continue;
                }
                
                // 处理 "event: answer..." 格式
                if (line.startsWith('event: answer')) {
                  console.log('收到answer事件:', line.substring(0, 30) + '...');
                  // 直接传递整个事件
                  await writer.write(encoder.encode(`${line}\n\n`));
                  continue;
                }
                
                // FastGPT格式可能是 'data: {...}' 或直接是 '{...}'
                let jsonStr = line;
                if (line.startsWith('data: ')) {
                  jsonStr = line.slice(6);
                }
                
                // 兼容 FastGPT 的 [DONE] 结束标记
                if (jsonStr.includes('[DONE]')) {
                  console.log('收到流式结束标记 [DONE]');
                  await writer.write(encoder.encode('data: [DONE]\n\n'));
                  continue;
                }
                
                try {
                  // 尝试解析 JSON，但只处理不以event:开头的内容
                  if (!line.startsWith('event:')) {
                    const data = JSON.parse(jsonStr);
                    console.log('解析FastGPT数据:', data);
                    
                    // 转换为自定义的event格式
                    
                    // 处理FastGPT的各种事件类型
                    if (data.event === 'answer' && data.text) {
                      // 处理回答事件 - 使用event: answer格式
                      console.log('FastGPT回答事件:', data.text);
                      await writer.write(encoder.encode(`event: answer${data.text}\n\n`));
                    } 
                    else if (data.event === 'flowNodeStatus' && data.status) {
                      // 处理节点状态事件
                      console.log('节点状态事件:', data);
                      await writer.write(encoder.encode(`event: flowNodeStatus ${JSON.stringify(data)}\n\n`));
                    }
                    else if (data.event === 'message') {
                      // 忽略系统消息事件
                      console.log('收到系统消息:', data);
                      continue;
                    }
                    else if (data.event === 'finish' || data.event === 'done') {
                      // 完成事件
                      console.log('收到完成事件');
                      await writer.write(encoder.encode('data: [DONE]\n\n'));
                      continue;
                    }
                    else if (data.choices && data.choices[0]) {
                      // 处理OpenAI格式 - 转换为event: answer格式
                      console.log('OpenAI格式数据');
                      const content = data.choices[0].delta?.content || '';
                      if (content) {
                        await writer.write(encoder.encode(`event: answer${content}\n\n`));
                      }
                      
                      // 如果有引用，暂存起来稍后发送
                      const references = data.choices[0].delta?.references;
                      if (references && Array.isArray(references)) {
                        // 这里可以暂存引用，最后一起发送
                        console.log('收到引用:', references);
                      }
                    }
                    else if (data.text !== undefined) {
                      // 文本格式 - 转换为event: answer格式
                      console.log('文本数据:', data.text);
                      await writer.write(encoder.encode(`event: answer${data.text}\n\n`));
                      
                      // 提取可能的引用
                      const references = extractReferences(data);
                      if (references.length > 0) {
                        console.log('提取到引用:', references);
                        // 这里可以暂存引用，最后一起发送
                      }
                    }
                    else if (data.content !== undefined) {
                      // 内容格式 - 转换为event: answer格式
                      let content = '';
                      if (typeof data.content === 'string') {
                        content = data.content;
                      } else if (Array.isArray(data.content)) {
                        content = extractTextFromContent(data.content);
                      }
                      
                      console.log('内容数据:', content);
                      
                      if (content) {
                        await writer.write(encoder.encode(`event: answer${content}\n\n`));
                      }
                      
                      // 提取可能的引用
                      const references = extractReferences(data);
                      if (references.length > 0) {
                        console.log('提取到引用:', references);
                        // 这里可以暂存引用，最后一起发送
                      }
                    }
                    else {
                      // 尝试将任何无法识别的数据作为事件发送
                      console.log('未知格式数据:', data);
                      if (data.event) {
                        await writer.write(encoder.encode(`event: ${data.event}${JSON.stringify(data)}\n\n`));
                      } else {
                        // 如果没有event字段，默认作为answer发送
                        await writer.write(encoder.encode(`event: answer${JSON.stringify(data)}\n\n`));
                      }
                    }
                  }
                } catch (error) {
                  console.error('解析JSON失败:', error, jsonStr);
                  
                  // 如果不是有效的JSON且不是event:开头，尝试将其作为纯文本发送
                  if (jsonStr && jsonStr.trim() && !jsonStr.includes('[DONE]') && !line.startsWith('event:')) {
                    try {
                      // 直接以event: answer格式发送
                      await writer.write(encoder.encode(`event: answer${jsonStr}\n\n`));
                    } catch (textError) {
                      console.error('发送纯文本失败:', textError);
                    }
                  }
                }
              }
            }
            
            // 流结束，发送结束标记
            console.log('流处理完成，发送结束标记');
            await writer.write(encoder.encode('data: [DONE]\n\n'));
          } catch (error) {
            console.error('流式处理错误:', error);
            // 发送错误消息
            await writer.write(encoder.encode(`event: answer处理错误: ${error instanceof Error ? error.message : '未知错误'}\n\n`));
            await writer.write(encoder.encode('data: [DONE]\n\n'));
          } finally {
            await writer.close();
          }
        })();
        
        // 流式响应返回
        const responseStream = new Response(readable, {
          headers: {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
            'X-Chat-ID': chatId // 添加chatId到响应头
          }
        });
        
        // 对于流式响应，无法直接设置cookie，返回额外的头部
        return responseStream;
      }
      
      // 非流式响应处理
      const apiResponse = await fetch(apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_KEY}`
        },
        body: JSON.stringify(fastgptRequestBody),
        // 修改超时设置为25秒，略小于前端超时时间
        signal: AbortSignal.timeout(25000)
      });

      // 检查响应状态
      if (!apiResponse.ok) {
        // 尝试获取错误响应文本
        const errorText = await apiResponse.text();
        console.error('API 错误响应:', {
          status: apiResponse.status,
          statusText: apiResponse.statusText,
          body: errorText
        });
        
        // 检查是否返回的是 HTML 而不是 JSON
        if (errorText.includes('<!DOCTYPE html>') || errorText.includes('<html>')) {
          console.error('API 返回了 HTML 而不是 JSON，可能是端点配置错误');
        }
        
        // 使用备用响应
        console.log('API 请求失败，使用备用响应');
        const fallbackResponse = getFallbackResponse(body.messages);
        
        const jsonResponse = NextResponse.json({
          choices: [{ message: fallbackResponse }],
          model: 'fallback',
          usage: { total_tokens: 0 },
          references: fallbackResponse.references || [],
          chatId: chatId // 返回chatId给客户端
        });
        
        // 设置cookie
        jsonResponse.cookies.set('chat_id', chatId, cookieOptions);
        
        return jsonResponse;
      }

      // 尝试解析 JSON 响应
      let data;
      try {
        const responseText = await apiResponse.text();
        
        // 检查是否返回的是 HTML 而不是 JSON
        if (responseText.includes('<!DOCTYPE html>') || responseText.includes('<html>')) {
          console.error('API 返回了 HTML 而不是 JSON，可能是端点配置错误');
          throw new Error('API 返回了 HTML 而不是 JSON');
        }
        
        // 尝试解析 JSON
        data = JSON.parse(responseText);
        console.log('FastGPT API 响应:', data);
        
        // 提取引用文档
        const references = extractReferences(data);
        
        // 将 FastGPT 响应格式转换为 OpenAI 格式
        // 如果有responseData，包含详细信息
        if (fastgptRequestBody.detail && data.responseData) {
          // 处理响应内容，确保兼容多模态
          let content = '';
          if (typeof data.text === 'string') {
            content = data.text;
          } else if (typeof data.content === 'string') {
            content = data.content;
          } else if (Array.isArray(data.content)) {
            content = extractTextFromContent(data.content);
          } else {
            content = '';
          }
          
          // 保留原始的responseData
          const jsonResponse = NextResponse.json({
            choices: [{ 
              message: { 
                role: 'assistant', 
                content: content || data.text || data.content || '',
                // 保留原始的多模态内容
                rawContent: data.content,
                references: references
              } 
            }],
            model: 'fastgpt',
            usage: data.usage || { total_tokens: 0 },
            references: references,
            responseData: data.responseData,
            chatId: chatId // 添加chatId到响应
          });
          
          // 设置cookie
          jsonResponse.cookies.set('chat_id', chatId, cookieOptions);
          
          return jsonResponse;
        }
        // 假设 FastGPT 返回的格式是 { text: "回复内容" }
        else if (data.text !== undefined || data.content !== undefined) {
          // 处理可能的多模态内容
          let content = '';
          let rawContent = null;
          
          if (typeof data.text === 'string') {
            content = data.text;
          } else if (typeof data.content === 'string') {
            content = data.content;
          } else if (Array.isArray(data.content)) {
            content = extractTextFromContent(data.content);
            rawContent = data.content;
          }
          
          console.log('使用 text/content 字段作为回复内容，添加引用:', references);
          const jsonResponse = NextResponse.json({
            choices: [{ 
              message: { 
                role: 'assistant', 
                content: content,
                rawContent: rawContent,
                references: references
              } 
            }],
            model: 'fastgpt',
            usage: data.usage || { total_tokens: 0 },
            references: references,
            chatId: chatId // 添加chatId到响应
          });
          
          // 设置cookie
          jsonResponse.cookies.set('chat_id', chatId, cookieOptions);
          
          return jsonResponse;
        } else if (data.choices && data.choices[0] && data.choices[0].message) {
          // 如果已经是 OpenAI 格式，添加引用文档
          console.log('使用 OpenAI 格式回复，添加引用:', references);
          
          // 处理可能的多模态内容
          const message = data.choices[0].message;
          let content = '';
          let rawContent = null;
          
          if (typeof message.content === 'string') {
            content = message.content;
          } else if (Array.isArray(message.content)) {
            content = extractTextFromContent(message.content);
            rawContent = message.content;
          }
          
          // 保存原始内容并更新处理后的文本内容
          if (rawContent) {
            data.choices[0].message.rawContent = rawContent;
            data.choices[0].message.content = content;
          }
          
          if (references.length > 0) {
            data.choices[0].message.references = references;
          }
          data.references = references;
          
          // 添加chatId到响应数据
          data.chatId = chatId;
          
          // 创建响应并设置cookie
          const jsonResponse = NextResponse.json(data);
          jsonResponse.cookies.set('chat_id', chatId, cookieOptions);
          
          return jsonResponse;
        } else {
          console.error('未知的 API 响应格式:', data);
          throw new Error('API 响应格式不正确');
        }
      } catch (parseError) {
        console.error('API 响应解析错误:', parseError);
        
        // 使用备用响应
        console.log('API 响应格式错误，使用备用响应');
        const fallbackResponse = getFallbackResponse(body.messages);
        
        const jsonResponse = NextResponse.json({
          choices: [{ message: fallbackResponse }],
          model: 'fallback',
          usage: { total_tokens: 0 },
          references: fallbackResponse.references || [],
          chatId: chatId // 添加chatId到响应
        });
        
        // 设置cookie
        jsonResponse.cookies.set('chat_id', chatId, cookieOptions);
        
        return jsonResponse;
      }
    } catch (fetchError) {
      console.error('API 请求错误:', fetchError);
      
      // 使用备用响应
      console.log('API 请求错误，使用备用响应');
      const fallbackResponse = getFallbackResponse(body.messages);
      
      const jsonResponse = NextResponse.json({
        choices: [{ message: fallbackResponse }],
        model: 'fallback',
        usage: { total_tokens: 0 },
        references: fallbackResponse.references || [],
        chatId: chatId // 添加chatId到响应
      });
      
      // 设置cookie
      jsonResponse.cookies.set('chat_id', chatId, cookieOptions);
      
      return jsonResponse;
    }
  } catch (error) {
    console.error('API 调用错误:', error);
    
    // 检查是否是超时错误
    if (error instanceof DOMException && error.name === 'AbortError') {
      return NextResponse.json(
        { error: 'API 请求超时', message: '服务器响应时间过长，请稍后再试' },
        { status: 504 }
      );
    }
    
    return NextResponse.json(
      { error: '服务器内部错误', message: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
} 