import { NextRequest, NextResponse } from 'next/server';

/**
 * 处理文件下载请求的API路由
 * 
 * 根据fileId从后端服务获取文件并提供下载
 */
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ fileId: string }> }
) {
  try {
    const { fileId } = await context.params;
    
    // 日志记录，帮助调试
    console.log(`[API] 收到文件下载请求: ${fileId}`);
    
    // 这里应该是从您的后端或存储服务获取文件的逻辑
    // 示例: 构建到您的文件服务的URL
    const backendUrl = process.env.FILE_SERVICE_URL || 'http://172.30.232.99:3003';
    const fileUrl = `${backendUrl}/api/files/${fileId}/download`;
    
    console.log(`[API] 尝试从以下地址获取文件: ${fileUrl}`);
    
    // 发送请求到后端服务
    const response = await fetch(fileUrl, {
      headers: {
        // 如果需要，可以添加认证头
        'Authorization': `Bearer ${process.env.API_KEY || ''}`,
      },
    });
    
    if (!response.ok) {
      console.error(`[API] 文件下载失败: ${response.status} ${response.statusText}`);
      return NextResponse.json(
        { error: '文件获取失败', status: response.status },
        { status: response.status }
      );
    }
    
    // 获取文件内容和类型
    const fileData = await response.arrayBuffer();
    const contentType = response.headers.get('content-type') || 'application/octet-stream';
    const contentDisposition = response.headers.get('content-disposition');
    
    // 创建响应
    const res = new NextResponse(fileData, {
      status: 200,
      headers: {
        'Content-Type': contentType,
      },
    });
    
    // 如果原始响应包含Content-Disposition头，保留它用于下载
    if (contentDisposition) {
      res.headers.set('Content-Disposition', contentDisposition);
    }
    
    console.log(`[API] 文件下载成功，返回给客户端`);
    return res;
    
  } catch (error) {
    console.error('[API] 文件下载处理错误:', error);
    return NextResponse.json(
      { error: '服务器内部错误' },
      { status: 500 }
    );
  }
} 