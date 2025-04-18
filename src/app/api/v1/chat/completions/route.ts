import { NextRequest, NextResponse } from 'next/server';

// 从环境变量中获取 API 密钥和地址
const API_KEY = process.env.FASTGPT_API_KEY;
const API_URL = process.env.FASTGPT_API_URL;

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

// 确保ChatID有PC-前缀
function ensurePCPrefix(chatId: string, ip: string): string {
  // 如果已经有PC-前缀，直接返回
  if (chatId.startsWith('PC-')) {
    return chatId;
  }
  
  // 否则用IP创建新的ChatID
  return `PC-${ip.replace(/\./g, '_')}-${chatId}`;
}

export async function POST(request: NextRequest) {
  try {
    // 解析请求体
    const body = await request.json();
    
    // 获取客户端IP地址
    const clientIp = getIpAddress(request);
    console.log('客户端IP地址:', clientIp);
    
    // 确保ChatID有PC-前缀
    let chatId = body.chatId || '';
    chatId = ensurePCPrefix(chatId, clientIp);
    console.log('使用的ChatID:', chatId);
    
    // 如果 API 配置缺失，返回错误
    if (!API_KEY || !API_URL) {
      console.error('API 配置缺失');
      return NextResponse.json(
        { error: 'API配置缺失，无法处理请求' },
        { status: 500 }
      );
    }

    // 构建 FastGPT API 端点 URL
    // 修复 URL 构建逻辑，避免路径重复
    let baseUrl = API_URL;
    // 移除末尾的斜杠
    baseUrl = baseUrl.replace(/\/+$/, '');
    // 移除末尾的 /api 路径
    baseUrl = baseUrl.replace(/\/api$/, '');
    
    // 拼接完整API URL
    const apiEndpoint = `${baseUrl}/api/v1/chat/completions`;
    
    console.log('发送请求到 FastGPT API:', apiEndpoint);
    
    // 准备转发请求体
    const requestBody = {
      ...body,
      chatId // 使用处理后的ChatID
    };
    
    console.log('请求体:', JSON.stringify(requestBody).substring(0, 500) + '...');
    
    // 发送请求到后端API
    const response = await fetch(apiEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      body: JSON.stringify(requestBody)
    });
    
    // 检查响应状态
    if (!response.ok) {
      const errorText = await response.text();
      console.error('API 响应错误:', {
        status: response.status,
        statusText: response.statusText,
        body: errorText
      });
      
      return NextResponse.json(
        { error: `API请求失败: ${response.status} ${response.statusText}` },
        { status: response.status }
      );
    }
    
    // 如果是流式响应，直接转发
    if (body.stream) {
      // 获取原始响应头
      const headers = new Headers();
      
      // 复制所有响应头
      response.headers.forEach((value, key) => {
        headers.set(key, value);
      });
      
      // 创建新的ReadableStream
      const { readable, writable } = new TransformStream();
      (async () => {
        if (!response.body) {
          return;
        }
        
        // 转发流数据
        const reader = response.body.getReader();
        const writer = writable.getWriter();
        
        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            await writer.write(value);
          }
        } finally {
          writer.close();
        }
      })();
      
      // 返回流式响应
      return new NextResponse(readable, {
        headers,
        status: response.status,
        statusText: response.statusText
      });
    } else {
      // 对于非流式响应，返回JSON
      const data = await response.json();
      return NextResponse.json(data);
    }
  } catch (error) {
    console.error('处理请求失败:', error);
    return NextResponse.json(
      { error: '内部服务器错误' },
      { status: 500 }
    );
  }
} 