'use client';

import React from 'react';
import ChatBox from '../../components/ChatBox';

export default function ChatPage() {
  return (
    <div className="flex flex-col h-[calc(100vh-64px)]">
      
      
      <main className="flex-1 overflow-hidden">
        <div className="max-w-5xl mx-auto h-full">
          <ChatBox className="h-full" />
        </div>
      </main>
      
      <footer className="bg-gray-50 border-t p-2 text-center text-xs text-gray-500">
        © 2025 锐捷青鸟AI联络中心解决方案提供服务。
      </footer>
    </div>
  );
} 