'use client';

import React from 'react';
import { usePathname } from 'next/navigation';

export default function ContentWrapper({
  children
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname();
  const isChatPage = pathname.startsWith('/chat');

  // 调整内容区的样式，在非聊天页面添加顶部边距，以避免被固定的header覆盖
  return (
    <main className={isChatPage ? "h-full" : "h-full pt-12"}>
      {children}
    </main>
  );
} 