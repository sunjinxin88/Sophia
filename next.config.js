/** @type {import('next').NextConfig} */
const nextConfig = {
  // 移除 output: 'export' 配置以支持 API 路由和服务端渲染
  // 本项目需要支持 /app/api 路由用于 OpenRouter/AI API 调用
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    domains: ['openrouter.ai'], // 允许来自 OpenRouter 的图片
  },
};

module.exports = nextConfig;
