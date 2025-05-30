"use client";

import { ChatMode } from "@/lib/types";
import { Card } from "@/components/ui/card";
import { MessageCircle } from "lucide-react";

interface HomePageProps {
  onModeSelect: (mode: ChatMode) => void;
}

export default function HomePage({ onModeSelect }: HomePageProps) {
  return (
    <div className="container flex flex-col items-center justify-center min-h-screen px-4 py-8 mx-auto">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
          Hole Tree
        </h1>
        <p className="text-lg text-muted-foreground">
          I&apos;m here to listen and chat whenever you need a friendly ear.
        </p>
      </div>

      <div className="flex justify-center w-full max-w-md">
        <Card
          className="cursor-pointer transition-all hover:shadow-lg overflow-hidden group relative h-full w-full"
          onClick={() => onModeSelect("treehole")}
        >
          <div className="h-full p-8 flex flex-col items-center justify-center text-center">
            <div className="mb-6 p-4 bg-teal-100 rounded-full">
              <MessageCircle className="h-10 w-10 text-teal-600" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Just Want to Talk</h2>
            <p className="text-muted-foreground">
              A listening ear, a friendly chat.
            </p>
          </div>
          <div className="absolute inset-0 bg-teal-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
        </Card>
      </div>
    </div>
  );
}