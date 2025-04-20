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
    <html lang="zh" className="light">
      <body
        className={`${geist.variable} bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100 text-gray-800 min-h-screen`}
      >
        
        {children}
      </body>
    </html>
  );
}
