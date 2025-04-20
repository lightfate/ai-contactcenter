import { NextRequest, NextResponse } from 'next/server';

export const config = { runtime: 'edge' };

interface ChatRequestBody {
  chatId: string;
  responseChatItemId?: string;
  variables?: Record<string, any>;
  messages: { role: string; content: string }[];
  stream?: boolean;
  detail?: boolean;
}

function createMockStream(): ReadableStream {
  const encoder = new TextEncoder();
  return new ReadableStream({
    start(controller) {
      // 模拟FastGPT的格式，使用answer事件和delta格式
      const events = [
        JSON.stringify({ 
          choices: [{ 
            delta: { role: "assistant", content: "你" },
            index: 0, 
            finish_reason: null 
          }]
        }),
        JSON.stringify({ 
          choices: [{ 
            delta: { role: "assistant", content: "好" },
            index: 0, 
            finish_reason: null 
          }]
        }),
        JSON.stringify({ 
          choices: [{ 
            delta: { role: "assistant", content: "，" },
            index: 0, 
            finish_reason: null 
          }]
        }),
        JSON.stringify({ 
          choices: [{ 
            delta: { role: "assistant", content: "我" },
            index: 0, 
            finish_reason: null 
          }]
        }),
        JSON.stringify({ 
          choices: [{ 
            delta: { role: "assistant", content: "是" },
            index: 0, 
            finish_reason: null 
          }]
        }),
        JSON.stringify({ 
          choices: [{ 
            delta: { role: "assistant", content: "Mock" },
            index: 0, 
            finish_reason: null 
          }]
        }),
        JSON.stringify({ 
          choices: [{ 
            delta: { role: "assistant", content: "模" },
            index: 0, 
            finish_reason: null 
          }]
        }),
        JSON.stringify({ 
          choices: [{ 
            delta: { role: "assistant", content: "式" },
            index: 0, 
            finish_reason: null 
          }]
        }),
        JSON.stringify({ 
          choices: [{ 
            delta: { role: "assistant", content: "的" },
            index: 0, 
            finish_reason: null 
          }]
        }),
        JSON.stringify({ 
          choices: [{ 
            delta: { role: "assistant", content: "AI" },
            index: 0, 
            finish_reason: null 
          }]
        }),
        JSON.stringify({ 
          choices: [{ 
            delta: { role: "assistant", content: "助" },
            index: 0, 
            finish_reason: null 
          }]
        }),
        JSON.stringify({ 
          choices: [{ 
            delta: { role: "assistant", content: "手" },
            index: 0, 
            finish_reason: null 
          }]
        }),
        JSON.stringify({ 
          choices: [{ 
            delta: { role: "assistant", content: "。" },
            index: 0, 
            finish_reason: null 
          }]
        }),
        // 添加引用来源
        JSON.stringify({
          references: [
            { title: '示例文档', url: 'https://example.com/doc1' },
            { title: '参考资料', url: 'https://example.com/doc2' },
          ],
        }),
      ];
      
      let i = 0;
      const push = () => {
        if (i < events.length) {
          controller.enqueue(encoder.encode(`data: ${events[i]}\n\n`));
          i++;
          setTimeout(push, 200);
        } else {
          controller.enqueue(encoder.encode(`data: {"choices":[{"delta":{},"index":0,"finish_reason":"stop"}]}\n\n`));
          controller.enqueue(encoder.encode('data: [DONE]\n\n'));
          controller.close();
        }
      };
      push();
    },
  });
}

export async function POST(request: NextRequest) {
  try {
    const body: ChatRequestBody = await request.json();
    
    // 验证请求体必填字段
    if (!body.chatId || !body.messages || body.messages.length === 0) {
      return NextResponse.json(
        { error: '缺少必要参数' },
        { status: 400 }
      );
    }

    console.log('[API] 收到聊天请求:', body);

    // Mock 模式
    if (process.env.FASTGPT_MOCK === 'true') {
      console.log('[API] 使用Mock模式返回');
      return new NextResponse(createMockStream(), {
        headers: { 
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive' 
        },
      });
    }

    console.log('[API] 调用FastGPT API:', process.env.FASTGPT_API_URL);
    
    // 真实调用 FastGPT，注意URL已包含/api路径，不要重复添加
    const apiUrl = `${process.env.FASTGPT_API_URL}/v1/chat/completions`;
    
    // 构造请求参数，保留原始请求中的所有参数
    const requestBody = {
      ...body,
      stream: body.stream !== false, // 默认为true
      detail: body.detail !== false, // 默认为true
    };
    
    console.log('[API] 请求参数:', requestBody);
    
    const fastgptRes = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.FASTGPT_API_KEY}`,
      },
      body: JSON.stringify(requestBody),
    });

    if (!fastgptRes.ok) {
      const errorText = await fastgptRes.text();
      console.error('[API] FastGPT请求失败:', fastgptRes.status, errorText);
      return NextResponse.json(
        { error: `FastGPT API请求失败: ${fastgptRes.status}` },
        { status: fastgptRes.status }
      );
    }

    return new NextResponse(fastgptRes.body, {
      headers: { 
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive'
      },
    });
  } catch (error) {
    console.error('[API] 处理请求出错:', error);
    return NextResponse.json(
      { error: '服务器内部错误' },
      { status: 500 }
    );
  }
} 