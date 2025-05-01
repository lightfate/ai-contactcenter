'use client';

import type React from "react"
import Image from "next/image"
import Link from "next/link"

export default function ChatTemplate({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    // 这个div会包装children，并将其包含在template中
    <div className="flex flex-col h-screen bg-white">
      {/* 聊天页面专属header */}
      
      
      {/* 包含子组件的内容区域 */}
      <div className="flex-1 flex flex-col items-center bg-white">
        <div className="w-full max-w-4xl mx-auto h-full">
          {children}
        </div>
      </div>
    </div>
  )
} 