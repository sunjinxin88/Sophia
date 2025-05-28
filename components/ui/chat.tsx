'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from './button';
import { Textarea } from './textarea';
import { ChatMode } from '@/lib/types';
import { cn } from '@/lib/utils';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatProps {
  mode: ChatMode;
  className?: string;
}

export function Chat({ mode, className }: ChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [streamingContent, setStreamingContent] = useState('');
  const abortControllerRef = useRef<AbortController | null>(null);

  // 在组件卸载时取消请求
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    // 取消之前的请求（如果有）
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const userMessage = { role: 'user' as const, content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setStreamingContent('');

    // 创建新的 AbortController
    abortControllerRef.current = new AbortController();

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: input,
          mode,
          conversationHistory: messages,
        }),
        signal: abortControllerRef.current.signal,
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const reader = res.body?.getReader();
      if (!reader) {
        throw new Error('No reader available');
      }

      const decoder = new TextDecoder();
      let accumulatedContent = '';

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        const text = decoder.decode(value, { stream: true });
        accumulatedContent += text;
        setStreamingContent(accumulatedContent);
      }

      // 流式输出完成后，添加助手消息
      const assistantMessage = {
        role: 'assistant' as const,
        content: accumulatedContent,
      };
      setMessages(prev => [...prev, assistantMessage]);
      setStreamingContent('');

    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        console.log('Request was cancelled');
      } else {
        console.error('Error:', error);
        setMessages(prev => [
          ...prev,
          {
            role: 'assistant',
            content: '抱歉，发生了错误。请稍后重试。',
          },
        ]);
      }
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  };

  return (
    <div className={cn('flex flex-col space-y-4', className)}>
      <div className="flex-1 space-y-4 overflow-y-auto">
        {messages.map((message, i) => (
          <div
            key={i}
            className={cn(
              'flex w-full items-start gap-4 rounded-lg p-4',
              message.role === 'user'
                ? 'bg-muted/50'
                : 'bg-primary/5'
            )}
          >
            <div className="flex-1 space-y-2 overflow-hidden">
              <div className="prose break-words dark:prose-invert prose-p:leading-relaxed prose-pre:p-0">
                {message.content}
              </div>
            </div>
          </div>
        ))}
        
        {/* 显示正在流式输出的内容 */}
        {streamingContent && (
          <div className={cn(
            'flex w-full items-start gap-4 rounded-lg p-4',
            'bg-primary/5'
          )}>
            <div className="flex-1 space-y-2 overflow-hidden">
              <div className="prose break-words dark:prose-invert prose-p:leading-relaxed prose-pre:p-0">
                {streamingContent}
              </div>
            </div>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="flex items-center space-x-2">
        <Textarea
          placeholder="输入消息..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSubmit(e);
            }
          }}
          className="min-h-[60px] w-full resize-none"
        />
        <Button 
          type="submit" 
          disabled={isLoading || !input.trim()}
          className="px-8"
        >
          {isLoading ? '发送中...' : '发送'}
        </Button>
      </form>
    </div>
  );
} 