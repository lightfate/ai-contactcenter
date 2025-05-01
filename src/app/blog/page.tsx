"use client"
import Link from "next/link"
import { ChevronRight } from "lucide-react"
import dynamic from "next/dynamic"
import { useEffect, useState } from "react"
import Image from "next/image"

// 动态导入组件，与首页保持一致
const PlaceholderComponent = dynamic(() => import("@/components/Placeholder"), {
  ssr: false,
  loading: () => (
    <div className="bg-primary/10 w-full h-full flex items-center justify-center">
      <span className="text-primary">加载中...</span>
    </div>
  ),
})

export default function Blog() {
  const [mounted, setMounted] = useState(false)

  // 确保组件在客户端渲染
  useEffect(() => {
    setMounted(true)
  }, [])

  // 博客文章数据 - 只保留第一篇
  const blogPost = {
    slug: "ai-reshaping-customer-service",
    title: "AI如何重塑客户服务体验的未来",
    category: "行业洞察",
    excerpt: "AI已成为各个企业必选题，但要成为组织变革仍有不少挑战与阻碍。本文探讨如何通过客户联络场景实现AI战略落地，助力企业加速数字化转型。",
    date: "2025-05-01"
  }

  return (
    <div className="container mx-auto py-12">
      <div className="max-w-5xl mx-auto px-4">
        <div className="mb-10">
          <h1 className="text-3xl sm:text-4xl font-semibold mb-4">博客洞察</h1>
          <p className="text-lg text-gray-600">探索AI客服领域的前沿思考与实践</p>
        </div>

        {/* 博客列表，只展示第一篇 */}
        <div className="blog-card overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2">
            <div className="h-64 md:h-full">
              
              <Image
                          src="/images/blog.png"
                          alt="AI 联络中心"
                          width={600}
                          height={400}
                          className="h-full object-cover"
                        />
            </div>
            <div className="p-6 md:p-8 flex flex-col justify-center">
              <div className="text-sm text-primary font-medium mb-2">{blogPost.category}</div>
              <h3 className="text-xl sm:text-2xl font-semibold mb-4">{blogPost.title}</h3>
              <p className="text-gray-600 mb-6">
                {blogPost.excerpt}
              </p>
              <div className="mt-auto">
                <Link
                  href={`/blog/${blogPost.slug}`}
                  className="text-primary font-medium flex items-center"
                >
                  阅读全文 <ChevronRight className="h-4 w-4 ml-1" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center mt-12">
          <Link href="/" className="btn-tertiary">
            返回首页
          </Link>
        </div>
      </div>
    </div>
  )
} 