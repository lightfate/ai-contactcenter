'use client'

import { motion } from 'framer-motion'

/**
 * LoadingDot Component
 * 使用 Framer Motion 实现单个圆点的加载动画
 * 圆点持续缩放，形成平滑的加载效果
 */
const LoadingDot = ({ size = 8, color = '#000' }) => {
  return (
    <motion.span
      className="inline-block rounded-full"
      style={{
        width: size,
        height: size,
        backgroundColor: color,
      }}
      animate={{
        scale: [0.5, 1, 0.5],
      }}
      transition={{
        duration: 0.8,
        ease: 'easeInOut',
        repeat: Infinity,
      }}
    />
  );
};

export default LoadingDot; 