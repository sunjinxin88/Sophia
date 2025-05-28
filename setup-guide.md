# 🚀 Sophia 聊天助手设置指南

## 当前状态
✅ 项目已成功启动在 http://localhost:3000  
✅ 所有依赖已安装完成  
✅ API 路由已配置完成  

## ⚠️ 需要配置 OpenRouter API 密钥

目前项目使用模拟的 API 密钥，需要您提供真实的 OpenRouter API 密钥才能使用真实的 AI 功能。

### 步骤 1: 获取 OpenRouter API 密钥

1. 访问 [OpenRouter.ai](https://openrouter.ai/)
2. 点击右上角 "Sign Up" 注册账户
3. 登录后，点击右上角头像 → "Keys"
4. 点击 "Create Key" 创建新的 API 密钥
5. 复制生成的 API 密钥

### 步骤 2: 配置环境变量

编辑项目根目录下的 `.env.local` 文件：

```bash
# 打开文件
code .env.local
# 或者
nano .env.local
```

将文件内容修改为：

```env
# OpenRouter API 配置
OPENROUTER_API_KEY=sk-or-v1-your-actual-api-key-here
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SITE_NAME=Sophia Chat Assistant
```

**重要**: 将 `sk-or-v1-your-actual-api-key-here` 替换为您从 OpenRouter 获取的真实 API 密钥。

### 步骤 3: 重启开发服务器

在终端中停止当前服务器（Ctrl+C），然后重新启动：

```bash
npm run dev
```

### 步骤 4: 测试功能

1. 访问 http://localhost:3000
2. 选择 "分析与建议" 或 "树洞" 模式
3. 发送一条测试消息
4. 等待 AI 回复

## 🎯 使用指南

### 分析与建议模式
- 适合需要对话分析和回复建议的场景
- AI 会分析对话背景、情感状态，并提供具体的回复建议
- 可以复制建议的回复内容

### 树洞模式  
- 适合情感宣泄和心理支持
- AI 会提供温暖的陪伴，不会分析或评判
- 专注于倾听和情感支持

## 🔧 技术细节

- **AI 模型**: Google Gemini 2.5 Flash Preview
- **API 服务**: OpenRouter
- **数据存储**: 浏览器本地存储（LocalStorage）
- **聊天记录**: 按模式分别保存，自动持久化

## ❓ 常见问题

**Q: API 密钥从哪里获取？**  
A: 访问 [OpenRouter.ai](https://openrouter.ai/) 注册并获取免费的 API 密钥。

**Q: 聊天记录会被保存吗？**  
A: 聊天记录保存在您的浏览器本地存储中，不会上传到服务器。

**Q: 可以更换 AI 模型吗？**  
A: 可以在 `app/api/chat/route.ts` 文件中修改 `model` 参数。

**Q: 如何清除聊天记录？**  
A: 清除浏览器的本地存储数据，或在开发者工具中删除 `chat-messages` 键。

## 🚨 注意事项

- API 密钥请妥善保管，不要分享给他人
- OpenRouter 的使用可能产生费用，请查看其定价政策
- 首次使用可能需要在 OpenRouter 充值账户余额 