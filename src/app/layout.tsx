import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Link from "next/link"

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
})

export const metadata: Metadata = {
  title: "AI-CXaas | AI驱动的智能客服解决方案",
  description: "重新定义客户服务的AI驱动十倍增长引擎 - 首次解决率≥95%，客户LTV提升30%",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="zh">
      <body className={`${inter.variable} font-sans bg-white text-gray-900 min-h-screen`}>
        <header className="fixed top-0 w-full bg-white/90 backdrop-blur-md z-50 border-b border-gray-200">
          <div className="container mx-auto">
            <div className="flex items-center justify-between h-12">
              <div className="flex items-center">
                <Link href="/" className="flex items-center">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="mr-2"
                  >
                    <path
                      d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                      fill="#00CFDD"
                    />
                    <path
                      d="M15.5 9C15.5 10.933 13.933 12.5 12 12.5C10.067 12.5 8.5 10.933 8.5 9C8.5 7.067 10.067 5.5 12 5.5C13.933 5.5 15.5 7.067 15.5 9Z"
                      fill="white"
                    />
                    <path
                      d="M17.5 16.5C17.5 18.433 15.933 20 14 20C12.067 20 10.5 18.433 10.5 16.5C10.5 14.567 12.067 13 14 13C15.933 13 17.5 14.567 17.5 16.5Z"
                      fill="white"
                      fillOpacity="0.7"
                    />
                    <path
                      d="M9.5 16.5C9.5 18.433 7.933 20 6 20C4.067 20 2.5 18.433 2.5 16.5C2.5 14.567 4.067 13 6 13C7.933 13 9.5 14.567 9.5 16.5Z"
                      fill="white"
                      fillOpacity="0.4"
                    />
                  </svg>
                  <span className="text-base font-medium text-gray-900">AI-CXaas</span>
                </Link>
              </div>

              <nav className="hidden md:flex space-x-8">
                <Link
                  href="/solutions"
                  className="text-gray-600 hover:text-primary transition-colors text-sm font-medium"
                >
                  解决方案
                </Link>
                <Link href="/cases" className="text-gray-600 hover:text-primary transition-colors text-sm font-medium">
                  客户案例
                </Link>
                <Link
                  href="/advantages"
                  className="text-gray-600 hover:text-primary transition-colors text-sm font-medium"
                >
                  技术优势
                </Link>
                <Link href="/blog" className="text-gray-600 hover:text-primary transition-colors text-sm font-medium">
                  博客
                </Link>
                <Link
                  href="/pricing"
                  className="text-gray-600 hover:text-primary transition-colors text-sm font-medium"
                >
                  价格
                </Link>
              </nav>

              <div>
                <Link
                  href="/contact"
                  className="bg-gray-900 text-white px-4 py-1.5 rounded-full text-sm font-medium hover:bg-gray-800 transition-colors"
                >
                  开始体验
                </Link>
              </div>
            </div>
          </div>
        </header>

        <main className="pt-12">{children}</main>

        <footer className="bg-gray-50 border-t border-gray-100 py-12 mt-20">
          <div className="container mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
              <div>
                <div className="flex items-center mb-4">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="mr-2"
                  >
                    <path
                      d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                      fill="#00CFDD"
                    />
                    <path
                      d="M15.5 9C15.5 10.933 13.933 12.5 12 12.5C10.067 12.5 8.5 10.933 8.5 9C8.5 7.067 10.067 5.5 12 5.5C13.933 5.5 15.5 7.067 15.5 9Z"
                      fill="white"
                    />
                    <path
                      d="M17.5 16.5C17.5 18.433 15.933 20 14 20C12.067 20 10.5 18.433 10.5 16.5C10.5 14.567 12.067 13 14 13C15.933 13 17.5 14.567 17.5 16.5Z"
                      fill="white"
                      fillOpacity="0.7"
                    />
                    <path
                      d="M9.5 16.5C9.5 18.433 7.933 20 6 20C4.067 20 2.5 18.433 2.5 16.5C2.5 14.567 4.067 13 6 13C7.933 13 9.5 14.567 9.5 16.5Z"
                      fill="white"
                      fillOpacity="0.4"
                    />
                  </svg>
                  <span className="text-base font-medium text-gray-900">AI-CXaas</span>
                </div>
                <p className="text-sm text-gray-500">重新定义客户服务的AI驱动十倍增长引擎</p>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-4">产品</h3>
                <ul className="space-y-2 text-sm">
                  <li>
                    <a href="#" className="text-gray-500 hover:text-primary">
                      解决方案
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-gray-500 hover:text-primary">
                      技术优势
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-gray-500 hover:text-primary">
                      价格
                    </a>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-4">资源</h3>
                <ul className="space-y-2 text-sm">
                  <li>
                    <a href="#" className="text-gray-500 hover:text-primary">
                      博客
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-gray-500 hover:text-primary">
                      客户案例
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-gray-500 hover:text-primary">
                      文档
                    </a>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-4">联系我们</h3>
                <ul className="space-y-2 text-sm">
                  <li>
                    <a href="#" className="text-gray-500 hover:text-primary">
                      support@ai-cxaas.com
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-gray-500 hover:text-primary">
                      400-888-8888
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            <div className="pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center">
              <p className="text-xs text-gray-500">© 2024 AI-CXaas. 保留所有权利</p>
              <div className="flex space-x-6 mt-4 md:mt-0">
                <a href="#" className="text-xs text-gray-500 hover:text-primary">
                  隐私政策
                </a>
                <a href="#" className="text-xs text-gray-500 hover:text-primary">
                  服务条款
                </a>
                <a href="#" className="text-xs text-gray-500 hover:text-primary">
                  法律信息
                </a>
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  )
}