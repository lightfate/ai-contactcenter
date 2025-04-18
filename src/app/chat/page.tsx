'use client';

import React from 'react';
import ChatBox from '../../components/ChatBox';

export default function ChatPage() {
  return (
    <div className="flex flex-col h-[calc(100vh-64px)]">
      <header className="bg-white shadow-sm p-4">
        <h1 className="text-xl font-semibold text-gray-800 max-w-5xl mx-auto">智能客服对话</h1>
      </header>
      
      <main className="flex-1 overflow-hidden">
        <div className="max-w-5xl mx-auto h-full">
          <ChatBox className="h-full" />
        </div>
      </main>
      
      <footer className="bg-gray-50 border-t p-2 text-center text-xs text-gray-500">
        © 2025 AI智能客服系统. 本答案由AI生成，仅供参考。
      </footer>
    </div>
  );
} 