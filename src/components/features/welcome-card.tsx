'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'

/**
 * 欢迎卡片组件
 * 用于在用户首次进入聊天界面时显示欢迎信息
 */
export default function WelcomeCard() {
  const welcomeText = [
    "你好，欢迎使用青鸟。👋",
    "我是是青鸟的客服助手，我叫青青。告诉我你有什么问题，我会尽我所能帮助你。"
  ]
  
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
        }, 8) // 调整速度
        
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
        <h2 className="text-base font-bold">青青·客服助手</h2>
      </div>
      
      {/* 内容行 */}
      <div className="text-base leading-[40px]">
        <p>{displayedText[0]}</p>
        <p>{displayedText[1]}</p>
      </div>
    </div>
  )
} 