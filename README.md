# Sophia Chat Assistant

一个智能聊天助手应用，提供对话分析和情感支持功能。本项目使用 OpenRouter API 作为 AI 服务提供商。

## 🔑 OpenRouter API 配置

本项目**仅支持** OpenRouter 平台，使用前请先：

1. 访问 [OpenRouter.ai](https://openrouter.ai/) 注册账户
2. 在 [Keys 页面](https://openrouter.ai/keys) 创建 API 密钥
3. 将密钥添加到 `.env.local` 文件：
   ```env
   OPENROUTER_API_KEY=your_api_key_here
   ```

## 功能特色

### 🎯 分析与建议模式
- 分析对话内容的语气、情感和潜在含义
- 提供个性化的回复建议
- 生成后续问题帮助深入理解
- 支持一键复制建议回复

### 🌿 树洞模式
- 提供安全的情感宣泄空间
- 温暖的陪伴和情感支持
- 非评判性的倾听环境

## 技术栈

- **框架**: Next.js 13+ (App Router)
- **语言**: TypeScript
- **样式**: Tailwind CSS + Shadcn UI
- **AI服务**: OpenRouter API (Google Gemini)
- **状态管理**: React Hooks + LocalStorage

## 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 配置环境变量

创建 `.env.local` 文件并添加 OpenRouter API 密钥：

```env
# OpenRouter API 配置
OPENROUTER_API_KEY=your_api_key_here
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SITE_NAME=Sophia Chat Assistant
```

### 3. 启动开发服务器

```bash
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000) 开始使用。

## 项目结构

```
project/
├── app/                    # Next.js App Router
│   ├── api/chat/          # API 路由
│   ├── globals.css        # 全局样式
│   ├── layout.tsx         # 根布局
│   └── page.tsx           # 首页
├── components/            # React 组件
│   ├── ui/               # UI 组件库
│   ├── chat-page.tsx     # 聊天页面
│   ├── home-page.tsx     # 首页
│   └── ...
├── lib/                  # 工具函数
│   ├── chat-service.ts   # 聊天服务
│   ├── types.ts          # 类型定义
│   └── ...
└── hooks/               # 自定义 Hooks
```

## API 配置

项目使用 OpenRouter API 提供 AI 对话功能：

- **默认模型**: Google Gemini 2.5 Flash Preview
- **分析模式**: 温度 0.7，专注于客观分析
- **树洞模式**: 温度 0.8，专注于情感支持

可在 `lib/openai.ts` 中查看和修改 API 配置。

## 开发说明

### 添加新功能

1. 在 `lib/types.ts` 中定义新的类型
2. 在 `components/` 中创建新组件
3. 在 `app/api/` 中添加新的 API 路由（如需要）

### 自定义 AI 行为

编辑 `app/api/chat/route.ts` 中的 `getSystemPrompt` 函数来调整 AI 的行为。

## 部署说明

### Vercel 部署

1. 在 Vercel 项目设置中添加环境变量：
   - 名称：`OPENROUTER_API_KEY`
   - 值：你的 OpenRouter API 密钥

2. 重新部署项目

### 其他平台部署

确保在部署环境中正确设置 `OPENROUTER_API_KEY` 环境变量。

## 许可证

MIT License 