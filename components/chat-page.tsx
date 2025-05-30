"use client";

import { useState, useEffect, useRef } from "react";
import { ChatMode, ModeMessages } from "@/lib/types";
import { MessageList } from "@/components/message-list";
import { MessageInput } from "@/components/message-input";
import { Header } from "@/components/header";
import { getInitialMessages } from "@/lib/mock-data";
import { sendChatMessage } from "@/lib/chat-service";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { v4 as uuidv4 } from "@/lib/uuid";

interface ChatPageProps {
  mode: ChatMode;
  onModeChange: (mode: ChatMode) => void;
}

export default function ChatPage({ mode, onModeChange }: ChatPageProps) {
  const [messages, setMessages] = useLocalStorage<ModeMessages>("chat-messages", {
    treehole: [],
  });
  
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messages[mode].length === 0) {
      // Initialize with welcome message if empty
      setMessages({
        ...messages,
        [mode]: getInitialMessages(mode),
      });
    }
  }, [mode, messages, setMessages]);

  useEffect(() => {
    // Scroll to bottom on new messages
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (content: string) => {
    if (!content.trim() || isTyping) return;

    setError(null);

    // Add user message
    const userMessage = {
      id: uuidv4(),
      role: "user" as const,
      content,
      timestamp: Date.now(),
    };

    const updatedMessages = {
      ...messages,
      [mode]: [...messages[mode], userMessage],
    };

    setMessages(updatedMessages);
    setIsTyping(true);

    try {
      // Call real API - 传递包含新用户消息的完整历史
      const apiResponse = await sendChatMessage('', mode, updatedMessages[mode]);
      
      const aiMessage = {
        id: uuidv4(),
        role: "assistant" as const,
        content: apiResponse.content,
        timestamp: Date.now(),
      };

      setMessages({
        ...updatedMessages,
        [mode]: [...updatedMessages[mode], aiMessage],
      });
      
    } catch (error) {
      console.error('Chat error:', error);
      setError(error instanceof Error ? error.message : '发送消息失败，请重试');
      
      // Remove the user message if API call failed
      setMessages(messages);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <Header mode={mode} onModeChange={onModeChange} />
      
      <div className="flex-1 overflow-hidden flex flex-col bg-gray-50">
        <div className="flex-1 overflow-y-auto p-4">
          <div className="max-w-3xl mx-auto">
            <MessageList 
              messages={messages[mode]} 
              mode={mode} 
            />
            {isTyping && (
              <div className="flex items-center space-x-2 p-3 bg-white rounded-lg shadow-sm mt-3 max-w-xs">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
                <span className="text-sm text-gray-500">easybina 正在思考...</span>
              </div>
            )}
            {error && (
              <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}
            <div ref={bottomRef} />
          </div>
        </div>
        
        <div className="border-t bg-white p-3">
          <div className="max-w-3xl mx-auto">
            <MessageInput onSendMessage={handleSendMessage} isDisabled={isTyping} />
          </div>
        </div>
      </div>
    </div>
  );
}