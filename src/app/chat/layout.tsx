import type React from "react"
import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"

export const metadata: Metadata = {
  title: "AI客服 | 服务中心",
  description: "AI客服服务中心",
}

// 告诉Next.js这是一个根布局，不要嵌套在RootLayout内部
export const config = {
  isRoot: true
}

export default function ChatLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="flex flex-col min-h-screen">
      {/* 聊天页面专属header */}
      <header className="sticky top-0 z-10 border-b bg-white/90 backdrop-blur-sm">
        <div className="container flex h-14 items-center px-4 max-w-4xl mx-auto">
          <div className="flex items-center gap-2">
            <div className="rounded-md ">
              <Image src="/logo.png" alt="Logo" width={32} height={32} />
            </div>
            <h1 className="text-xl font-bold ">服务中心</h1>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <Link
              href="/"
              className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900"
            >
              <svg className="icon-sm">
                <use href="/icons.svg#icon-home" />
              </svg>
              首页
            </Link>
          </div>
        </div>
      </header>
      
      {/* 聊天内容区 */}
      <div className="flex-grow">
        {children}
      </div>
      
    
    </div>
  )
} 