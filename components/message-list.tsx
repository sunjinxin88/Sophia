"use client";

import { useEffect, useState } from "react";
import { ChatMode, Message, AnalysisMessage } from "@/lib/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Copy, Check } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

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
    if (message.role === "assistant" && (message.analysis || message.suggestion)) {
      return (
        <div className="mt-3 space-y-3">
          {message.analysis && (
            <div className="p-3 bg-blue-50 rounded-md border border-blue-100">
              <p className="text-sm text-blue-700">{message.analysis}</p>
            </div>
          )}
          
          {message.suggestion && (
            <div className="p-3 bg-blue-100 rounded-md border border-blue-200 relative">
              <p className="text-sm font-medium text-blue-800 mb-1">Suggestion:</p>
              <p className="text-sm text-blue-900">"{message.suggestion}"</p>
              <div className="absolute top-2 right-2">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 text-blue-700 hover:text-blue-900 hover:bg-blue-200"
                  onClick={() => copyToClipboard(message.suggestion, message.id)}
                >
                  {copiedId === message.id ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                  <span className="sr-only">Copy suggestion</span>
                </Button>
              </div>
            </div>
          )}
          
          {message.followUp && (
            <div className="p-3 bg-amber-50 rounded-md border border-amber-100">
              <p className="text-sm text-amber-700">{message.followUp}</p>
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
          <h2 className="text-xl font-semibold text-teal-900 mb-2">Tree Hole</h2>
          <p className="text-teal-700">
            Share your thoughts and feelings in a safe space. Our AI will listen and offer support without providing advice or analysis.
          </p>
        </div>
      )}
      
      {mode === "analysis" && messages.length === 1 && (
        <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
          <h2 className="text-xl font-semibold text-blue-900 mb-2">Analysis & Suggestions</h2>
          <p className="text-blue-700">
            Share your conversation or situation, and I'll help analyze the context and suggest appropriate responses.
          </p>
        </div>
      )}
      
      {messages.map((message) => (
        <div 
          key={message.id} 
          className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
        >
          <div className={`flex ${message.role === "user" ? "flex-row-reverse" : "flex-row"} max-w-[80%] gap-3`}>
            {message.role === "assistant" ? (
              <Avatar className="h-8 w-8 mt-1">
                <AvatarFallback className="bg-primary text-primary-foreground">AI</AvatarFallback>
              </Avatar>
            ) : (
              <Avatar className="h-8 w-8 mt-1">
                <AvatarImage src="https://i.pravatar.cc/300" alt="User" />
                <AvatarFallback>ME</AvatarFallback>
              </Avatar>
            )}
            
            <div className={`space-y-1 ${message.role === "user" ? "items-end" : "items-start"}`}>
              <div className={`px-4 py-3 rounded-lg ${
                message.role === "user" 
                  ? "bg-primary text-primary-foreground" 
                  : "bg-card border shadow-sm"
              }`}>
                <p>{message.content}</p>
              </div>
              
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