export const dynamic = "force-dynamic"; // 确保路由不会被静态优化，始终在运行时处理请求

/**
 * OpenRouter API Integration
 * 本项目使用 OpenRouter 作为 AI 服务提供商，支持流式输出
 * 文档: https://openrouter.ai/docs
 * 
 * @note 此文件为纯 API 路由处理，不包含任何页面渲染逻辑
 * @note 使用 force-dynamic 确保请求体解析在运行时进行
 */

import { NextRequest } from 'next/server';
import { ChatMode } from '@/lib/types';
import openai, { AVAILABLE_MODELS, MODEL_TEMPERATURE } from '@/lib/openai';

// API 路由处理函数
export async function POST(request: NextRequest) {
  try {
    const { message, mode, conversationHistory } = await request.json();

    if (!message || !mode) {
      throw new Error('消息内容和模式是必需的');
    }

    const systemPrompt = getSystemPrompt(mode);
    const messages = [
      { role: 'system', content: systemPrompt },
      ...conversationHistory.map((msg: any) => ({
        role: msg.role,
        content: msg.content
      })),
      { role: 'user', content: message }
    ];

    const response = await openai.chat.completions.create({
      model: AVAILABLE_MODELS.GEMINI,
      messages: messages,
      temperature: mode === 'analysis' ? MODEL_TEMPERATURE.ANALYSIS : MODEL_TEMPERATURE.TREEHOLE,
      max_tokens: 1000,
      stream: true,
    });

    // 创建一个新的 ReadableStream
    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();
        
        try {
          for await (const chunk of response) {
            const content = chunk.choices[0]?.delta?.content || '';
            if (content) {
              controller.enqueue(encoder.encode(content));
            }
          }
          controller.close();
        } catch (e) {
          console.error('Error processing stream:', e);
          controller.error(e);
        }
      }
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });

  } catch (error: any) {
    console.error('OpenRouter API Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}

/**
 * 根据聊天模式获取系统提示
 */
function getSystemPrompt(mode: ChatMode): string {
  if (mode === 'analysis') {
    return `你是Sophia，一个专业的对话分析助手。你的任务是帮助用户分析对话内容并提供建议。
请一步一步地分析和回应：

1. 首先，分析对话的语气和情感：
[分析中...]

2. 然后，提供具体的建议：
[思考中...]

3. 最后，提出后续问题：
[生成中...]

注意：
- 保持专业和客观
- 提供实用的建议
- 考虑文化背景和情感因素
- 建议要礼貌和建设性`;
  } else {
    return `你是Sophia，一个温暖、有同理心的聊天伙伴。你的角色是提供情感支持和陪伴，不是分析或给建议。

你的特点：
- 善于倾听和理解
- 提供情感支持和共情
- 不评判，不分析
- 温暖、真诚、有耐心
- 用简洁而温暖的话语回应

请始终以支持性、非评判性的方式回应用户。专注于理解和陪伴，而不是解决问题或给出建议。

在回应时，请慢慢地、温和地表达，让用户感受到你的关心和理解。`;
  }
}

/**
 * 解析分析模式的 AI 响应
 */
function parseAnalysisResponse(response: string) {
  const analysisMatch = response.match(/\*\*分析：\*\*\s*([\s\S]*?)(?=\*\*建议回复：\*\*)/);
  const suggestionMatch = response.match(/\*\*建议回复：\*\*\s*"([^"]*)"|\*\*建议回复：\*\*\s*([\s\S]*?)(?=\*\*后续问题：\*\*)/);
  const followUpMatch = response.match(/\*\*后续问题：\*\*\s*([\s\S]*?)$/);

  return {
    content: "我已经分析了这个情况，以下是我的见解：",
    analysis: analysisMatch ? analysisMatch[1].trim() : null,
    suggestion: suggestionMatch ? (suggestionMatch[1] || suggestionMatch[2])?.trim() : null,
    followUp: followUpMatch ? followUpMatch[1].trim() : null,
  };
} 