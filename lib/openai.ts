/**
 * OpenRouter API Client Configuration
 * 本项目使用 OpenRouter 作为 AI 服务提供商
 * 文档: https://openrouter.ai/docs
 */

import OpenAI from 'openai';

if (!process.env.OPENROUTER_API_KEY) {
  throw new Error(
    'Missing OPENROUTER_API_KEY environment variable. ' +
    'Please set it in your .env.local file or deployment environment. ' +
    'Get your API key from https://openrouter.ai/keys'
  );
}

// 创建 OpenRouter API 客户端实例
const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
});

export default openai;

// 支持的模型列表
export const AVAILABLE_MODELS = {
  GEMINI: "google/gemini-2.5-flash-preview",
  // 可以根据需要添加其他 OpenRouter 支持的模型
} as const;

// 模型温度配置
export const MODEL_TEMPERATURE = {
  ANALYSIS: 0.7,  // 分析模式：更确定性的输出
  TREEHOLE: 0.8,  // 树洞模式：更有创意的回应
} as const; 