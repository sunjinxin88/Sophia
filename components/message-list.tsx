"use client";

import { useEffect, useState } from "react";
import { ChatMode, Message, AnalysisMessage } from "@/lib/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Copy, Check } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import ReactMarkdown from "react-markdown";

interface MessageListProps {
  messages: Message[];
  mode: ChatMode;
}

export function MessageList({ messages, mode }: MessageListProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  
  useEffect(() => {
    if (copiedId) {
      const timer = setTimeout(() => {
        setCopiedId(null);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [copiedId]);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
  };

  const renderAnalysisMessage = (message: AnalysisMessage) => {
    if (message.role === "assistant" && (message.analysis || message.suggestion || message.followUp)) {
      return (
        <div className="mt-4 space-y-4 w-full">
          {message.analysis && (
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="text-sm text-blue-800 leading-relaxed prose prose-sm max-w-none prose-headings:text-blue-900 prose-strong:text-blue-900 prose-p:text-blue-800 prose-ul:text-blue-800 prose-ol:text-blue-800">
                <ReactMarkdown>
                  {message.analysis}
                </ReactMarkdown>
              </div>
            </div>
          )}
          
          {message.suggestion && (
            <div className="p-4 bg-blue-100 rounded-lg border border-blue-200 relative">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-blue-900 mb-2">建议回复:</p>
                  <div className="text-sm text-blue-800 leading-relaxed prose prose-sm max-w-none prose-headings:text-blue-900 prose-strong:text-blue-900 prose-p:text-blue-800">
                    <ReactMarkdown>
                      {`"${message.suggestion}"`}
                    </ReactMarkdown>
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 text-blue-700 hover:text-blue-900 hover:bg-blue-200 ml-2 flex-shrink-0"
                  onClick={() => copyToClipboard(message.suggestion || "", message.id)}
                >
                  {copiedId === message.id ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                  <span className="sr-only">复制建议</span>
                </Button>
              </div>
            </div>
          )}
          
          {message.followUp && (
            <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
              <div className="text-sm text-orange-800 leading-relaxed prose prose-sm max-w-none prose-headings:text-orange-900 prose-strong:text-orange-900 prose-p:text-orange-800 prose-ul:text-orange-800 prose-ol:text-orange-800">
                <ReactMarkdown>
                  {message.followUp}
                </ReactMarkdown>
              </div>
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6 py-4">
      {mode === "treehole" && messages.length === 1 && (
        <div className="mb-6 p-4 bg-teal-50 rounded-lg border border-teal-100">
          <h2 className="text-xl font-semibold text-teal-900 mb-2">树洞模式</h2>
          <p className="text-teal-700">
            在这个安全的空间里分享你的想法和感受。我会倾听并提供支持，不会进行分析或给出建议。
          </p>
        </div>
      )}
      
      {mode === "analysis" && messages.length === 1 && (
        <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
          <h2 className="text-xl font-semibold text-blue-900 mb-2">分析与建议模式</h2>
          <p className="text-blue-700">
            分享你的对话或情况，我会帮助分析背景并建议合适的回复方式。
          </p>
        </div>
      )}
      
      {messages.map((message) => (
        <div 
          key={message.id} 
          className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
        >
          <div className={`flex ${message.role === "user" ? "flex-row-reverse" : "flex-row"} ${
            message.role === "user" ? "max-w-[80%]" : "w-full max-w-none"
          } gap-3`}>
            {message.role === "assistant" ? (
              <Avatar className="h-8 w-8 mt-1 flex-shrink-0">
                <AvatarFallback className="bg-primary text-primary-foreground">AI</AvatarFallback>
              </Avatar>
            ) : (
              <Avatar className="h-8 w-8 mt-1 flex-shrink-0">
                <AvatarImage src="https://i.pravatar.cc/300" alt="User" />
                <AvatarFallback>我</AvatarFallback>
              </Avatar>
            )}
            
            <div className={`space-y-1 ${message.role === "user" ? "items-end" : "items-start"} ${
              message.role === "user" ? "max-w-full" : "flex-1"
            }`}>
              {message.role === "user" || (message.role === "assistant" && !((message as AnalysisMessage).analysis || (message as AnalysisMessage).suggestion || (message as AnalysisMessage).followUp)) ? (
                <div className={`px-4 py-3 rounded-lg ${
                  message.role === "user" 
                    ? "bg-primary text-primary-foreground max-w-full" 
                    : "bg-card border shadow-sm"
                }`}>
                  {message.role === "assistant" && message.content ? (
                    <div className="leading-relaxed prose prose-sm max-w-none prose-headings:text-foreground prose-strong:text-foreground prose-p:text-foreground prose-ul:text-foreground prose-ol:text-foreground prose-blockquote:text-muted-foreground prose-code:text-foreground prose-pre:bg-muted">
                      <ReactMarkdown
                        components={{
                          h1: ({ children }) => <h1 className="text-lg font-bold mb-2">{children}</h1>,
                          h2: ({ children }) => <h2 className="text-base font-bold mb-2">{children}</h2>,
                          h3: ({ children }) => <h3 className="text-sm font-bold mb-1">{children}</h3>,
                          p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                          ul: ({ children }) => <ul className="list-disc list-inside mb-2 space-y-1">{children}</ul>,
                          ol: ({ children }) => <ol className="list-decimal list-inside mb-2 space-y-1">{children}</ol>,
                          li: ({ children }) => <li className="ml-2">{children}</li>,
                          strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
                          blockquote: ({ children }) => <blockquote className="border-l-4 border-gray-300 pl-4 italic text-muted-foreground">{children}</blockquote>,
                          code: ({ children }) => <code className="bg-muted px-1 py-0.5 rounded text-sm font-mono">{children}</code>,
                          pre: ({ children }) => <pre className="bg-muted p-3 rounded-lg overflow-x-auto text-sm">{children}</pre>,
                        }}
                      >
                        {message.content}
                      </ReactMarkdown>
                    </div>
                  ) : message.role === "user" ? (
                    <p className="leading-relaxed">{message.content}</p>
                  ) : null}
                </div>
              ) : null}
              
              {mode === "analysis" && renderAnalysisMessage(message as AnalysisMessage)}
              
              <p className="text-xs text-muted-foreground px-2">
                {formatDistanceToNow(new Date(message.timestamp), { addSuffix: true })}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}