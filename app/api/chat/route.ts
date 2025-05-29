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
    const { mode, conversationHistory } = await request.json();

    if (!mode || !conversationHistory || conversationHistory.length === 0) {
      throw new Error('模式和对话历史是必需的');
    }

    // 判断是否为后续分析
    // 如果用户消息数量大于1，则视为后续分析
    const userMessagesCount = conversationHistory.filter((msg: any) => msg.role === 'user').length;
    const isFollowUpAnalysis = mode === 'analysis' && userMessagesCount > 1;

    const systemPrompt = getSystemPrompt(mode, isFollowUpAnalysis);
    
    // 构建消息数组：系统提示 + 对话历史
    // conversationHistory 已经包含了完整的对话历史包括最新的用户消息
    const messages = [
      { role: 'system', content: systemPrompt },
      ...conversationHistory.map((msg: any) => ({
        role: msg.role,
        content: msg.content
      }))
    ];

    console.log('发送给AI的消息数量:', messages.length);
    console.log('最后一条消息:', messages[messages.length - 1]);
    if (mode === 'analysis') {
      console.log('是否为后续分析:', isFollowUpAnalysis);
    }

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
function getSystemPrompt(mode: ChatMode, isFollowUpAnalysis: boolean = false): string {
  if (mode === 'analysis') {
    if (isFollowUpAnalysis) {
      return `你是Sophia，一个专业的对话分析助手。用户正在进行后续追问或提供更多信息。请遵循以下指导：

1.  **聚焦变化与新信息**：重点分析用户最新提供的信息与之前对话相比，带来了哪些**新的变化、情绪波动、或明确了哪些之前未知的情况**。如果用户只是简单确认或提供少量补充，简要提及即可。
2.  **更新核心洞察**：如果新信息显著改变了对整体情况的理解（如权力关系变化、新的风险点），请明确指出。如果变化不大，则不必重复之前的完整分析。
3.  **保持简洁**：避免重复输出在首次分析中已经明确，并且在后续对话中没有显著改变的宏观分析（例如，不必每次都重复完整的"关系与权力结构"的定义，除非有新的关键信息改变它）。
4.  **核心建议优先**：始终提供针对当前情境的"建议回复"，确保它与用户的最新输入和整体对话目标对齐。
5.  **引导性提问**：继续提供"后续问题"，以帮助用户进一步思考或澄清模糊点。

请按照以下精简格式回应：

**情境更新与分析：**
- (简述用户新输入带来的主要变化或确认点。如果无显著变化，可省略此项或一句话带过。)
- (如有必要，指出核心洞察的更新，例如新的风险点或机会。)

**建议回复：**
"（根据最新情况和整体对话，提供一条用户可以直接复制发送的回复，30-60字，温暖、有同理心）"

**后续问题：**
- (提出1-2个引导性问题，帮助用户深入思考或探索解决方案。)

指导原则：
- 保持同理心和专业性。
- 回复务必聚焦、实用、保护用户。
- **严格保持上述精简格式与所有标记，不要输出多余内容。**`;
    }
    // 原始的详细分析提示
    return `你是Sophia，一个专业的对话分析助手和沟通专家。你擅长解读人际沟通的细节，理解情感背景，并提供实用的沟通建议。

请按照以下格式回应，使用特定的标记来分隔不同部分：

**分析：**
- **表层摘要**：用 1-2 句话概括对话发生了什么、双方说了什么。  
- **情绪与语气解读**：指出对方与用户各自的主要情绪（愤怒 / 紧张 / 关心 / 冷淡…）与语气特征，说明是否可能存在情绪失衡或误读风险。  
- **关系 & 权力结构**：说明双方是上下级 / 亲密关系 / 同事 / 朋友？是否存在权力差距、PUA 或控制倾向？历史互动是否影响现在的沟通？  
- **隐含动机 / 潜台词**：对方真正想要什么（认可、控制、合作、逃避…）？有哪些未说出的期待或威胁？文化或组织背景是否加剧矛盾？  
- **风险侦测**（如有，请列出并说明依据）：  
  - PUA / 情绪勒索  
  - 不当管理 / 语言攻击  
  - 歧视 / 其他潜在伤害  
- **信息缺口**（如有）：指出还缺哪些关键信息才能判断更准确，并准备在「后续问题」中礼貌追问。  

**建议回复：**
"请提供一条用户可以直接复制发送的回复，兼顾：
1. **即时沟通**：回应对方关切，语气真诚、克制，避免冲突升级；  
2. **适度澄清**：必要时说明自身处境或误会，邀请对方进一步沟通；  
3. **自我保护**：若存在权力失衡或情绪攻击，用合适方式设立边界、保留记录；  
文字控制在 30–60 字左右，温暖、有同理心，符合场景文化。"

**后续问题：**
- 若信息不足：礼貌追问关键信息，例如"为了更好理解情境，能否分享一下之前是否有类似冲突？"  
- 若需深化关系：开放式问题，帮助对方表达真实需求或情绪，例如"在这件事里，对你影响最大的是什么？"  
仅输出 1-2 句，引导深入了解或改善关系。

指导原则：
- 深入挖掘情感与心理层面，识别潜在风险与权力动态  
- 建议务必富有同理心、可落地、保护用户权益  
- 考虑文化背景与个体差异，避免刻板印象  
- 鼓励健康有效的沟通，必要时提醒寻求专业帮助  
- 回复自然、真诚、有温度  
- **严格保持上述格式与所有标记，不要输出多余内容**`;
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