'use client';

import React from 'react';
import { usePathname } from 'next/navigation';

export default function Footer() {
  const pathname = usePathname();
  const isChatPage = pathname.startsWith('/chat');

  // 如果是聊天页面，不渲染全局页脚
  if (isChatPage) {
    return null;
  }

  // 只在非聊天页面渲染全局页脚
  return (
    <footer className="bg-gray-50 border-t border-gray-100 py-12 mt-20">
      <div className="container mx-auto">
        <div className="pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center">
          <p className="text-xs text-gray-500">版权所有©2000-2025 北京星网锐捷网络技术有限公司 京ICP备13025710号-1 京公网安备11010802020367号</p>
      
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="https://www.ruijie.com.cn/LegalStatement/" className="text-xs text-gray-500 hover:text-primary">
              法律信息
            </a>
            <a href="https://www.ruijie.com.cn/privacy/" className="text-xs text-gray-500 hover:text-primary">
              隐私政策
            </a>
            
          </div>
        </div>
      </div>
    </footer>
  );
} 