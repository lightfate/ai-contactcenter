'use client';
import Image from "next/image";
import ParticleBackground from "@/components/ParticleBackground";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

// 二维码弹窗组件
function QRCodePopup({ 
  isOpen, 
  onClose, 
  buttonRef 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  buttonRef: React.RefObject<HTMLButtonElement | null>;
}) {
  const popupRef = useRef<HTMLDivElement>(null);
  
  // 计算位置的函数移到组件内部，并且只在客户端执行
  const calculatePosition = () => {
    if (!buttonRef.current || !popupRef.current) return { top: 0, left: 0 };
    
    const buttonRect = buttonRef.current.getBoundingClientRect();
    return {
      top: buttonRect.top + window.scrollY,
      left: buttonRect.right + 16, // 固定在按钮右侧，间距16px
    };
  };

  // 使用 useEffect 处理点击外部关闭
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        popupRef.current && 
        !popupRef.current.contains(event.target as Node) &&
        buttonRef.current && 
        !buttonRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    // 延迟添加事件监听，避免立即触发
    const timeoutId = setTimeout(() => {
      document.addEventListener('mousedown', handleClickOutside);
    }, 100);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      clearTimeout(timeoutId);
    };
  }, [isOpen, onClose, buttonRef]);

  // 使用 useEffect 处理窗口大小变化
  useEffect(() => {
    if (!isOpen) return;
    
    const handleResize = () => {
      onClose();
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // 计算位置 - 仅在客户端执行
  const position = calculatePosition();

  return (
    <div 
      ref={popupRef}
      className="qr-popup-container fixed z-50"
      style={{ 
        top: `${position.top}px`,
        left: `${position.left}px`
      }}
    >
      <div className="bg-white rounded-lg shadow-xl border border-gray-200 p-4 animate-popup">
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          className="absolute -top-2 -right-2 w-6 h-6 bg-gray-800 rounded-full text-white flex items-center justify-center hover:bg-gray-700 transition-colors"
        >
          ×
        </button>
        <div className="w-40">
          <Image
            src="/images/wechat-qr.png"
            alt="企业微信二维码"
            width={160}
            height={160}
            className="rounded-md"
            priority
          />
          <div className="text-center mt-2">
            <p className="text-sm font-medium text-gray-800">扫码添加企业微信</p>
            <p className="text-xs text-gray-500 mt-1">了解更多详情</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const [isQRVisible, setIsQRVisible] = useState(false);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const router = useRouter();

  // 修改处理函数，改为跳转到智能客服页面
  const handleShowQR = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    router.push('/customer-service');
  };

  return (
    <>
      <style jsx global>{`
        @keyframes popup {
          from {
            opacity: 0;
            transform: translateX(-10px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        .animate-popup {
          animation: popup 0.2s ease-out forwards;
        }
      `}</style>
      <ParticleBackground />
      <QRCodePopup 
        isOpen={isQRVisible}
        onClose={() => setIsQRVisible(false)}
        buttonRef={buttonRef}
      />
      
      <div className="relative min-h-screen">
        <header className="fixed top-0 w-full bg-white/90 backdrop-blur-sm z-50 shadow-sm border-b border-gray-100">
          <nav className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 text-transparent bg-clip-text">
                AI-CXaas解决方案 Beta
              </div>
              <div className="hidden md:flex space-x-8">
                {/* 体验Demo <Link href="/customer-service" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">体验Demo</Link>*/ }
                
              </div>
            </div>
          </nav>
        </header>

        <main className="pt-16">
          {/* banner板块 */}
          <section className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center overflow-hidden bg-gradient-to-b from-gray-50 to-white">
            {/* 动态背景 */}
            <div className="absolute inset-0 w-full h-full">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(124,58,237,0.05),rgba(124,58,237,0))]"></div>
              <div className="absolute inset-0">
                <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(124,58,237,0.1)" strokeWidth="1"/>
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#grid)" />
                </svg>
              </div>
            </div>

            <div className="container mx-auto px-6 relative z-10">
              <div className="text-center space-y-12 max-w-4xl mx-auto">
                {/* 主标题 */}
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-extralight tracking-tight text-gray-900 leading-tight">
                  <span className="bg-gradient-to-r from-purple-600 via-blue-600 to-purple-600 text-transparent bg-clip-text">
                    AI-First 客户联络方案
                  </span>
                  <br />
                  实现 10V&quot;1&quot;好服务
                </h1>

                {/* 副标题图标组 */}
                <div className="flex flex-wrap justify-center gap-8 text-gray-600">
                  <div className="flex items-center space-x-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                    <span>轻松问</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                    <span>好好答</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>真人感</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    <span>进化快</span>
                  </div>
                </div>

                {/* 体验按钮 */}
                <div className="mb-32">
                  <Link
                    href="https://ocs.ruijie.com.cn/#/" target="_blank"
                    className="inline-flex items-center px-8 py-3 text-base font-medium text-white bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
                  >
                    立即体验
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>

            {/* 价值主张 - 通栏设计 */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-r from-white/5 to-white/10 backdrop-blur-sm border-t border-white/20">
              <div className="container mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-white/20">
                  <div className="p-6 md:p-8 flex justify-center">
                    <div className="max-w-xs">
                      <p className="text-sm font-normal text-gray-700 mt-1">通过Multi Agent + AgenticRAG</p>
                      <p className="text-sm font-normal text-gray-700 mt-1">接管企业95%的基础咨询，降低95%TCO</p>
                    </div>
                  </div>
                  <div className="p-6 md:p-8 flex justify-center">
                    <div className="max-w-xs">
                      
                      <p className="text-sm font-normal text-gray-700 mt-1">快速对接企业内部系统，企业可以自由部署工作流，快速上线新业务</p>
                    </div>
                  </div>
                  <div className="p-6 md:p-8 flex justify-center">
                    <div className="max-w-xs">
                      <p className="text-sm font-normal text-gray-700 mt-1">通过对半结构化数据洞察</p>
                      <p className="text-sm font-normal text-gray-700 mt-1">辅助企业决策与经营</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
          {/* 三大核心功能模块 - 直接放在banner之后 */}
          <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
            <div className="container mx-auto px-6">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  <span className="bg-gradient-to-r from-purple-600 via-blue-600 to-purple-600 text-transparent bg-clip-text">
                    三大核心功能平台
                  </span>
                </h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  全面提升客户服务体验，降低10倍运营成本，挖掘商业价值
                </p>
              </div>

              {/* 两个主要功能卡片 - 横向排列 */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
                {/* AI Agent 卡片 */}
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
                  <div className="p-8 md:p-10 flex flex-col h-full">
                    <div className="flex justify-between items-start mb-6">
                      <h3 className="text-xl font-bold text-gray-800">闪电侠 AI Agent</h3>
                    </div>
                    
                    <h4 className="text-2xl font-light mb-6 leading-tight text-gray-700">
                      达到真人服务水平的AI Agent对话服务
                    </h4>
                    
                    <div className="mt-auto">
                      <div className="relative rounded-xl overflow-hidden shadow-lg border border-gray-100">
                        <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-3">
                          <div className="flex items-center mb-3">
                            <div className="w-6 h-6 rounded-full bg-purple-600 flex items-center justify-center">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
                                <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z" />
                              </svg>
                            </div>
                            <div className="ml-2">
                              <div className="text-xs font-semibold text-gray-800">闪电侠 AI Agent</div>
                              <div className="text-[10px] text-gray-500">在线</div>
                            </div>
                          </div>
                          
                          <div className="flex-grow flex flex-col justify-end">
                            <div className="bg-white text-gray-800 rounded-lg p-2 mb-2 max-w-xs self-start text-xs shadow-sm">
                              您好，我是闪电侠。请问您遇到了什么问题？
                            </div>
                            <div className="bg-purple-600 text-white rounded-lg p-2 mb-2 max-w-xs self-end text-xs shadow-sm">
                              我的路由器突然连不上网了，指示灯一直闪烁
                            </div>
                            
                            {/* 语音消息 */}
                            <div className="bg-purple-600 text-white rounded-lg p-2 mb-2 max-w-xs self-end text-xs shadow-sm">
                              <div className="flex items-center">
                                <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                                </svg>
                                <div className="flex-1 flex items-center">
                                  <span className="w-1 h-1 bg-white rounded-full mx-[1px] animate-pulse"></span>
                                  <span className="w-1 h-2 bg-white rounded-full mx-[1px] animate-pulse"></span>
                                  <span className="w-1 h-3 bg-white rounded-full mx-[1px] animate-pulse"></span>
                                  <span className="w-1 h-2 bg-white rounded-full mx-[1px] animate-pulse"></span>
                                  <span className="w-1 h-1 bg-white rounded-full mx-[1px] animate-pulse"></span>
                                </div>
                                <span className="text-[10px] ml-1">0:08</span>
                              </div>
                            </div>
                            
                            <div className="bg-white text-gray-800 rounded-lg p-2 mb-2 max-w-xs self-start text-xs shadow-sm">
                              请尝试以下步骤：1. 断开路由器电源 2. 等待30秒 3. 重新连接电源
                            </div>
                            
                            {/* 图片消息 */}
                            <div className="bg-white text-gray-800 rounded-lg p-2 max-w-xs self-start text-xs shadow-sm">
                              <div className="mb-1">这是路由器重置按钮的位置，您也可以尝试按住10秒进行重置：</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Service Task Agent Platform 卡片 */}
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
                  <div className="p-8 md:p-10 flex flex-col h-full">
                    <div className="flex justify-between items-start mb-6">
                      <h3 className="text-xl font-bold text-gray-800">Service Task Agent Platform</h3>
                     
                    </div>
                    
                    <h4 className="text-2xl font-light mb-6 leading-tight text-gray-700">
                      AI-First 一站式工作台，人机协同，业务随行
                    </h4>
                    
                    <div className="mt-auto">
                      <div className="relative rounded-xl overflow-hidden shadow-lg border border-gray-100">
                        <div className="bg-gradient-to-r from-blue-50 to-purple-50">
                          <div className="bg-white p-2 flex items-center justify-between border-b border-gray-200">
                            <div className="flex items-center">
                              <div className="w-3 h-3 rounded-full bg-gray-400 mr-2"></div>
                              <span className="text-xs font-medium text-gray-700">服务工作台</span>
                            </div>
                            <div className="text-[10px] text-gray-500">在线</div>
                          </div>
                          
                          <div className="flex flex-1">
                            <div className="w-1/4 bg-gray-100 p-2">
                              <div className="bg-blue-600 text-white text-[10px] p-2 rounded mb-1 flex items-center justify-between">
                                <span>服务中的客户</span>
                                <span className="bg-blue-800 px-1 rounded">12</span>
                              </div>
                              <div className="bg-gray-300 text-gray-700 text-[10px] p-2 rounded mb-1">
                                Agents&Workflow
                              </div>
                              <div className="bg-gray-300 text-gray-700 text-[10px] p-2 rounded mb-1">
                                知识库
                              </div>
                            </div>
                            
                            <div className="w-2/5 p-2 border-r border-gray-200">
                              <div className="flex flex-col space-y-2">
                                <div className="bg-purple-100 rounded p-2">
                                  <div className="flex justify-between items-center mb-1">
                                    <span className="text-[10px] text-gray-700">张先生 - 路由器故障</span>
                                    <span className="bg-gray-200 text-gray-700 text-[10px] px-2 py-0.5 rounded">处理中</span>
                                  </div>
                                  <div className="h-4 bg-purple-200 rounded text-[10px] flex items-center px-1">
                                    <span>信号强度检测</span>
                                    <div className="ml-auto bg-green-500 rounded-full w-2 h-2"></div>
                                  </div>
                                </div>
                                
                                <div className="bg-purple-100 rounded p-2">
                                  <div className="flex justify-between items-center mb-1">
                                    <span className="text-[10px] text-gray-700">李女士 - 网络连接问题</span>
                                    <span className="bg-gray-200 text-gray-700 text-[10px] px-2 py-0.5 rounded">待处理</span>
                                  </div>
                                  <div className="h-4 bg-purple-200 rounded text-[10px] flex items-center px-1">
                                    <span>设备重启流程</span>
                                    <div className="ml-auto bg-yellow-500 rounded-full w-2 h-2"></div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            
                            {/* 右侧AI助手区域 */}
                            <div className="w-1/3 p-2 bg-white">
                              <div className="flex items-center mb-2">
                                <div className="w-4 h-4 rounded-full bg-purple-600 flex items-center justify-center mr-2">
                                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white">
                                    <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                  </svg>
                                </div>
                                <span className="text-[10px] font-medium text-gray-700">AI 助手</span>
                              </div>
                              
                              <div className="bg-purple-50 rounded-lg p-2 mb-2">
                                <div className="text-[10px] text-gray-700 mb-1 font-medium">建议操作</div>
                                <div className="text-[10px] text-gray-600 bg-white p-1 rounded border border-gray-200 mb-1 cursor-pointer hover:bg-gray-50">
                                  请客户检查路由器电源线是否松动
                                </div>
                                <div className="text-[10px] text-gray-600 bg-white p-1 rounded border border-gray-200 cursor-pointer hover:bg-gray-50">
                                  发送路由器重置指导图片
                                </div>
                              </div>
                              
                              <div className="bg-blue-50 rounded-lg p-2 mb-2">
                                <div className="text-[10px] text-gray-700 mb-1 font-medium">设备信息</div>
                                <div className="grid grid-cols-2 gap-1 text-[10px]">
                                  <div className="text-gray-500">型号:</div>
                                  <div className="text-gray-700">RT-AC68U</div>
                                  <div className="text-gray-500">购买日期:</div>
                                  <div className="text-gray-700">2023-05-18</div>
                                  <div className="text-gray-500">保修状态:</div>
                                  <div className="text-green-600">有效</div>
                                </div>
                              </div>
                              
                              <div className="bg-yellow-50 rounded-lg p-2">
                                <div className="text-[10px] text-gray-700 mb-1 font-medium">常见解决方案</div>
                                <div className="text-[10px] text-gray-600">
                                  <p className="mb-1">• 电源重启: 断电30秒后重启</p>
                                  <p className="mb-1">• 恢复出厂设置: 长按重置键10秒</p>
                                  <p>• 固件更新: 检查最新固件版本</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* 数据平台卡片 - 单独一行 */}
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
                <div className="p-8 md:p-10">
                  <div className="flex flex-col lg:flex-row lg:items-center">
                    <div className="lg:w-1/3 mb-8 lg:mb-0 lg:pr-8">
                      <div className="flex justify-between items-start mb-6">
                        <h3 className="text-xl font-bold text-gray-800">客户互动数据平台</h3>
                        
                      </div>
                      
                      <h4 className="text-2xl font-light mb-6 leading-tight text-gray-700">
                        AI-BI 挖掘客户各类互动数据，实时监测服务水平
                      </h4>
                    </div>
                    
                    <div className="lg:w-2/3 relative">
                      <div className="rounded-xl overflow-hidden shadow-lg border border-gray-100">
                        <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-4">
                          <div className="bg-white p-2 rounded-t flex items-center justify-between border-b border-gray-200">
                            <div className="flex items-center">
                              <div className="w-3 h-3 rounded-full bg-gray-400 mr-2"></div>
                              <span className="text-xs font-medium text-gray-700">服务绩效指标</span>
                            </div>
                            <div className="text-[10px] text-gray-500">
                              <span className="bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded">2025年2月8日 - 3月6日</span>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-2 mt-2">
                            <div className="bg-white rounded p-3 shadow-sm">
                              <div className="text-[10px] text-gray-500 mb-1">整体绩效指标</div>
                              <div className="text-xs font-medium mb-1 text-gray-700">AI agents 接管率</div>
                              <div className="flex items-end">
                                <div className="text-lg font-bold text-gray-800">95.3%</div>
                                <div className="text-[10px] text-green-600 ml-2 mb-1 flex items-center">
                                  <svg className="w-3 h-3 mr-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                  </svg>
                                  7.8%
                                </div>
                              </div>
                            </div>
                            
                            <div className="bg-white rounded p-3 shadow-sm">
                              <div className="text-xs font-medium mb-1 text-gray-700">团队绩效</div>
                              <div className="flex flex-col">
                                <div className="flex justify-between text-[10px] mb-1">
                                  <span className="text-gray-600">平均处理时间</span>
                                  <span className="text-blue-600 font-medium">21分4秒</span>
                                </div>
                                <div className="grid grid-cols-5 gap-1 mb-2">
                                  {['贝拉', '艾伦', '大卫', '克拉拉', '珍妮'].map((name, index) => (
                                    <div key={index} className="flex flex-col items-center">
                                      <div className={`h-12 w-4 ${['bg-blue-400', 'bg-red-300', 'bg-yellow-400', 'bg-green-400', 'bg-blue-300'][index]} rounded-t`}></div>
                                      <span className="text-[8px] text-gray-600 mt-0.5">{name}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                            
                            <div className="bg-white rounded p-3 shadow-sm col-span-2">
                              <div className="flex justify-between items-center mb-2">
                                <div className="text-xs font-medium text-gray-700">每周新对话数量</div>
                                <div className="text-[10px] text-gray-500">总计: 1,248</div>
                              </div>
                              <div className="relative h-12">
                                <div className="absolute inset-0 flex items-end">
                                  <div className="h-[60%] w-1/6 bg-blue-200 relative">
                                    <div className="absolute -top-3 w-full text-center text-[8px] text-blue-700">186</div>
                                  </div>
                                  <div className="h-[75%] w-1/6 bg-blue-300 relative">
                                    <div className="absolute -top-3 w-full text-center text-[8px] text-blue-700">234</div>
                                  </div>
                                  <div className="h-[65%] w-1/6 bg-blue-400 relative">
                                    <div className="absolute -top-3 w-full text-center text-[8px] text-blue-700">204</div>
                                  </div>
                                  <div className="h-[90%] w-1/6 bg-blue-500 relative">
                                    <div className="absolute -top-3 w-full text-center text-[8px] text-blue-700">282</div>
                                  </div>
                                  <div className="h-[80%] w-1/6 bg-blue-600 relative">
                                    <div className="absolute -top-3 w-full text-center text-[8px] text-blue-700">252</div>
                                  </div>
                                  <div className="h-[100%] w-1/6 bg-blue-700 relative">
                                    <div className="absolute -top-3 w-full text-center text-[8px] text-blue-700">312</div>
                                  </div>
                                </div>
                              </div>
                              <div className="flex justify-between text-[8px] text-gray-500 mt-1">
                                <span>2月8日</span>
                                <span>2月15日</span>
                                <span>2月22日</span>
                                <span>2月29日</span>
                                <span>3月1日</span>
                                <span>3月6日</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="mt-2 bg-white rounded p-3 shadow-sm">
                            <div className="flex justify-between items-center mb-2">
                              <div className="text-xs font-medium text-gray-700">对话状态分布</div>
                              <div className="flex items-center space-x-2">
                                <div className="flex items-center">
                                  <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
                                  <span className="text-[8px] text-gray-600">已解决</span>
                                </div>
                                <div className="flex items-center">
                                  <div className="w-2 h-2 bg-yellow-500 rounded-full mr-1"></div>
                                  <span className="text-[8px] text-gray-600">处理中</span>
                                </div>
                                <div className="flex items-center">
                                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-1"></div>
                                  <span className="text-[8px] text-gray-600">新对话</span>
                                </div>
                              </div>
                            </div>
                            <div className="h-4 bg-gray-100 rounded-full overflow-hidden flex">
                              <div className="h-full bg-green-500" style={{width: '58%'}}></div>
                              <div className="h-full bg-yellow-500" style={{width: '27%'}}></div>
                              <div className="h-full bg-blue-500" style={{width: '15%'}}></div>
                            </div>
                            <div className="flex justify-between text-[8px] text-gray-600 mt-1">
                              <span>已解决: 58%</span>
                              <span>处理中: 27%</span>
                              <span>新对话: 15%</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
          
          {/* 困局展示部分 */}
          <section className="py-16 relative bg-gray-50">
            {/* 背景装饰 */}
            <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
            
            {/* 标题部分 */}
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 relative inline-block text-gray-800">
                您的客户服务是否也面临这些
                <span className="relative inline-block">
                  困境
                  <div className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-blue-600 via-purple-600 to-green-600"></div>
                </span>
                ？
              </h2>
              <p className="text-gray-600 max-w-3xl mx-auto mt-4">
                现代企业在客户服务领域面临的四大挑战，AI驱动的解决方案可以帮助您突破这些瓶颈
              </p>
            </div>
            
            {/* 四宫格困局展示 */}
            <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto px-4">
              {/* 困局1：成本与满意度 */}
              <div className="group bg-white rounded-2xl p-8 hover:shadow-xl transition-all duration-300 border border-gray-200 relative overflow-hidden card-hover">
                <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                
                <div className="flex items-center gap-4 mb-6">
                  <div className="relative w-16 h-16 flex items-center justify-center">
                    <div className="absolute inset-0 bg-red-100 rounded-full group-hover:scale-110 transition-transform"></div>
                    <svg width="32" height="32" viewBox="0 0 24 24" style={{color: '#dc2626', position: 'relative', zIndex: 10}}>
                      <g fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                        <polyline points="17 8 12 3 7 8" />
                        <line x1="12" y1="3" x2="12" y2="15" />
                      </g>
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">成本与满意度困境</h3>
                    <p className="text-gray-600">人工客服成本以每年递增，但满意度持续走低</p>
                  </div>
                </div>
                
                <div className="flex gap-8 mb-6">
                  <div className="flex-1 bg-gray-50 rounded-lg p-4 group-hover:bg-red-50 transition-colors border border-gray-100">
                    <div className="text-4xl font-bold text-red-600 mb-2 group-hover:scale-110 transition-transform">
                      +12%
                    </div>
                    <span className="text-sm text-gray-600">年成本增长</span>
                    
                    {/* 可视化进度条 */}
                    <div className="mt-3 h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-red-500 rounded-full" style={{ width: '72%' }}></div>
                    </div>
                  </div>
                  <div className="flex-1 bg-gray-50 rounded-lg p-4 group-hover:bg-red-50 transition-colors border border-gray-100">
                    <div className="text-4xl font-bold text-red-600 mb-2 group-hover:scale-110 transition-transform">
                      -8%
                    </div>
                    <span className="text-sm text-gray-600">满意度下降</span>
                    
                    {/* 可视化进度条 */}
                    <div className="mt-3 h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-red-500 rounded-full" style={{ width: '48%' }}></div>
                    </div>
                  </div>
                </div>
                
               
              </div>

              {/* 困局2：客户流失 */}
              <div className="group bg-white rounded-2xl p-8 hover:shadow-xl transition-all duration-300 border border-gray-200 relative overflow-hidden card-hover">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                
                <div className="flex items-center gap-4 mb-6">
                  <div className="relative w-16 h-16 flex items-center justify-center">
                    <div className="absolute inset-0 bg-purple-100 rounded-full group-hover:scale-110 transition-transform"></div>
                    <svg width="32" height="32" viewBox="0 0 24 24" style={{color: '#9333ea', position: 'relative', zIndex: 10}}>
                      <g fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                        <circle cx="9" cy="7" r="4" />
                        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                      </g>
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">客户流失问题</h3>
                    <p className="text-gray-600">糟糕的服务体验导致客户流失率高企</p>
                  </div>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-6 group-hover:bg-purple-50 transition-colors border border-gray-100 mb-6">
                  <div className="text-5xl font-bold text-purple-600 mb-2 group-hover:scale-110 transition-transform">
                    72%
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="inline-block w-2 h-2 bg-purple-600 rounded-full"></span>
                    <span className="text-sm text-gray-600">客户因重复沟通，放弃购买，--来自Forrester调研</span>
                  </div>
                </div>
                
              
              </div>

              {/* 困局3：未挖掘商机 */}
              <div className="group bg-white rounded-2xl p-8 hover:shadow-xl transition-all duration-300 border border-gray-200 relative overflow-hidden card-hover">
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                
                <div className="flex items-center gap-4 mb-6">
                  <div className="relative w-16 h-16 flex items-center justify-center">
                    <div className="absolute inset-0 bg-yellow-100 rounded-full group-hover:scale-110 transition-transform"></div>
                    <svg width="32" height="32" viewBox="0 0 24 24" style={{color: '#ca8a04', position: 'relative', zIndex: 10}}>
                      <g fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="12" y1="1" x2="12" y2="23" />
                        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                      </g>
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">商机流失</h3>
                    <p className="text-gray-600">客户互动数据未被充分挖掘，97%潜在商机正在流失</p>
                  </div>
                </div>
                
                
                
                {/* 漏斗图可视化 - 更简洁版本 */}
                <div className="space-y-2">
                  {[
                    { label: '互动数据', value: '10万+', width: '100%', color: 'bg-yellow-200' },
                    { label: '潜在商机', value: '2000+', width: '80%', color: 'bg-yellow-300' },
                    { label: '已转化', value: '60', width: '30%', color: 'bg-yellow-400' },
                    { label: '转化率', value: '3%', width: '10%', color: 'bg-yellow-500' }
                  ].map((item, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="w-20 text-xs text-gray-600 text-right">{item.label}</div>
                      <div className="flex-1 h-6 bg-gray-100 rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${item.color} rounded-full flex items-center justify-end pr-2`}
                          style={{ width: item.width }}
                        >
                          <span className="text-xs font-medium text-yellow-800">{item.value}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 困局4：死循环 */}
          
              <div className="group bg-white rounded-2xl p-8 hover:shadow-xl transition-all duration-300 border border-gray-200 relative overflow-hidden card-hover">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                
                <div className="flex items-center gap-4 mb-6">
                  <div className="relative w-16 h-16 flex items-center justify-center">
                    <div className="absolute inset-0 bg-blue-100 rounded-full group-hover:scale-110 transition-transform"></div>
      
                    <svg width="32" height="32" viewBox="0 0 24 24" style={{color: '#2563eb', position: 'relative', zIndex: 10}}>
                      <g fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                        <path d="M3 3v5h5" />
                        <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
                        <path d="M16 21h5v-5" />
                      </g>
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">业务变化响应慢</h3>
                    <p className="text-gray-600">人工编排的服务规则更新滞后于产品，维护复杂度上升。</p>
                  </div>
                </div>
                
              
                
                {/* 循环图可视化 - 更简洁版本 */}
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { title: '人工规则', desc: '固化的规则无法适应变化' },
                    { title: '体验僵化', desc: '标准化回复难以满足需求' },
                    { title: '定制开发', desc: '为适应变化增加开发成本' },
                    { title: '成本反弹', desc: '维护成本持续增长' }
                  ].map((item, index) => (
                    <div key={index} className="bg-gray-50 rounded-lg p-4 group-hover:bg-blue-50 transition-colors border border-gray-100">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                        <span className="text-sm text-blue-700 font-medium">{item.title}</span>
                      </div>
                      <div className="text-sm text-gray-600">{item.desc}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* 愿景说明部分 */}
          <section className="py-20 relative bg-white" id="vision">
            {/* 背景装饰 */}
            <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
            
            {/* 标题与导语 */}
            <div className="text-center mb-20 max-w-4xl mx-auto px-4">
              {/* 标题部分 */}
              <div className="relative inline-block mb-16">
                <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 text-transparent bg-clip-text tracking-tight">
                  我们的愿景
                </h2>
                <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600"></div>
              </div>

              {/* 导语部分 - 重新组织布局 */}
              <div className="space-y-12 leading-relaxed tracking-wide">
                {/* 双重身份部分 */}
                <div className="space-y-8">
                  {/* 完美服务者 */}
                  <div className="bg-blue-50 rounded-xl p-8 border border-blue-200 transform hover:scale-[1.02] transition-transform shadow-sm">
                    <h3 className="text-2xl text-blue-700 font-semibold mb-4">
                      打造企业渴望的「完美服务者」
                    </h3>
                    <p className="text-lg text-gray-700">
                      一位既完全熟悉自家产品，又懂客户的服务人员
                    </p>
                  </div>

                  {/* 终极服务保障 */}
                  <div className="bg-purple-50 rounded-xl p-8 border border-purple-200 transform hover:scale-[1.02] transition-transform shadow-sm">
                    <h3 className="text-2xl text-purple-700 font-semibold mb-4">
                      提供客户期待的「终极服务保障」
                    </h3>
                    <p className="text-lg text-gray-700">
                      随时随地、有温度、1V1 的问题解决伙伴
                    </p>
                  </div>
                </div>

                {/* 核心价值部分 */}
                <div className="space-y-6">
                  {/* 神经中枢 */}
                  <p className="text-xl text-gray-700 leading-relaxed">
                    联络中心作为企业唯一具备
                    <span className="text-blue-700 font-semibold mx-1">「双向实时价值交换」</span>
                    能力的神经中枢
                  </p>

                  {/* 价值定义 */}
                  <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-12 text-lg">
                    <div className="flex items-center gap-3 group">
                      <span className="w-3 h-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full group-hover:scale-110 transition-transform"></span>
                      <span className="text-gray-700">
                        将客户互动转化为
                        <span className="text-blue-700 font-medium mx-1 group-hover:text-blue-600 transition-colors">
                          商业价值的转化器
                        </span>
                      </span>
                    </div>
                    <div className="flex items-center gap-3 group">
                      <span className="w-3 h-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full group-hover:scale-110 transition-transform"></span>
                      <span className="text-gray-700">
                        验证企业
                        <span className="text-purple-700 font-medium mx-1 group-hover:text-purple-600 transition-colors">
                          服务承诺的试金石
                        </span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 对客户价值 */}
            <div className="max-w-6xl mx-auto px-4 mb-16">
              <h3 className="text-2xl font-bold text-green-700 mb-8 flex items-center gap-3">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                对客户来说
              </h3>
              
              <div className="grid md:grid-cols-2 gap-8">
                {/* 不应该 */}
                <div className="bg-red-50 rounded-2xl p-8 border border-red-200 shadow-sm">
                  <div className="text-xl font-semibold text-red-700 mb-6">不应该是</div>
                  <div className="space-y-4">
                    {[
                      "不断重复描述问题，什么时候解决没有预期",
                      "多轮转接，排队再排队",
                      "标准话术应对，一点都不懂我"
                    ].map((item, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <svg className="w-5 h-5 text-red-600 mt-1 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        <span className="text-gray-700">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 应该是 */}
                <div className="bg-green-50 rounded-2xl p-8 border border-green-200 shadow-sm">
                  <div className="text-xl font-semibold text-green-700 mb-6">应该是</div>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <svg className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <div>
                        <span className="text-gray-700">100%解决问题的</span>
                        <span className="text-green-700 font-semibold">&quot;兜底承诺&quot;</span>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <svg className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <div>
                        <span className="text-gray-700">随时能说上话的</span>
                        <span className="text-green-700 font-semibold">&quot;真人通道&quot;</span>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <svg className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <div>
                        <span className="text-gray-700">感受到被尊重的</span>
                        <span className="text-green-700 font-semibold">&quot;情绪价值&quot;</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 对企业价值 */}
            <div className="max-w-6xl mx-auto px-4">
              <h3 className="text-2xl font-bold text-orange-700 mb-8 flex items-center gap-3">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                对企业来说
              </h3>

              <div className="grid md:grid-cols-2 gap-8">
                {/* 不应该 */}
                <div className="bg-red-50 rounded-2xl p-8 border border-red-200 shadow-sm">
                  <div className="text-xl font-semibold text-red-700 mb-6">不应该是</div>
                  <div className="space-y-4">
                    {[
                      "只能按照规则生硬生成话术",
                      "人工坐席凭经验推荐，转化率波动大",
                      "被动记录问题，人工复盘滞后"
                    ].map((item, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <svg className="w-5 h-5 text-red-600 mt-1 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        <span className="text-gray-700">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 应该是 */}
                <div className="bg-orange-50 rounded-2xl p-8 border border-orange-200 shadow-sm">
                  <div className="text-xl font-semibold text-orange-700 mb-6">应该是</div>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <svg className="w-5 h-5 text-orange-600 mt-1 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      <span className="text-gray-700">快速响应企业变化，快速调整</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <svg className="w-5 h-5 text-orange-600 mt-1 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      <div>
                        <span className="text-gray-700">能有效将客户的咨询变成销售机会</span>
                        
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <svg className="w-5 h-5 text-orange-600 mt-1 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      <div>
                        <span className="text-gray-700">能高效将客户的问题转化为产品改进清单</span>
                      
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 传统智能客服局限性 */}
          <section className="py-20 relative bg-gray-50" id="limitations">
            {/* 背景装饰 */}
            <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
            
            {/* 标题部分 */}
            <div className="text-center mb-16 max-w-4xl mx-auto px-4">
              <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 text-transparent bg-clip-text">
                传统智能客服的局限性
              </h2>
              <p className="text-gray-600 text-lg">
                当前的智能客服方案正面临着多重挑战
              </p>
            </div>

            {/* 三栏布局 */}
            <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-3 gap-8">
              {/* 人员挑战 */}
              <div className="group bg-white rounded-2xl p-8 hover:shadow-lg transition-all duration-300 border border-gray-200 card-hover">
                <div className="flex items-center gap-4 mb-6">
                  <div className="relative w-12 h-12 flex items-center justify-center">
                    <div className="absolute inset-0 bg-blue-100 rounded-full group-hover:scale-110 transition-transform"></div>
                    <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{position: 'relative', zIndex: 10}}>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.756 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-blue-700">人员成本与流动率</h3>
                </div>

                <p className="text-gray-700 mb-6 leading-relaxed">
                  人员成本和高流动率，企业不得不对服务进行人为分级。离用户越近的人员越不懂业务，还可能是个不说人话、没有共情的机器人。
                </p>

                {/* 数据可视化 */}
                <div className="bg-gray-50 rounded-xl p-6 group-hover:bg-blue-50 transition-colors border border-gray-100">
                  <div className="flex justify-between items-center mb-4">
                    <div className="text-4xl font-bold text-blue-600">94%</div>
                    <div className="text-4xl font-bold text-gray-500">16%</div>
                  </div>
                  <div className="flex justify-between text-sm">
                    <div className="text-gray-600">认为客户互动重要</div>
                    <div className="text-gray-600">实现跨渠道实时互动</div>
                  </div>
                </div>

                <a href="#" className="inline-flex items-center gap-2 text-blue-600 mt-6 group-hover:text-blue-700 transition-colors font-medium">
                  了解更多
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </a>
              </div>

              {/* 技术瓶颈 */}
              <div className="group bg-white rounded-2xl p-8 hover:shadow-lg transition-all duration-300 border border-gray-200 card-hover">
                <div className="flex items-center gap-4 mb-6">
                  <div className="relative w-12 h-12 flex items-center justify-center">
                    <div className="absolute inset-0 bg-purple-100 rounded-full group-hover:scale-110 transition-transform"></div>
                    <svg className="w-6 h-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{position: 'relative', zIndex: 10}}>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-purple-700">技术与规则的滞后</h3>
                </div>

                <p className="text-gray-700 mb-6 leading-relaxed">
                  传统智能客服基于NLP和人工规则编排，服务规则更新滞后于产品，维护复杂度随业务变化上升。体验改进效率低下。
                </p>

                {/* 数据可视化 */}
                <div className="space-y-4 bg-gray-50 rounded-xl p-6 group-hover:bg-purple-50 transition-colors border border-gray-100">
                  {[
                    { label: '数据孤岛', value: 39 },
                    { label: '跨部门协作不足', value: 48 },
                    { label: '系统分散', value: 35 }
                  ].map((item, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">{item.label}</span>
                        <span className="text-purple-600">{item.value}%</span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-purple-600 rounded-full transition-all duration-1000 group-hover:opacity-80"
                          style={{ width: `${item.value}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>

                <a href="#" className="inline-flex items-center gap-2 text-purple-600 mt-6 group-hover:text-purple-700 transition-colors font-medium">
                  了解更多
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </a>
              </div>

              {/* 用户体验 */}
              <div className="group bg-white rounded-2xl p-8 hover:shadow-lg transition-all duration-300 border border-gray-200 card-hover">
                <div className="flex items-center gap-4 mb-6">
                  <div className="relative w-12 h-12 flex items-center justify-center">
                    <div className="absolute inset-0 bg-green-100 rounded-full group-hover:scale-110 transition-transform"></div>
                    <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{position: 'relative', zIndex: 10}}>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-green-700">用户体验断层</h3>
                </div>

                <p className="text-gray-700 mb-6 leading-relaxed">
                  客户期望的服务体验与企业实际提供的服务之间存在巨大差距。标准化流程无法满足个性化需求，导致客户满意度持续下降。
                </p>

                {/* 数据可视化 */}
                <div className="bg-gray-50 rounded-xl p-6 group-hover:bg-green-50 transition-colors border border-gray-100">
                  <div className="flex items-center justify-between mb-6">
                    <div className="text-center">
                      <div className="text-sm text-gray-600 mb-1">客户期望</div>
                      <div className="text-3xl font-bold text-green-600">9.2</div>
                    </div>
                    <div className="h-10 w-px bg-gray-200"></div>
                    <div className="text-center">
                      <div className="text-sm text-gray-600 mb-1">实际体验</div>
                      <div className="text-3xl font-bold text-red-600">5.8</div>
                    </div>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full w-[63%] bg-red-500 rounded-full"></div>
                  </div>
                  <div className="text-sm text-gray-600 mt-2">体验差距: 37%</div>
                </div>

                <a href="#" className="inline-flex items-center gap-2 text-green-600 mt-6 group-hover:text-green-700 transition-colors font-medium">
                  了解更多
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </a>
              </div>
            </div>
          </section>

          {/* 方案架构 */}
          <section className="py-20 relative bg-white" id="solution">
            {/* 背景装饰 */}
            <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
            
            {/* 开场标题与核心价值 */}
            <div className="text-center mb-20 max-w-4xl mx-auto px-4">
              <div className="inline-flex items-center justify-center mb-6">
                <svg className="w-10 h-10 text-blue-600 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{position: 'relative', zIndex: 10}}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 text-transparent bg-clip-text">
                我们的解决方案
              </h2>
              <p className="text-xl text-gray-600">
                准确、亲和、低时延，为您打造既懂产品又懂客户的数字员工组织，驱动企业十倍增长
              </p>
            </div>

            {/* 关键优势清单 */}
            <div className="max-w-4xl mx-auto px-4 mb-20">
              <div className="grid md:grid-cols-2 gap-6">
                {[
                  '首次解决率 ≥95%',
                  '随时随地真人级服务体验',
                  '客户 LTV 提升 30%的智能增长引擎',
                  '综合成本TCO只要原来的 1/10'
                ].map((item, index) => (
                  <div key={index} className="group bg-green-50 rounded-xl p-6 border border-green-200 hover:border-green-300 transition-all duration-300 shadow-sm hover:shadow-md">
                    <div className="flex items-start gap-4">
                      <div className="relative w-6 h-6 flex-shrink-0">
                        <div className="absolute inset-0 bg-green-100 rounded-full group-hover:scale-110 transition-transform"></div>
                        <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{position: 'relative', zIndex: 10}}>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <p className="text-gray-700 font-medium">{item}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 方案对比 */}
          <div className="max-w-6xl mx-auto px-4 mb-20">
            <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-lg ">
              <div className="text-center mb-20 max-w-4xl mx-auto px-4">
               <h3 className="text-2xl font-semibold text-center mb-12 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 text-transparent bg-clip-text">
                传统智能客服相比，我们的优势</h3>
            
                <p className="text-xl text-gray-600" >
                  降低90%的TCO，平均处理时长减少1/3，服务水平达到99.99%的接通率 </p>
              </div>
          

              {/* 对比内容 */}
              <div className="space-y-8">
                {/* 路由部分 */}
                <div className="relative">
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-24 text-gray-600 font-medium">
                    路由
                  </div>
                  <div className="grid grid-cols-2 gap-8 ml-32 p-6 bg-gray-50 rounded-xl border border-gray-100 relative">
                    <div className="bg-purple-50 rounded-lg p-4 border border-purple-100">
                      <div className="flex items-center gap-2 mb-2">
                        <svg className="w-5 h-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-purple-600">无需多轮导接</span>
                      </div>
                      <div className="text-sm text-gray-600">客户无感知路由</div>
                    </div>
                    {/* 分割线 */}
                    <div className="absolute left-1/2 top-4 bottom-4 w-px bg-gradient-to-b from-transparent via-gray-200 to-transparent"></div>
                    <div className="space-y-2">
                      <div className="text-gray-700">传统ASR准确率: 80%</div>
                      <div className="text-gray-700">传统规则匹配率: 80%</div>
                      <div className="text-gray-600 mt-2">整体匹配率 60%-70%</div>
                    </div>
                  </div>
                </div>

                {/* 排队部分 */}
                <div className="relative">
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-24 text-gray-600 font-medium">
                    排队
                  </div>
                  <div className="grid grid-cols-2 gap-8 ml-32 p-6 bg-gray-50 rounded-xl border border-gray-100 relative">
                    <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                      <div className="flex items-center gap-2">
                        <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-blue-600">无需排队</span>
                      </div>
                      <div className="text-sm text-gray-600 mt-2">毫秒级响应</div>
                    </div>
                    {/* 分割线 */}
                    <div className="absolute left-1/2 top-4 bottom-4 w-px bg-gradient-to-b from-transparent via-gray-200 to-transparent"></div>
                    <div className="bg-gray-100 rounded-lg p-4 border border-gray-200">
                      <span className="text-gray-700">{'>'} 20s</span>
                      <div className="text-sm text-gray-600 mt-2">平均等待时间</div>
                    </div>
                  </div>
                </div>

                {/* 基础服务部分 */}
                <div className="relative">
                  <div className="absolute left-0 top-14 w-24 text-gray-600 font-medium">
                    基础服务
                  </div>
                  <div className="grid grid-cols-2 gap-8 ml-32 p-6 bg-gray-50 rounded-xl border border-gray-100 relative">
                    <div className="space-y-4">
                      <div className="bg-blue-50 rounded-lg p-6 border border-blue-100">
                        <div className="text-blue-700 font-medium mb-4">动态决策模型</div>
                        <div className="grid grid-cols-2 gap-4">
                          {[
                            { name: '意图识别Agent', metric: '准确率' },
                            { name: '决策Agent', metric: '分发效率' },
                            { name: 'RagAgent', metric: '命中率' },
                            { name: '语音Agent', metric: '亲和力' }
                          ].map((agent, index) => (
                            <div key={index} className="space-y-2">
                              <div className="flex items-center gap-2">
                                <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                                <span className="text-sm text-gray-700">{agent.name}</span>
                              </div>
                              <div className="text-xs text-gray-600">{agent.metric}*</div>
                            </div>
                          ))}
                        </div>
                        <div className="text-center text-purple-600 font-medium mt-4">解决95%</div>
                      </div>
                    </div>
                    {/* 分割线 */}
                    <div className="absolute left-1/2 top-4 bottom-4 w-px bg-gradient-to-b from-transparent via-gray-200 to-transparent"></div>
                    <div className="space-y-4">
                      <div className="bg-gray-100 rounded-lg p-4 border border-gray-200">
                        <span className="text-gray-700">导接</span>
                      </div>
                      <div className="bg-gray-100 rounded-lg p-4 border border-gray-200">
                        <span className="text-gray-700">L1</span>
                      </div>
                      <div className="text-center text-gray-600 mt-2">解决60%</div>
                    </div>
                  </div>
                </div>

                {/* 专家服务部分 */}
                <div className="relative">
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-24 text-gray-600 font-medium">
                    专家服务
                  </div>
                  <div className="grid grid-cols-2 gap-8 ml-32 p-6 bg-gray-50 rounded-xl border border-gray-100 relative">
                    <div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-gray-100 rounded-lg p-4 border border-gray-200">
                          <span className="text-gray-700">L2</span>
                        </div>
                        <div className="bg-gray-100 rounded-lg p-4 border border-gray-200">
                          <span className="text-gray-700">专家</span>
                        </div>
                      </div>
                      <div className="text-center text-gray-600 mt-4">解决5%</div>
                    </div>
                    {/* 分割线 */}
                    <div className="absolute left-1/2 top-4 bottom-4 w-px bg-gradient-to-b from-transparent via-gray-200 to-transparent"></div>
                    <div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-gray-100 rounded-lg p-4 border border-gray-200">
                          <span className="text-gray-700">L2</span>
                        </div>
                        <div className="bg-gray-100 rounded-lg p-4 border border-gray-200">
                          <span className="text-gray-700">专家</span>
                        </div>
                      </div>
                      <div className="text-center text-gray-600 mt-4">解决40%</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 底部数据 */}
              
            </div>
          </div>

                        {/* 技术架构图 */}
                        <div className="max-w-6xl mx-auto px-4 mb-20">
              <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm">
                <h3 className="text-2xl font-semibold text-center mb-12 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 text-transparent bg-clip-text">
                  统一渠道、全生命周期、多语言、1V "1" 金牌服务
                </h3>

                {/* 横向场景流程 */}
                <div className="flex justify-center items-center gap-8 mb-12">
                  <div className="flex items-center">
                    <div className="px-8 py-4 bg-blue-50 rounded-xl border border-blue-100 text-blue-700">
                      售前
                    </div>
                    <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                  <div className="flex items-center">
                    <div className="px-8 py-4 bg-purple-50 rounded-xl border border-purple-100 text-purple-700">
                      售中
                    </div>
                    <svg className="w-6 h-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                  <div className="px-8 py-4 bg-green-50 rounded-xl border border-green-100 text-green-700">
                    售后
                  </div>
                </div>

                {/* 纵向架构层级 */}
                <div className="grid grid-cols-4 gap-6">
                  {/* 用户层 */}
                  <div className="space-y-4">
                    <div className="bg-blue-50 p-4 rounded-xl text-center border border-blue-100">
                      <div className="font-medium text-blue-700 mb-2">用户层</div>
                      <span className="text-gray-700">专属服务人员</span>
                    </div>
                    <div className="flex justify-center">
                      <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                      </svg>
                    </div>
                  </div>

                  {/* 决策层 */}
                  <div className="space-y-4">
                    <div className="bg-purple-50 p-4 rounded-xl text-center border border-purple-100">
                      <div className="font-medium text-purple-700 mb-2">决策层</div>
                      <span className="text-gray-700">动态决策中枢</span>
                    </div>
                    <div className="flex justify-center">
                      <svg className="w-6 h-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                      </svg>
                    </div>
                  </div>

                  {/* 数据层 */}
                  <div className="space-y-4">
                    <div className="bg-green-50 p-4 rounded-xl text-center border border-green-100">
                      <div className="font-medium text-green-700 mb-2">数据层</div>
                      <span className="text-gray-700">非结构化数据平台</span>
                    </div>
                    <div className="flex justify-center">
                      <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                      </svg>
                    </div>
                  </div>

                  {/* 业务层 */}
                  <div className="space-y-4">
                    <div className="bg-orange-50 p-4 rounded-xl text-center border border-orange-100">
                      <div className="font-medium text-orange-700 mb-2">业务层</div>
                      <span className="text-gray-700">业务进化平台</span>
                    </div>
                  </div>
                </div>

                {/* 底部支撑技术 */}
                <div className="mt-12 pt-8 border-t border-gray-200">
                  <div className="flex items-center justify-center gap-2 mb-4">
                    <svg className="w-6 h-6 text-gray-600 transform rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                    <div className="font-medium text-gray-700">底层支撑技术</div>
                  </div>
                  <div className="flex flex-wrap justify-center gap-4">
                    {['大模型', '知识图谱', '多模态', '语音识别', 'RAG'].map((item, index) => (
                      <div key={index} className="px-4 py-2 bg-gray-50 rounded-full border border-gray-200">
                        <span className="text-gray-700">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 技术实力 */}
          <section className="py-20 relative bg-gray-50" id="technology">
            {/* 背景装饰 */}
            <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
            
            {/* 标题部分 */}
            <div className="text-center mb-16 max-w-4xl mx-auto px-4">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 text-transparent bg-clip-text">
                核心技术能力
              </h2>
              <p className="text-xl text-gray-600">
                打造全方位的智能服务体系
              </p>
            </div>

            {/* 技术亮点卡片 */}
            <div className="max-w-7xl mx-auto px-4 space-y-8">
              {/* 多模态识别能力 */}
              <div className="group bg-white rounded-2xl p-8 hover:shadow-lg transition-all duration-300 border border-gray-200 card-hover">
                <div className="flex items-start gap-6">
                  <div className="relative w-16 h-16 flex items-center justify-center flex-shrink-0">
                    <div className="absolute inset-0 bg-purple-100 rounded-full group-hover:scale-110 transition-transform"></div>
                    <svg className="w-8 h-8 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{position: 'relative', zIndex: 10}}>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-semibold text-purple-700 mb-4">语音模型 + 多模态视觉识别能力</h3>
                    <p className="text-gray-700 leading-relaxed mb-6">
                      为大模型"附上眼睛和耳朵"，通过多模态技术全方位感知用户需求
                    </p>
                    <div className="grid md:grid-cols-3 gap-4">
                      {[
                        { title: '情绪预测', desc: '智能预测用户情绪和语调变化' },
                        { title: '高保真语音', desc: '生成自然、富有感情的语音响应' },
                        { title: '视觉理解', desc: '通过图像理解客户现场问题' }
                      ].map((item, index) => (
                        <div key={index} className="bg-purple-50 rounded-lg p-4 group-hover:bg-purple-100 transition-colors border border-purple-100">
                          <div className="font-medium text-purple-700 mb-2">{item.title}</div>
                          <div className="text-sm text-gray-600">{item.desc}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* 智能混合调度引擎 */}
              <div className="group bg-white rounded-2xl p-8 hover:shadow-lg transition-all duration-300 border border-gray-200 card-hover">
                <div className="flex items-start gap-6">
                  <div className="relative w-16 h-16 flex items-center justify-center flex-shrink-0">
                    <div className="absolute inset-0 bg-blue-100 rounded-full group-hover:scale-110 transition-transform"></div>
                    <svg className="w-8 h-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{position: 'relative', zIndex: 10}}>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-semibold text-blue-700 mb-4">自研智能混合调度引擎</h3>
                    <p className="text-gray-700 leading-relaxed mb-6">
                      智能调度不同能力模块，确保每个客户问题都能得到最优解决方案
                    </p>
                    <div className="grid md:grid-cols-3 gap-4">
                      {[
                        { title: '智能分流', desc: '根据问题复杂度智能分配资源' },
                        { title: '实时协作', desc: '人机协作无缝衔接，提升解决效率' },
                        { title: '自适应学习', desc: '从历史案例中持续优化调度策略' }
                      ].map((item, index) => (
                        <div key={index} className="bg-blue-50 rounded-lg p-4 group-hover:bg-blue-100 transition-colors border border-blue-100">
                          <div className="font-medium text-blue-700 mb-2">{item.title}</div>
                          <div className="text-sm text-gray-600">{item.desc}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* 知识库与缓存系统 */}
              <div className="group bg-white rounded-2xl p-8 hover:shadow-lg transition-all duration-300 border border-gray-200 card-hover">
                <div className="flex items-start gap-6">
                  <div className="relative w-16 h-16 flex items-center justify-center flex-shrink-0">
                    <div className="absolute inset-0 bg-green-100 rounded-full group-hover:scale-110 transition-transform"></div>
                    <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{position: 'relative', zIndex: 10}}>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-semibold text-green-700 mb-4">企业级知识库与缓存系统</h3>
                    <p className="text-gray-700 leading-relaxed mb-6">
                      构建企业专属知识体系，实现高效精准的信息检索与应用
                    </p>
                    <div className="grid md:grid-cols-3 gap-4">
                      {[
                        { title: '知识图谱', desc: '构建企业专属知识网络，实现关联推理' },
                        { title: '智能缓存', desc: '热点问题秒级响应，降低95%延迟' },
                        { title: '持续更新', desc: '自动从对话中提取新知识点，不断完善' }
                      ].map((item, index) => (
                        <div key={index} className="bg-green-50 rounded-lg p-4 group-hover:bg-green-100 transition-colors border border-green-100">
                          <div className="font-medium text-green-700 mb-2">{item.title}</div>
                          <div className="text-sm text-gray-600">{item.desc}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* 商业价值挖掘 */}
              <div className="group bg-white rounded-2xl p-8 hover:shadow-lg transition-all duration-300 border border-gray-200 card-hover">
                <div className="flex items-start gap-6">
                  <div className="relative w-16 h-16 flex items-center justify-center flex-shrink-0">
                    <div className="absolute inset-0 bg-orange-100 rounded-full group-hover:scale-110 transition-transform"></div>
                    <svg className="w-8 h-8 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{position: 'relative', zIndex: 10}}>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-semibold text-orange-700 mb-4">商业价值挖掘系统</h3>
                    <p className="text-gray-700 leading-relaxed mb-6">
                      将客户互动转化为商业洞察，驱动业务增长
                    </p>
                    <div className="grid md:grid-cols-3 gap-4">
                      {[
                        { title: '意图识别', desc: '精准捕捉客户购买意向与需求' },
                        { title: '智能推荐', desc: '基于上下文的个性化产品推荐' },
                        { title: '转化追踪', desc: '全链路追踪客户转化路径与效果' }
                      ].map((item, index) => (
                        <div key={index} className="bg-orange-50 rounded-lg p-4 group-hover:bg-orange-100 transition-colors border border-orange-100">
                          <div className="font-medium text-orange-700 mb-2">{item.title}</div>
                          <div className="text-sm text-gray-600">{item.desc}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 客户案例 */}
          <section className="py-20 relative bg-gray-50" id="cases">
            {/* 背景装饰 */}
            <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
            
            {/* 标题部分 */}
            <div className="text-center mb-20 max-w-4xl mx-auto px-4">
              <div className="inline-flex items-center justify-center mb-6">
                <svg className="w-10 h-10 text-blue-600 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{position: 'relative', zIndex: 10}}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 text-transparent bg-clip-text">
                实际案例
              </h2>
              <p className="text-xl text-gray-600">
                从客户体验提升到企业效率优化，真实案例展现十倍增长价值
              </p>
              <div className="w-24 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 mx-auto mt-8"></div>
            </div>

            {/* 案例展示 */}
            <div className="max-w-7xl mx-auto px-4 mb-20">
              <div className="grid md:grid-cols-2 gap-8">
                {/* 外部客户体验 */}
                <div className="group bg-white rounded-2xl p-8 hover:shadow-lg transition-all duration-300 border border-gray-200 card-hover">
                  <div className="flex items-start gap-6 mb-8">
                    <div className="relative w-16 h-16 flex items-center justify-center flex-shrink-0">
                      <div className="absolute inset-0 bg-blue-100 rounded-full group-hover:scale-110 transition-transform"></div>
                    <svg className="w-8 h-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{position: 'relative', zIndex: 10}}>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905 0 .905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                    </svg>
                  </div>
                    <div>
                      <h3 className="text-2xl font-semibold text-blue-700 mb-2">提升客户满意度，赢回用户信任</h3>
                      <p className="text-gray-700"></p>
                  </div>
                </div>

                  {/* 数据展示 */}
                  <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="bg-blue-50 rounded-xl p-6 border border-blue-100">
                      <div className="text-3xl font-bold text-blue-700 mb-2">+20%</div>
                      <div className="text-sm text-gray-600">客户满意度提升</div>
                      <div className="mt-4 h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full w-[90%] bg-blue-500 rounded-full transition-all duration-1000 group-hover:opacity-80"></div>
                      </div>
                    </div>
                    <div className="bg-blue-50 rounded-xl p-6 border border-blue-100">
                      <div className="text-3xl font-bold text-blue-700 mb-2">95%</div>
                      <div className="text-sm text-gray-600">首次解决率</div>
                      <div className="mt-4 h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full w-[95%] bg-blue-500 rounded-full transition-all duration-1000 group-hover:opacity-80"></div>
                      </div>
                    </div>
                  </div>

                  {/* 用户评价 */}
                  <div className="bg-blue-50 rounded-xl p-6 border border-blue-100">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                        <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-gray-700 italic">"客服响应迅速，问题一次解决，真是贴心！"</p>
                        <div className="text-sm text-blue-600 mt-2">— 客户之声</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 内部企业效率 */}
                <div className="group bg-white rounded-2xl p-8 hover:shadow-lg transition-all duration-300 border border-gray-200 card-hover">
                  <div className="flex items-start gap-6 mb-8">
                    <div className="relative w-16 h-16 flex items-center justify-center flex-shrink-0">
                      <div className="absolute inset-0 bg-orange-100 rounded-full group-hover:scale-110 transition-transform"></div>
                      <svg className="w-8 h-8 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{position: 'relative', zIndex: 10}}>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-2xl font-semibold text-orange-700 mb-2">降低成本，驱动业务增长</h3>
                      <p className="text-gray-700"></p>
                    </div>
                  </div>

                  {/* 数据展示 */}
                  <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="bg-orange-50 rounded-xl p-6 border border-orange-100">
                      <div className="text-3xl font-bold text-orange-700 mb-2">-35%</div>
                      <div className="text-sm text-gray-600">运营成本降低</div>
                      <div className="mt-4 h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full w-[65%] bg-orange-500 rounded-full transition-all duration-1000 group-hover:opacity-80"></div>
                      </div>
                    </div>
                    <div className="bg-orange-50 rounded-xl p-6 border border-orange-100">
                      <div className="text-3xl font-bold text-orange-700 mb-2">2倍</div>
                      <div className="text-sm text-gray-600">工单处理量提升</div>
                      <div className="mt-4 h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full w-[88%] bg-orange-500 rounded-full transition-all duration-1000 group-hover:opacity-80"></div>
                      </div>
                    </div>
                  </div>

                  {/* 企业评价 */}
                  <div className="bg-orange-50 rounded-xl p-6 border border-orange-100">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center">
                        <svg className="w-6 h-6 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-gray-700 italic">"效率翻倍，成本大幅下降，助力业务增长！"</p>
                        <div className="text-sm text-orange-600 mt-2">— 客服负责人</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 数据对比表格 */}
            {/*
            <div className="max-w-4xl mx-auto px-4">
              <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="py-4 px-6 text-left text-gray-600">指标</th>
                      <th className="py-4 px-6 text-center text-gray-600">传统客服</th>
                      <th className="py-4 px-6 text-center text-green-600">闪电侠</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {[
                      { metric: '客户满意度', traditional: '60%-70%', lightning: '提升20%（达90%）' },
                      { metric: '运营成本', traditional: '基准', lightning: '降低35%' },
                      { metric: '首次解决率', traditional: '60%-70%', lightning: '≥95%' },
                      { metric: '工单处理效率', traditional: '基准', lightning: '提升2倍' }
                    ].map((row, index) => (
                      <tr key={index} className="group hover:bg-gray-50 transition-colors">
                        <td className="py-4 px-6 text-gray-700">{row.metric}</td>
                        <td className="py-4 px-6 text-center text-gray-600">{row.traditional}</td>
                        <td className="py-4 px-6 text-center text-green-600 font-medium group-hover:scale-110 transition-transform">
                          {row.lightning}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            */}
          </section>

          {/* ROI计算器与行动号召 */}
          <section className="py-20 relative bg-gray-50">
            {/* 背景装饰 */}
            <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
            
            {/* 标题部分 */}
            <div className="text-center mb-16 max-w-4xl mx-auto px-4">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 text-transparent bg-clip-text">
                计算您的投资回报
              </h2>
              <p className="text-xl text-gray-600">
                通过智能分析，了解"闪电侠"为您带来的价值
              </p>
            </div>

            {/* ROI计算器 */}
            <div className="max-w-6xl mx-auto px-4 mb-20">
              <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-lg">
                <div className="grid md:grid-cols-2 gap-12">
                  {/* 左侧：参数输入 */}
                  <div className="space-y-8">
                    <h3 className="text-2xl font-semibold text-blue-600 mb-6">输入您的业务参数</h3>
                    
                    {/* 年咨询量 */}
                <div className="space-y-4">
                      <label className="block text-gray-700">年咨询量：30（万次）</label>
                      <div className="relative">
                        <input 
                          type="range" 
                          min="20" 
                          max="100" 
                          step="20"
                          defaultValue="30"
                          className="w-full h-2 bg-gray-200 rounded-full appearance-none cursor-pointer"
                        />
                        <div className="flex justify-between text-sm text-gray-600 mt-2">
                          <span>10</span>
                          <span>30</span>
                          <span>50</span>
                          <span>70</span>
                          <span>100</span>
                      </div>
                    </div>
                    </div>

                    {/* AI接管率 */}
                    <div className="space-y-4">
                      <label className="block text-gray-700">AI 接管率提升到：95% </label>
                      <div className="relative">
                        <input 
                          type="range" 
                          min="0" 
                          max="1" 
                          step="0.1"
                          defaultValue="0.95"
                          className="w-full h-2 bg-gray-200 rounded-full appearance-none cursor-pointer"
                        />
                        <div className="flex justify-between text-sm text-gray-600 mt-2">
                          <span>0%</span>
                          <span>25%</span>
                          <span>50%</span>
                          <span>75%</span>
                          <span>100%</span>
                        </div>
                    </div>
                  </div>

                    {/* 缓存命中率 */}
                    <div className="space-y-4">
                      <label className="block text-gray-700">平均处理时长降低：1/3</label>
                      <div className="relative">
                        <input 
                          type="range" 
                          min="0" 
                          max="1" 
                          step="0.1"
                          defaultValue="0.33"
                          className="w-full h-2 bg-gray-200 rounded-full appearance-none cursor-pointer"
                        />
                        <div className="flex justify-between text-sm text-gray-600 mt-2">
                          <span>0%</span>
                          <span>30%</span>
                          <span>50%</span>
                          <span>70%</span>
                          <span>100%</span>
                      </div>
                    </div>
                    </div>
                  </div>

                  {/* 右侧：结果展示 */}
                  <div className="space-y-8">
                    <h3 className="text-2xl font-semibold text-green-600 mb-6">预期收益分析</h3>
                    
                    {/* 成本对比 */}
                    <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                      <div className="flex justify-between items-center mb-4">
                        <div className="text-gray-700">年度综合成本（TCO）</div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <div className="text-sm text-gray-600">传统方案</div>
                            <div className="text-xl font-bold text-red-600">￥1220万</div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm text-gray-600">闪电侠</div>
                            <div className="text-xl font-bold text-green-600">￥124万</div>
                          </div>
                        </div>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full w-[10%] bg-green-500 rounded-full"></div>
                      </div>
                      <div className="text-sm text-green-600 mt-2">预计节省90%成本</div>
                    </div>

                    {/* 效率提升 */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                        <div className="text-3xl font-bold text-purple-600 mb-2">10倍</div>
                        <div className="text-sm text-gray-600">效率提升</div>
                      </div>
                      <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                        <div className="text-3xl font-bold text-blue-600 mb-2">95%</div>
                        <div className="text-sm text-gray-600">首次解决率</div>
                      </div>
                    </div>

                    
                  </div>
                </div>
              </div>
            </div>

            {/* 行动按钮 */}
            <div className="text-center space-y-8">
              <div className="flex flex-wrap justify-center gap-4">
                <button 
                  onClick={handleShowQR}
                  className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl text-lg font-semibold text-white hover:opacity-90 transition-opacity flex items-center gap-2 shadow-md"
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  立即联系我们
                </button>
                {/*
                <button className="px-8 py-4 bg-gradient-to-r from-green-500 to-blue-500 rounded-xl text-lg font-semibold hover:opacity-90 transition-opacity flex items-center gap-2">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  7天免费试用
                </button>
                */}
              </div>
             
            </div>
          </section>

          
          
          {/* 其他内容 */}
          {/* ... existing code ... */}
        </main>

        {/* Professional Footer */}
        <footer className="bg-gray-900 text-white pt-16 pb-8">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
              {/* Company Info */}
              <div className="space-y-4">
                <div className="text-2xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-blue-500 text-transparent bg-clip-text mb-4">
                GenAI-CXaas解决方案
                </div>
                <p className="text-gray-400 text-sm">
                  我们致力于通过AI技术重新定义客户服务体验，为企业提供智能、高效、低成本的客户服务解决方案。
                </p>
                <div className="flex space-x-4 pt-4">
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                    </svg>
                  </a>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                  </a>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                    </svg>
                  </a>
                </div>
              </div>
              
              {/* Solutions */}
              <div>
                <h3 className="text-lg font-semibold mb-6">产品</h3>
                <ul className="space-y-3">
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">数字人方案Xman</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">动态决策系统EAgentOS</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">知识爬虫WorkflRPA</a></li>
    
                </ul>
              </div>
              
              {/* Resources */}
              <div>
                <h3 className="text-lg font-semibold mb-6">资源</h3>
                <ul className="space-y-3">
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">博客</a></li>
                </ul>
              </div>
              
              {/* Contact */}
              <div>
                <h3 className="text-lg font-semibold mb-6">联系我们</h3>
                <ul className="space-y-3">
                  <li className="flex items-start space-x-3 text-sm">
                    <svg className="w-5 h-5 text-gray-400 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="text-gray-400">福州市仓山区金山大道618号桔园洲工业园19＃楼</span>
                  </li>
                  <li className="flex items-start space-x-3 text-sm">
                    <svg className="w-5 h-5 text-gray-400 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span className="text-gray-400">wuguihua@ruijie.com.cn</span>
                  </li>
                  {/*   
                  <li className="flex items-start space-x-3 text-sm">
                    <svg className="w-5 h-5 text-gray-400 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <span className="text-gray-400">400-123-4567</span>
                  </li>
                  */}
                  <li className="flex flex-col space-y-2">
                    <div className="flex items-start space-x-3 text-sm">
                      <svg className="w-5 h-5 text-gray-400 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                      </svg>
                      <span className="text-gray-400">微信</span>
                    </div>
                    <div className="ml-8">
                      <div className="bg-gray-800 p-3 rounded-lg inline-block">
                        <Image
                          src="/images/wechat-qr.png"
                          alt="微信二维码"
                          width={120}
                          height={120}
                          className="rounded-md"
                        />
                        <div className="text-center mt-2">
                          <span className="text-xs text-gray-400">扫码添加好友</span>
                        </div>
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
            </div>

            {/* Bottom Footer */}
            <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center">
              <div className="text-gray-500 text-sm">
                © 2024 GenAI-CXaas解决方案. 保留所有权利.
              </div>
              <div className="flex space-x-6 mt-4 md:mt-0">
                <a href="#" className="text-gray-500 hover:text-gray-400 text-sm">隐私政策</a>
                <a href="#" className="text-gray-500 hover:text-gray-400 text-sm">服务条款</a>
                <a href="#" className="text-gray-500 hover:text-gray-400 text-sm">Cookie政策</a>
              </div>
            </div>
          </div>
        </footer>
    </div>
    </>
  );
}
