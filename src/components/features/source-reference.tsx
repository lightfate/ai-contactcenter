"use client"

import { motion } from "framer-motion"
import type { Source } from "@/types/chat"

/**
 * 引用来源组件
 * 显示AI回答的参考来源
 */
interface SourceReferenceProps {
  sources: Source[]
}

export default function SourceReference({ sources }: SourceReferenceProps) {
  if (!sources || sources.length === 0) return null

  return (
    <motion.div
      className="mt-2 ml-11"
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      transition={{ duration: 0.3 }}
    >
      <div className="text-sm text-gray-500 mb-1">查看文档</div>
      <div className="space-y-1">
        {sources.map((source, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 * index }}
          >
            <a
              href={source.url}
              className="flex items-center gap-1 text-sm text-primary hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg className="icon-sm">
                <use href="/icons.svg#icon-link" />
              </svg>
              {source.title}
            </a>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}
