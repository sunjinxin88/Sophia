"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { SendIcon } from "lucide-react";

interface MessageInputProps {
  onSendMessage: (message: string) => void;
  isDisabled?: boolean;
}

export function MessageInput({ onSendMessage, isDisabled = false }: MessageInputProps) {
  const [message, setMessage] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        200
      )}px`;
    }
  }, [message]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !isDisabled) {
      onSendMessage(message);
      setMessage("");
      
      // Reset height
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-end gap-2">
      <Textarea
        ref={textareaRef}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type your message..."
        className="min-h-[52px] max-h-[200px] resize-none py-3 focus-visible:ring-1"
        disabled={isDisabled}
      />
      <Button 
        type="submit" 
        size="icon" 
        className="h-[52px] w-[52px] shrink-0 rounded-full"
        disabled={!message.trim() || isDisabled}
      >
        <SendIcon className="h-5 w-5" />
        <span className="sr-only">Send message</span>
      </Button>
    </form>
  );
}