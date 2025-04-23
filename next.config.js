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
        destination: process.env.FASTGPT_API_URL + '/openapi/:path*',
      }
    ]
  }
}

module.exports = nextConfig 