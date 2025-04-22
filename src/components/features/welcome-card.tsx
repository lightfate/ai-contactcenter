'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { parseCookies, setCookie } from 'nookies'

/**
 * 设置cookie的辅助函数
 */
const setCookieHelper = (name: string, value: string) => {
  try {
    // 设置cookie，过期时间为1年
    setCookie(null, name, value, {
      maxAge: 365 * 24 * 60 * 60, // 1年有效期
      path: '/',
      sameSite: 'strict',
    });
    return true;
  } catch (error) {
    console.error('无法设置cookie:', error);
    return false;
  }
};

/**
 * 获取cookie的辅助函数
 */
const getCookieHelper = (name: string) => {
  try {
    const cookies = parseCookies();
    return cookies[name];
  } catch (error) {
    console.error('无法获取cookie:', error);
    return null;
  }
};

/**
 * 欢迎卡片组件
 * 用于在用户首次进入聊天界面时显示欢迎信息
 */
export default function WelcomeCard() {
  // 根据时间段生成问候语
  const getGreetingByTime = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) {
      return " 早上好呀～有什么可以帮助您的？😊";
    } else if (hour >= 12 && hour < 18) {
      return " 下午好呀～有什么可以帮助您的？😊";
    } else {
      return " 晚上好呀～有什么可以帮助您的？😊";
    }
  };

  // 检查用户是否之前访问过
  const checkIsReturningUser = () => {
    try {
      const hasVisited = getCookieHelper('hasVisitedBefore');
      if (hasVisited) {
        return true;
      } else {
        // 设置访问标记
        setCookieHelper('hasVisitedBefore', 'true');
        return false;
      }
    } catch (error) {
      // 处理cookie不可用的情况
      console.error('无法访问cookie:', error);
      return false;
    }
  };

  // 生成动态欢迎文本
  const generateWelcomeText = () => {
    const isReturningUser = checkIsReturningUser();
    const timeGreeting = getGreetingByTime();
    
    if (isReturningUser) {
      return [`欢迎回来👏${timeGreeting}`];
    } else {
      return [timeGreeting];
    }
  };

  const welcomeText = generateWelcomeText();
  
  const [displayedText, setDisplayedText] = useState<string[]>(["", ""])
  const [currentLine, setCurrentLine] = useState(0)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isTypingComplete, setIsTypingComplete] = useState(false)

  // 打字机效果
  useEffect(() => {
    if (currentLine < welcomeText.length) {
      if (currentIndex < welcomeText[currentLine].length) {
        const timer = setTimeout(() => {
          setDisplayedText(prev => {
            const newText = [...prev]
            newText[currentLine] = welcomeText[currentLine].substring(0, currentIndex + 1)
            return newText
          })
          setCurrentIndex(prev => prev + 1)
        }, 2) // 调整速度
        
        return () => clearTimeout(timer)
      } else {
        // 当前行打字完成，移动到下一行
        setCurrentLine(prev => prev + 1)
        setCurrentIndex(0)
      }
    } else {
      // 所有文本都打字完成
      setIsTypingComplete(true)
    }
  }, [currentLine, currentIndex, welcomeText])

  return (
    <div className="rounded-[32px] bg-[#F5F5F5] p-6 mb-4 w-auto inline-block mx-auto">
      {/* 标题行 */}
      <div className="flex items-center gap-2 mb-3">
        <div className="w-auto h-auto text-blue-600">
        <div className="rounded-md ">
                <Image src="/service-avatar.webp" alt="头像" width={38} height={38} />
              </div>
        </div>
        <h2 className="text-base font-bold">青青（工号：7088，您的专属客服）</h2>
      </div>
      
      {/* 内容行 */}
      <div className="text-base leading-[40px]">
        <p>{displayedText[0]}</p>
      </div>
    </div>
  )
} 