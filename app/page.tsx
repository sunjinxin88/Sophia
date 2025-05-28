"use client";

import { useState } from "react";
import HomePage from "@/components/home-page";
import ChatPage from "@/components/chat-page";
import { ChatMode } from "@/lib/types";

export default function Home() {
  const [selectedMode, setSelectedMode] = useState<ChatMode | null>(null);
  
  return (
    <main className="min-h-screen bg-background">
      {!selectedMode ? (
        <HomePage onModeSelect={setSelectedMode} />
      ) : (
        <ChatPage mode={selectedMode} onModeChange={setSelectedMode} />
      )}
    </main>
  );
}