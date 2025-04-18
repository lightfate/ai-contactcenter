import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "X - GenAI-Contact Center | AI驱动的智能客服解决方案",
  description: "重新定义客户服务的AI驱动十倍增长引擎 - 首次解决率≥95%，客户LTV提升30%",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh">
      <body
        className={`${geist.variable} bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100 text-gray-800 min-h-screen`}
      >
        <nav className="bg-white shadow-sm p-4">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <Link href="/" className="font-bold text-xl text-blue-600">
              AI智能客服
            </Link>
            <div className="flex space-x-4">
              <Link href="/" className="hover:text-blue-600 transition-colors">
                首页
              </Link>
              <Link href="/chat" className="hover:text-blue-600 transition-colors">
                聊天咨询
              </Link>
              <Link href="/customer-service" className="hover:text-blue-600 transition-colors">
                客服中心
              </Link>
            </div>
          </div>
        </nav>
        {children}
      </body>
    </html>
  );
}
