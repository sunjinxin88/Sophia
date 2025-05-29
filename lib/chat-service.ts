import { ChatMode, Message } from '@/lib/types';

export interface ChatResponse {
  content: string;
  analysis?: string;
  suggestion?: string;
  followUp?: string;
  error?: string;
}

export interface StreamCallbacks {
  onChunk?: (chunk: string) => void;
  onError?: (error: Error) => void;
  onComplete?: (finalContent: string) => void;
}

/**
 * 解析分析模式的 AI 响应，增强容错性并优化主内容显示
 */
function parseAnalysisResponse(response: string): ChatResponse {
  let analysisText: string | undefined;
  let suggestionText: string | undefined;
  let followUpText: string | undefined;
  let mainContent: string;

  const trimmedResponse = response.trim();

  // 尝试解析 "情境更新与分析" 或 "分析"
  const followUpAnalysisMatch = trimmedResponse.match(/\*\*情境更新与分析：\*\*\s*([\s\S]*?)(?=\*\*建议回复：\*\*|$)/);
  if (followUpAnalysisMatch && followUpAnalysisMatch[1]) {
    analysisText = followUpAnalysisMatch[1].trim();
  } else {
    const fullAnalysisMatch = trimmedResponse.match(/\*\*分析：\*\*\s*([\s\S]*?)(?=\*\*建议回复：\*\*|$)/);
    if (fullAnalysisMatch && fullAnalysisMatch[1]) {
      analysisText = fullAnalysisMatch[1].trim();
    }
  }

  // 尝试解析 "建议回复"
  const suggestionMatch = trimmedResponse.match(/\*\*建议回复：\*\*\s*"([^"]*)"|\*\*建议回复：\*\*\s*([\s\S]*?)(?=\*\*后续问题：\*\*|$)/);
  if (suggestionMatch) {
    suggestionText = (suggestionMatch[1] || suggestionMatch[2])?.trim();
  }

  // 尝试解析 "后续问题"
  const followUpMatch = trimmedResponse.match(/\*\*后续问题：\*\*\s*([\s\S]*?)$/);
  if (followUpMatch && followUpMatch[1]) {
    followUpText = followUpMatch[1].trim();
  }
  
  // 根据解析结果决定主气泡内容
  if (analysisText || suggestionText || followUpText) {
    // 如果有任何结构化内容被解析出来，主气泡可以非常简洁或为空
    mainContent = ""; // 或者 "分析详情如下：" 等，根据UI需求调整
  } else {
    // 如果没有任何结构化内容，主气泡显示AI的完整回复
    mainContent = trimmedResponse;
  }

  return {
    content: mainContent,
    analysis: analysisText,
    suggestion: suggestionText,
    followUp: followUpText,
  };
}

export async function sendChatMessage(
  message: string, // 保留但不使用，为了向后兼容
  mode: ChatMode,
  conversationHistory: Message[] = [],
  callbacks?: StreamCallbacks
): Promise<ChatResponse> {
  const controller = new AbortController();

  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        mode,
        conversationHistory: conversationHistory.slice(-10), // 只发送最近10条消息作为上下文
      }),
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error('No reader available');
    }

    const decoder = new TextDecoder('utf-8');
    let accumulatedContent = '';

    try {
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        accumulatedContent += chunk;

        callbacks?.onChunk?.(chunk);
      }

      callbacks?.onComplete?.(accumulatedContent);

      if (mode === 'analysis') {
        return parseAnalysisResponse(accumulatedContent);
      }

      return {
        content: accumulatedContent
      };

    } catch (error) {
      reader.cancel();
      throw error;
    }

  } catch (error: any) {
    console.error('Chat service error:', error);
    callbacks?.onError?.(error);
    return {
      content: '',
      error: error.message || '网络请求失败'
    };
  } finally {
    controller.abort();
  }
} 