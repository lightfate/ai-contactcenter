import { NextRequest, NextResponse } from 'next/server';

// Edge Route，直接在服务端运行
export const config = { runtime: 'edge' };

// 生成随机ID的辅助函数
function generateRandomId(length = 8) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export async function GET(request: NextRequest) {
  // 获取用户IP地址
  const forwarded = request.headers.get('x-forwarded-for') || '';
  const ip = forwarded.split(',')[0].trim() || 'unknown';
  // 将 IP 中的 . 或 : 替换为下划线，避免不合法字符
  const safeIp = ip.replace(/[:\.]/g, '_');
  
  // 生成随机部分
  const randomPart = generateRandomId(8);
  
  // 组合chatId：pc- + IP地址 + 随机码
  const chatId = `pc-${safeIp}-${randomPart}`;
  
  // 添加调试日志
  console.log('[API] 生成chatId:', chatId);
  
  return NextResponse.json({ chatId });
} 