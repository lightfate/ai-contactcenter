// test-api.js - API测试脚本
const fetch = require('node-fetch');

async function testSession() {
  try {
    console.log('测试 /api/session 接口');
    const res = await fetch('http://localhost:50010/api/session');
    
    if (res.ok) {
      const data = await res.json();
      console.log('会话API响应成功:', data);
      return data.chatId;
    } else {
      console.error('会话API响应错误:', res.status);
      return null;
    }
  } catch (error) {
    console.error('测试会话API出错:', error.message);
    return null;
  }
}

async function testChat(chatId) {
  try {
    console.log('测试 /api/chat 接口');
    const res = await fetch('http://localhost:50010/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chatId: chatId || 'test-chat-id',
        messages: [{ role: 'user', content: '你好' }],
        variables: {},
      }),
    });
    
    if (res.ok) {
      // 检查是否为流响应
      const contentType = res.headers.get('content-type');
      if (contentType && contentType.includes('text/event-stream')) {
        console.log('聊天API响应成功 (流式响应)');
        
        // 读取流数据
        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';
        
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          
          buffer += decoder.decode(value, { stream: true });
          const parts = buffer.split(/\r?\n\r?\n/);
          buffer = parts.pop() || '';
          
          for (const chunk of parts) {
            if (!chunk.startsWith('data:')) continue;
            const data = chunk.replace(/^data:\s*/, '').trim();
            
            if (data === '[DONE]') {
              console.log('收到[DONE]标志');
              continue;
            }
            
            try {
              const payload = JSON.parse(data);
              console.log('解析的SSE数据片段:', payload);
            } catch (error) {
              console.error('解析SSE数据失败:', error);
            }
          }
        }
        
        console.log('流数据读取完成');
      } else {
        const data = await res.json();
        console.log('聊天API响应成功:', data);
      }
    } else {
      const text = await res.text();
      console.error('聊天API响应错误:', res.status, text);
    }
  } catch (error) {
    console.error('测试聊天API出错:', error.message);
  }
}

async function runTests() {
  console.log('开始API测试...');
  
  // 1. 测试会话API
  const chatId = await testSession();
  
  // 2. 测试聊天API
  await testChat(chatId);
  
  console.log('API测试完成');
}

runTests(); 