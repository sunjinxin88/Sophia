"use client";

import { ChatMode } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { MessageCircle, Settings } from "lucide-react";

interface HeaderProps {
  mode: ChatMode;
  onModeChange: (mode: ChatMode) => void;
}

export function Header({ mode, onModeChange }: HeaderProps) {
  return (
    <header className="sticky top-0 z-10 border-b bg-white">
      <div className="container flex items-center justify-between h-16 px-4">
        <div className="flex items-center">
          <div className="text-primary mr-2">
            <MessageCircle className="h-6 w-6" />
          </div>
          <h1 className="text-xl font-semibold">easybina</h1>
        </div>

        <Button variant="ghost" size="icon">
          <Settings className="h-5 w-5" />
          <span className="sr-only">Settings</span>
        </Button>
      </div>
    </header>
  );
}