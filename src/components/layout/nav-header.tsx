'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

export default function NavHeader() {
  const pathname = usePathname();
  const isChatPage = pathname.startsWith('/chat');

  // 添加百度统计代码
  useEffect(() => {
    // 如果百度统计尚未加载，则加载它
    if (!(window as any)._hmt) {
      (window as any)._hmt = [];
      const hm = document.createElement('script');
      hm.src = 'https://hm.baidu.com/hm.js?e237c71b5370a2c84d15c141083ed699';
      const s = document.getElementsByTagName('script')[0];
      s.parentNode?.insertBefore(hm, s);
    }
  }, []);

  // 如果是聊天页面，不渲染全局头部
  if (isChatPage) {
    return null;
  }

  // 只在非聊天页面渲染全局头部
  return (
    <header className="fixed top-0 w-full bg-white/90 backdrop-blur-md z-50 border-b border-gray-200">
      <div className="container mx-auto">
        <div className="flex items-center justify-between h-12">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <div className="rounded-md">
                <Image src="/logo.png" alt="Logo" width={32} height={32} />
              </div>
              <span className="text-base font-medium text-gray-700"> Cyanix 锐捷青鸟AI联络中心解决方案</span>
            </Link>
          </div>

          <div>
            <Link
              href="/chat"
              className="bg-gray-900 text-white px-4 py-1.5 rounded-full text-sm font-medium hover:bg-gray-800 transition-colors"
            >
              开始体验
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
} 