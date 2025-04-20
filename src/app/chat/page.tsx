'use client';
import ChatInterface from "@/components/features/chat-interface"
import Image from "next/image"
import { TooltipProvider } from "@/components/ui/tooltip"

export default function Home() {
  return (
    <TooltipProvider>
      <div className="flex flex-col h-screen bg-white">
        <header className="sticky top-0 z-10 border-b bg-white/90 backdrop-blur-sm">
          <div className="container flex h-14 items-center px-4 max-w-4xl mx-auto">
            <div className="flex items-center gap-2">
              <div className="rounded-md ">
                <Image src="/logo.png" alt="Logo" width={32} height={32} />
              </div>
              <h1 className="text-xl font-bold ">服务中心</h1>
            </div>
            <div className="ml-auto flex items-center gap-2">
              <a
                href="/"
                className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900"
              >
                <svg className="icon-sm">
                  <use href="/icons.svg#icon-home" />
                </svg>
                首页
              </a>
            </div>
          </div>
        </header>
        <main className="flex-1 flex flex-col items-center bg-white">
          <div className="w-full max-w-4xl mx-auto h-full">
            <ChatInterface />
          </div>
        </main>
      </div>
    </TooltipProvider>
  )
}