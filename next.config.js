/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // 在构建时忽略 ESLint 错误
  },

  experimental: {
    serverActions: {
      allowedOrigins: ['json.schemastore.org'],
      tls: {
        minVersion: 'TLSv1.2',
        ciphers: 'TLS_AES_256_GCM_SHA384'
      }
    }
  },
  async rewrites() {
    return [
      {
        source: '/openapi/:path*',
        destination: process.env.NEXT_PUBLIC_FASTGPT_API_URL + '/openapi/:path*',
      }
    ]
  },
  reactStrictMode: true,
  webpack: (config, { dev, isServer }) => {
    // 仅在生产构建时修改缓存配置
    if (!dev) {
      // 降低webpack缓存使用
      config.cache = {
        type: 'memory', // 使用内存缓存而非磁盘
        maxGenerations: 1,
      };
    }
    return config;
  },
  // 减少输出文件夹大小
  output: 'standalone',
}

module.exports = nextConfig 