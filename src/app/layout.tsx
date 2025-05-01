import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import NavHeader from "@/components/layout/nav-header"
import Footer from "@/components/layout/footer"
import ContentWrapper from "@/components/layout/content-wrapper"

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
})

export const metadata: Metadata = {
  title: "AI-CXaas | AI驱动的联络中心解决方案",
  description: "重新定义客户服务的AI驱动十倍增长引擎",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="zh">
      <body className={`${inter.variable} font-sans bg-white text-gray-900 min-h-screen`}>
        {/* 使用客户端组件动态判断是否显示头部 */}
        <NavHeader />
        
        {/* 主内容区 - 使用客户端组件自动调整padding */}
        <ContentWrapper>
          {children}
        </ContentWrapper>
        
        {/* 使用客户端组件动态判断是否显示页脚 */}
        <Footer />
      </body>
    </html>
  )
}