"use client"
import Link from "next/link"
import { Check, DollarSign, Zap, ChevronRight, ArrowRight, Settings, BarChart, Search } from "lucide-react"
import dynamic from "next/dynamic"
import { useEffect, useState } from "react"
import Image from "next/image"
import { Cookies } from "react-cookie";
const cookies = new Cookies();


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
    login()

    setMounted(true)
  }, [])

  const login = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_FASTGPT_API_URL}/openapi/v1/user/loginByPassword`
        ,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: "root",
            password:
              "53e880894f3cc53d5071c679f1afcd223a3faca09148c6898da13f0afc3535ad",
          }),
        }
      );

      if (!response.ok) throw new Error("登录失败");
      const data = await response.json();
      const token = data.data.token;
      
      // 设置token到cookie和localStorage
      cookies.set("eai_token", token, { path: "/" });
      localStorage.setItem("authToken", token);

      return token;
    } catch (error) {
      console.error("登录错误:", error);
      
      return null;
    }
  };

  return (
    <>
      {/* Hero Section - 苹果风格 */}
      <section className="apple-section bg-white relative overflow-hidden dot-matrix-bg">
        {mounted && <GridDotBackground />}
        <div className="container mx-auto relative z-10">
          <div className="max-w-4xl mx-auto text-center px-4">
            <h1
              className="text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-bold tracking-tight mb-6 animate-slide-up opacity-0 text-shadow-md"
              style={{ 
                animationFillMode: "forwards",
                letterSpacing: "0.05em"
              }}
            >
              <span className="inline-block">让每一次<span className="key-underline-cyan">互动</span></span>
              <br className="sm:hidden" />
              <span className="inline-block">都成为</span>
              <br />
              <span className="inline-block"><span className="key-underline-purple">增长</span>的机会</span>
            </h1>
            <p
              className="text-md sm:text-lg md:text-xl text-gray-700 mb-10 max-w-3xl mx-auto animate-slide-up opacity-0 leading-relaxed tracking-wide text-spaced"
              style={{ 
                animationDelay: "0.2s", 
                animationFillMode: "forwards",
                letterSpacing: "0.1em" 
              }}
            >
              <span className="relative">
                <span className="inline-block relative text-elegant">
                  <span className="absolute -bottom-1 left-0 w-full h-[2px] bg-primary/40 rounded-full"></span>
                  With Cyanix
                </span>
                <span className="mx-2 text-primary animate-subtle-bounce inline-block">·</span>
                <span className="inline-block relative text-elegant">
                  <span className="absolute -bottom-1 left-0 w-full h-[2px] bg-primary/40 rounded-full"></span>
                  Every Voice Matters
                </span>
                <span className="mx-2 text-primary animate-subtle-bounce inline-block">·</span>
                <span className="inline-block relative text-elegant">
                  <span className="absolute -bottom-1 left-0 w-full h-[2px] bg-primary/40 rounded-full"></span>
                  Every Touch Grows
                </span>
              </span>
            </p>
            <div
              className="flex flex-wrap justify-center gap-4 animate-slide-up opacity-0"
              style={{ animationDelay: "0.4s", animationFillMode: "forwards" }}
            >
              <Link 
                href="/chat" 
                className="btn-primary group transition-all duration-300 transform hover:scale-105 hover:shadow-lg relative overflow-hidden"
              >
                <span className="relative z-10 flex items-center font-semibold">
                  立即体验
                  <span className="inline-block ml-2 transition-transform duration-300 group-hover:translate-x-1">
                    <ArrowRight size={18} />
                  </span>
                </span>
                <span className="absolute inset-0 animate-shimmer opacity-50"></span>
              </Link>
            </div>
            
            <div 
              className="mt-16 flex justify-center animate-slide-up opacity-0"
              style={{ animationDelay: "0.6s", animationFillMode: "forwards" }}
            >
              <button 
                onClick={() => {
                  const nextSection = document.querySelector('.py-16.bg-secondary');
                  if (nextSection) {
                    nextSection.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className="animate-float flex flex-col items-center cursor-pointer"
              >
                <div className="w-10 h-10 rounded-full flex items-center justify-center border-2 border-primary/70 shadow-sm">
                  <svg 
                    className="w-5 h-5 text-primary" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24" 
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2.5} 
                      d="M19 14l-7 7m0 0l-7-7m7 7V3" 
                    />
                  </svg>
                </div>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Product Screenshots - 卡片式布局 */}
      <section className="py-16 bg-secondary">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto">
            {/* 移动端AI客服卡片 */}
            <div className="bg-white rounded-2xl shadow-md overflow-hidden h-full flex flex-col">
              <div className="p-6 flex flex-col flex-grow">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-semibold text-gray-800">接近真人服务水平的AI Agent 对话服务</h3>
                  
                </div>
                <p className="text-sm font-base text-gray-500 mb-4">
                  基于企业知识库构建多AI Agents协同,毫秒级响应，AI接管率≥90%
                </p>
                <div className="flex justify-center flex-grow">
                  <div className="device-iphone">
                    <div className="device-frame">
                      <div className="device-screen">
                        <Image
                          src="/images/mobile-agent.png"
                          alt="移动端AI客服界面"
                          width={260}
                          height={500}
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <div className="device-stripe"></div>
                      <div className="device-header"></div>
                      <div className="device-sensors"></div>
                      <div className="device-btns"></div>
                      <div className="device-power"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 管理平台卡片 */}
            <div className="bg-white rounded-2xl shadow-md overflow-hidden h-full flex flex-col">
              <div className="p-6 flex flex-col flex-grow">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-semibold text-gray-800">无缝协同的ALL-In-One工作台</h3>
                  
                </div>
                <p className="text-sm font-base text-gray-500 mb-4">
                  AI与人工无缝协同，按需接管，智能辅助，AI时代新的工作方式
                  
                </p>
                <div className="rounded-xl overflow-hidden flex-grow flex items-center">
                  <Image
                    src="/images/platform.png"
                    alt="管理后台界面"
                    width={600}
                    height={320}
                    className="w-full rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
                  />
                </div>
              </div>
            </div>

            {/* 数据分析卡片 */}
            <div className="bg-white rounded-2xl shadow-md overflow-hidden md:col-span-2">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-semibold text-gray-800">VOC全量管理，基于用户任务旅程的洞察</h3>
                </div>
                <p className="text-sm font-base text-gray-500 mb-4">
                  图文、语音均可查，全生命周期挖掘客户价值，驱动业务增长
                </p>
                <div className="rounded-xl overflow-hidden bg-gradient-to-b from-gray-50 to-gray-100 p-2">
                  <Image
                    src="/images/analytics.png"
                    alt="数据分析界面"
                    width={1000}
                    height={400}
                    className="w-full rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
       
       {/* Features Section */}
       <section className="apple-section">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-semibold mb-4">为什么选择Cyanix</h2>
            <p className="text-lg sm:text-xl text-gray-600">解决行业痛点，创造实际价值</p>
          </div>

          <div className="max-w-6xl mx-auto">
            {/* 痛点与挑战 */}
            <div className="mb-12">
              <h3 className="text-2xl font-semibold mb-6 text-primary border-b border-primary/20 pb-2">痛点与挑战</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
                <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm">
                  <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mb-6">
                    <DollarSign className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-medium mb-3">服务成本连年走高</h3>
                  <p className="text-gray-600">用户需求理解难，企业产品文档类型多，匹配效果差。</p>
                </div>

                <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm">
                  <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mb-6">
                    <Settings className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-medium mb-3">服务改善依赖二开</h3>
                  <p className="text-gray-600">需求变化快，服务升级时效低，费时费力。</p>
                </div>

                <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm">
                  <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mb-6">
                    <BarChart className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-medium mb-3">客户互动数据利用率低</h3>
                  <p className="text-gray-600">大量的客户互动数据未被利用，无法形成闭环。</p>
                </div>
              </div>
            </div>

            {/* 价值点 */}
            <div>
              <h3 className="text-2xl font-semibold mb-8 text-primary border-b border-primary/20 pb-2">互动增长价值</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
                <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm transform transition-all duration-300 hover:shadow-lg hover:-translate-y-2 group">
                  <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <Check className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="text-xl font-medium mb-3 group-hover:text-primary transition-colors duration-300">智慧互动•精准解答</h3>
                  <p className="text-gray-600">多模态理解技术助力精准互动，每次对话转化为价值连接，接管95%场景问题，客服成本降低10倍。</p>
                </div>

                <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm transform transition-all duration-300 hover:shadow-lg hover:-translate-y-2 group">
                  <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <Zap className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="text-xl font-medium mb-3 group-hover:text-primary transition-colors duration-300">敏捷搭建•快速增长</h3>
                  <p className="text-gray-600">客服人员可直接将服务构想落地实现，创新迭代速度提升10倍，成本降低至1/20，加速业务增长。</p>
                </div>

                <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm transform transition-all duration-300 hover:shadow-lg hover:-translate-y-2 group">
                  <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <Search className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="text-xl font-medium mb-3 group-hover:text-primary transition-colors duration-300">全量洞察•价值闭环</h3>
                  <p className="text-gray-600">通过非结构化数据全量分析，构建用户任务流程场景链，实现互动数据价值闭环，持续赋能业务增长。</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison Section */}
      <section className="apple-section  bg-secondary">
        <div className="container mx-auto">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-4xl font-semibold mb-6">
                  对比传统智能客服，
                  <br />
                  我们的优势
                </h2>
               

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
               
                <Image
                          src="/images/vs.png"
                          alt="AI 联络中心"
                          width={400}
                          height={400}
                          className="rounded-3xl shadow-lg"
                        />
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
                <Image
                          src="/images/blog.png"
                          alt="AI 联络中心"
                          width={600}
                          height={400}
                          className="h-full object-cover"
                        />
                </div>
                <div className="p-6 md:p-8 flex flex-col justify-center">
                  <div className="text-sm text-primary font-medium mb-2">行业洞察</div>
                  <h3 className="text-xl sm:text-2xl font-semibold mb-4">AI如何重塑客户服务体验的未来</h3>
                  <p className="text-gray-600 mb-6">
                    AI已成为各个企业必选题，但要成为组织变革仍有不少挑战与阻碍。本文探讨如何通过客户联络场景实现AI战略落地，助力企业加速数字化转型。
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
          </div>
        </div>
      </section>

     

      {/* Stats Section */}
      <section className="apple-section bg-secondary">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-semibold mb-4">企业数字化转型的共同选择</h2>
            <p className="text-xl text-gray-600">锐捷客服场景落地效果</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            <div className="bg-white p-8 rounded-3xl shadow-sm text-center">
              <div className="text-4xl font-bold text-primary mb-2">~90%</div>
              <div className="text-sm text-gray-600">AI接管率</div>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-sm text-center">
              <div className="text-4xl font-bold text-primary mb-2">20%</div>
              <div className="text-sm text-gray-600">人工业务量降低</div>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-sm text-center">
              <div className="text-4xl font-bold text-primary mb-2">1/10</div>
              <div className="text-sm text-gray-600">运营成本</div>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-sm text-center">
              <div className="text-4xl font-bold text-primary mb-2">~20万</div>
              <div className="text-sm text-gray-600">知识库文档数</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="apple-section">
        <div className="container mx-auto">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl font-semibold mb-6">准备好开始了吗？</h2>
            <p className="text-xl text-gray-600 mb-8">合作伙伴火热招募中，我们将与您共同努力，将AI真正落地企业实际场景中</p>

            <div className="flex flex-wrap justify-center gap-4">
              <Link href="https://www.ruijie.com.cn/sales/apply/1910597579623563266/" target="_blank" className="btn-secondary flex items-center gap-2">
                预约演示
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            
            <div className="mt-10 flex flex-col items-center">
              <div className="bg-white p-4 rounded-md shadow-sm inline-block">
                <Image
                  src="/images/wechat-qr.png"
                  alt="微信二维码"
                  width={120}
                  height={120}
                  className="object-contain"
                />
                <p className="text-sm text-gray-700 font-medium mt-2">或者添加官方微信</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      
    </>
  )
}
