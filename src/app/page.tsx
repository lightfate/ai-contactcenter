"use client"
import Link from "next/link"
import { Check, DollarSign, Zap, ChevronRight, ArrowRight } from "lucide-react"
import dynamic from "next/dynamic"
import { useEffect, useState } from "react"

// 动态导入组件
const GridDotBackground = dynamic(() => import("@/components/GridDotBackground"), {
  ssr: false,
  loading: () => null,
})
const PlaceholderComponent = dynamic(() => import("@/components/Placeholder"), {
  ssr: false,
  loading: () => (
    <div className="bg-primary/10 w-full h-full flex items-center justify-center">
      <span className="text-primary">加载中...</span>
    </div>
  ),
})

export default function Home() {
  const [mounted, setMounted] = useState(false)

  // 确保组件在客户端渲染
  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <>
      {/* Hero Section - 苹果风格 */}
      <section className="apple-section bg-white relative overflow-hidden">
        {mounted && <GridDotBackground />}
        <div className="container mx-auto relative z-10">
          <div className="max-w-4xl mx-auto text-center px-4">
            <h1
              className="text-3xl sm:text-4xl md:text-5xl font-semibold mb-4 animate-slide-up opacity-0"
              style={{ animationFillMode: "forwards" }}
            >
              让每一次互动都成为增长的机会
            </h1>
            <p
              className="text-lg sm:text-xl text-gray-600 mb-8 max-w-3xl mx-auto animate-slide-up opacity-0"
              style={{ animationDelay: "0.2s", animationFillMode: "forwards" }}
            >
              With Cyanix,  Every Voice Matters,  Every Touch Grows
            </p>
            <div
              className="flex flex-wrap justify-center gap-4 animate-slide-up opacity-0"
              style={{ animationDelay: "0.4s", animationFillMode: "forwards" }}
            >
              <Link href="/chat" className="btn-primary">
                立即体验
              </Link>
              <Link href="/learn-more" className="text-primary font-medium flex items-center">
                了解更多 <ChevronRight className="h-4 w-4 ml-1" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Product Screenshots - 卡片式布局 */}
      <section className="py-16 bg-secondary">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto">
            {/* 移动端AI客服卡片 */}
            <div className="bg-white rounded-2xl shadow-md overflow-hidden">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold text-gray-800">AI客服助手</h3>
                  <Link href="/mobile-agent" className="text-primary text-sm flex items-center">
                    了解更多 <ChevronRight className="h-3 w-3 ml-1" />
                  </Link>
                </div>
                <p className="text-xl font-medium text-gray-900 mb-6">
                  随时随地体验智能AI Agent
                  <br />
                  毫秒级响应，首次解决率≥95%
                </p>
                <div className="bg-gray-900 rounded-xl p-4 flex justify-center">
                  <PlaceholderComponent width={240} height={400} text="移动端界面" className="rounded-lg" />
                </div>
              </div>
            </div>

            {/* 管理平台卡片 */}
            <div className="bg-white rounded-2xl shadow-md overflow-hidden">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold text-gray-800">客服管理平台</h3>
                  <Link href="/platform" className="text-primary text-sm flex items-center">
                    了解更多 <ChevronRight className="h-3 w-3 ml-1" />
                  </Link>
                </div>
                <p className="text-xl font-medium text-gray-900 mb-6">
                  AI与人工智能协同工作一体化平台
                  <br />
                  提升效率，降低成本
                </p>
                <div className="rounded-xl overflow-hidden">
                  <PlaceholderComponent width={600} height={320} text="管理后台界面" className="w-full" />
                </div>
              </div>
            </div>

            {/* 数据分析卡片 */}
            <div className="bg-white rounded-2xl shadow-md overflow-hidden md:col-span-2">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold text-gray-800">数据分析中心</h3>
                  <Link href="/analytics" className="text-primary text-sm flex items-center">
                    了解更多 <ChevronRight className="h-3 w-3 ml-1" />
                  </Link>
                </div>
                <p className="text-xl font-medium text-gray-900 mb-6">
                  VOC全面覆盖基于声音的数据洞察
                  <br />
                  挖掘客户价值，驱动业务增长
                </p>
                <div className="rounded-xl overflow-hidden">
                  <PlaceholderComponent width={1000} height={400} text="数据分析界面" className="w-full" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Blog Section */}
      <section className="apple-section">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-semibold mb-4">最新洞察</h2>
            <p className="text-lg sm:text-xl text-gray-600">探索AI客服领域的前沿思考与实践</p>
          </div>

          <div className="max-w-5xl mx-auto px-4">
            <div className="blog-card overflow-hidden">
              <div className="grid grid-cols-1 md:grid-cols-2">
                <div className="h-64 md:h-full">
                  <PlaceholderComponent width={600} height={400} text="博客特色图片" className="h-full object-cover" />
                </div>
                <div className="p-6 md:p-8 flex flex-col justify-center">
                  <div className="text-sm text-primary font-medium mb-2">行业洞察</div>
                  <h3 className="text-xl sm:text-2xl font-semibold mb-4">AI如何重塑客户服务体验的未来</h3>
                  <p className="text-gray-600 mb-6">
                    在数字化转型的浪潮中，AI技术正在彻底改变客户服务的格局。本文探讨了AI如何提升客户体验、降低运营成本，并为企业创造更多价值。
                  </p>
                  <div className="mt-auto">
                    <Link
                      href="/blog/ai-reshaping-customer-service"
                      className="text-primary font-medium flex items-center"
                    >
                      阅读全文 <ChevronRight className="h-4 w-4 ml-1" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-8">
              {[
                {
                  title: "提升首次解决率的5个关键策略",
                  category: "最佳实践",
                  excerpt: "探索如何通过AI技术显著提升客服首次解决率，降低客户流失...",
                },
                {
                  title: "大型企业如何平稳过渡到AI客服系统",
                  category: "案例研究",
                  excerpt: "一家财富500强企业如何在6个月内成功实施AI客服转型...",
                },
                {
                  title: "2024年客户服务AI技术趋势展望",
                  category: "技术前沿",
                  excerpt: "从多模态理解到情感分析，探索塑造未来客户服务的技术趋势...",
                },
              ].map((post, index) => (
                <div key={index} className="blog-card">
                  <div>
                    <PlaceholderComponent width={400} height={200} text={`博客图片 ${index + 1}`} />
                  </div>
                  <div className="p-6">
                    <div className="text-xs text-primary font-medium mb-2">{post.category}</div>
                    <h3 className="text-lg font-medium mb-2">{post.title}</h3>
                    <p className="text-sm text-gray-600 mb-4">{post.excerpt}</p>
                    <Link
                      href={`/blog/post-${index + 1}`}
                      className="text-primary text-sm font-medium flex items-center"
                    >
                      阅读全文 <ChevronRight className="h-3 w-3 ml-1" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center mt-12">
              <Link href="/blog" className="btn-tertiary">
                查看所有文章
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="apple-section bg-secondary">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-semibold mb-4">为什么选择 AI-CXaas</h2>
            <p className="text-lg sm:text-xl text-gray-600">重新定义客户服务，提供卓越体验</p>
          </div>

          <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
            <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm">
              <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mb-6">
                <Zap className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-medium mb-3">毫秒级响应</h3>
              <p className="text-gray-600">告别漫长等待，AI-CXaas提供即时响应，让客户体验更加流畅，提升满意度。</p>
            </div>

            <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm">
              <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mb-6">
                <Check className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-medium mb-3">首次解决率≥95%</h3>
              <p className="text-gray-600">强大的AI理解能力，准确把握客户需求，一次性解决问题，减少转接次数。</p>
            </div>

            <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm">
              <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mb-6">
                <DollarSign className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-medium mb-3">降低90%成本</h3>
              <p className="text-gray-600">相比传统客服系统，AI-CXaas可以显著降低运营成本，提高投资回报率。</p>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison Section */}
      <section className="apple-section">
        <div className="container mx-auto">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-4xl font-semibold mb-6">
                  传统智能客服对比，
                  <br />
                  我们的优势
                </h2>
                <p className="text-xl text-gray-600 mb-8">
                  降低90%的TCO，平均处理时长减少1/3，服务水平达到99.99%的接通率
                </p>

                <div className="space-y-6">
                  <div className="flex items-start">
                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center mr-4 mt-1">
                      <Check className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium mb-1">无需多轮导接</h3>
                      <p className="text-gray-600">客户无感知路由，毫秒级响应</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center mr-4 mt-1">
                      <Check className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium mb-1">AI接管率95%</h3>
                      <p className="text-gray-600">解决传统客服60-70%的接管率问题</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center mr-4 mt-1">
                      <Check className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium mb-1">降低90%成本</h3>
                      <p className="text-gray-600">综合TCO只需原来的1/10</p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <PlaceholderComponent width={600} height={400} text="对比图表" className="rounded-3xl shadow-lg" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="apple-section bg-secondary">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-semibold mb-4">数百家企业的共同选择</h2>
            <p className="text-xl text-gray-600">值得信赖的AI客服解决方案，为企业创造更多价值</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            <div className="bg-white p-8 rounded-3xl shadow-sm text-center">
              <div className="text-4xl font-bold text-primary mb-2">20%</div>
              <div className="text-sm text-gray-600">人工智能渗透率</div>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-sm text-center">
              <div className="text-4xl font-bold text-primary mb-2">95%</div>
              <div className="text-sm text-gray-600">首次解决率</div>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-sm text-center">
              <div className="text-4xl font-bold text-primary mb-2">1/10</div>
              <div className="text-sm text-gray-600">运营成本</div>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-sm text-center">
              <div className="text-4xl font-bold text-primary mb-2">99.9%</div>
              <div className="text-sm text-gray-600">服务可用性</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="apple-section">
        <div className="container mx-auto">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl font-semibold mb-6">准备好开始了吗？</h2>
            <p className="text-xl text-gray-600 mb-8">加入数百家企业的行列，使用AI-CXaas提升客户服务体验</p>

            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/contact" className="btn-primary flex items-center gap-2">
                立即开始
                <ArrowRight className="h-4 w-4" />
              </Link>

              <Link href="/demo" className="btn-secondary flex items-center gap-2">
                免费体验
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Partners Section */}
      <section className="py-16 bg-secondary">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-semibold">合作伙伴与客户</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-8 max-w-5xl mx-auto">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white p-4 rounded-xl shadow-sm flex items-center justify-center h-20">
                <PlaceholderComponent width={120} height={40} text={`客户 ${i}`} />
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
