import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

// 从环境变量中获取 API 密钥和地址
const API_KEY = process.env.FASTGPT_API_KEY;
const API_URL = process.env.FASTGPT_API_URL;

// 引用文档类型定义
type Reference = {
  name: string;
  url: string;
};

// 定义消息类型
type Message = {
  role: 'user' | 'assistant' | 'system';
  content: string;
  references?: Reference[];
};

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
  
  const userQuestion = lastUserMessage.content.toLowerCase();
  
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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // 如果 API 配置缺失，使用备用响应
    if (!API_KEY || !API_URL) {
      console.log('API 配置缺失，使用备用响应');
      const fallbackResponse = getFallbackResponse(body.messages);
      
      return NextResponse.json({
        choices: [{ message: fallbackResponse }],
        model: 'fallback',
        usage: { total_tokens: 0 },
        references: fallbackResponse.references || []
      });
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
      // 根据提供的 curl 示例调整请求格式
      const fastgptRequestBody = {
        chatId: uuidv4(), // 生成唯一的会话 ID
        stream: false,
        detail: true, // 设置为 true 以获取引用文档信息
        messages: body.messages
      };
      
      console.log('FastGPT 请求体:', JSON.stringify(fastgptRequestBody));
      
      // 构建请求到 FastGPT API
      const response = await fetch(apiEndpoint, {
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
      if (!response.ok) {
        // 尝试获取错误响应文本
        const errorText = await response.text();
        console.error('API 错误响应:', {
          status: response.status,
          statusText: response.statusText,
          body: errorText
        });
        
        // 检查是否返回的是 HTML 而不是 JSON
        if (errorText.includes('<!DOCTYPE html>') || errorText.includes('<html>')) {
          console.error('API 返回了 HTML 而不是 JSON，可能是端点配置错误');
        }
        
        // 使用备用响应
        console.log('API 请求失败，使用备用响应');
        const fallbackResponse = getFallbackResponse(body.messages);
        
        return NextResponse.json({
          choices: [{ message: fallbackResponse }],
          model: 'fallback',
          usage: { total_tokens: 0 },
          references: fallbackResponse.references || []
        });
      }

      // 尝试解析 JSON 响应
      let data;
      try {
        const responseText = await response.text();
        
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
        // 假设 FastGPT 返回的格式是 { text: "回复内容" }
        if (data.text !== undefined) {
          console.log('使用 text 字段作为回复内容，添加引用:', references);
          return NextResponse.json({
            choices: [{ 
              message: { 
                role: 'assistant', 
                content: data.text,
                references: references
              } 
            }],
            model: 'fastgpt',
            usage: data.usage || { total_tokens: 0 },
            references: references
          });
        } else if (data.choices && data.choices[0] && data.choices[0].message) {
          // 如果已经是 OpenAI 格式，添加引用文档
          console.log('使用 OpenAI 格式回复，添加引用:', references);
          if (references.length > 0) {
            data.choices[0].message.references = references;
          }
          data.references = references;
          
          // 直接返回
          return NextResponse.json(data);
        } else {
          console.error('未知的 API 响应格式:', data);
          throw new Error('API 响应格式不正确');
        }
      } catch (parseError) {
        console.error('API 响应解析错误:', parseError);
        
        // 使用备用响应
        console.log('API 响应格式错误，使用备用响应');
        const fallbackResponse = getFallbackResponse(body.messages);
        
        return NextResponse.json({
          choices: [{ message: fallbackResponse }],
          model: 'fallback',
          usage: { total_tokens: 0 },
          references: fallbackResponse.references || []
        });
      }
    } catch (fetchError) {
      console.error('API 请求错误:', fetchError);
      
      // 使用备用响应
      console.log('API 请求错误，使用备用响应');
      const fallbackResponse = getFallbackResponse(body.messages);
      
      return NextResponse.json({
        choices: [{ message: fallbackResponse }],
        model: 'fallback',
        usage: { total_tokens: 0 },
        references: fallbackResponse.references || []
      });
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