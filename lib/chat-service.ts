import { ChatMode, Message } from '@/lib/types';

export interface ChatResponse {
  content: string;
  error?: string;
}

export interface StreamCallbacks {
  onChunk?: (chunk: string) => void;
  onError?: (error: Error) => void;
  onComplete?: (finalContent: string) => void;
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