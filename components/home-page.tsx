"use client";

import { ChatMode } from "@/lib/types";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart2, Leaf } from "lucide-react";
import { motion } from "@/lib/motion";

interface HomePageProps {
  onModeSelect: (mode: ChatMode) => void;
}

export default function HomePage({ onModeSelect }: HomePageProps) {
  return (
    <div className="container flex flex-col items-center justify-center min-h-screen px-4 py-8 mx-auto">
      {motion.div({
        initial: { opacity: 0, y: -20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.5 },
        className: "text-center mb-16",
        children: (
          <div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
              How can I help you today?
            </h1>
            <p className="text-lg text-muted-foreground">
              Choose a mode to start our conversation.
            </p>
          </div>
        ),
      })}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl">
        {motion.div({
          initial: { opacity: 0, x: -20 },
          animate: { opacity: 1, x: 0 },
          transition: { duration: 0.5, delay: 0.1 },
          children: (
            <Card
              className="cursor-pointer transition-all hover:shadow-lg overflow-hidden group relative h-full"
              onClick={() => onModeSelect("analysis")}
            >
              <div className="h-full p-8 flex flex-col items-center justify-center text-center">
                <div className="mb-6 p-4 bg-blue-100 rounded-full">
                  <BarChart2 className="h-10 w-10 text-blue-600" />
                </div>
                <h2 className="text-2xl font-bold mb-2">Analysis & Suggestions</h2>
                <p className="text-muted-foreground">
                  Get insights and tailored advice.
                </p>
              </div>
              <div className="absolute inset-0 bg-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            </Card>
          ),
        })}

        {motion.div({
          initial: { opacity: 0, x: 20 },
          animate: { opacity: 1, x: 0 },
          transition: { duration: 0.5, delay: 0.2 },
          children: (
            <Card
              className="cursor-pointer transition-all hover:shadow-lg overflow-hidden group relative h-full"
              onClick={() => onModeSelect("treehole")}
            >
              <div className="h-full p-8 flex flex-col items-center justify-center text-center">
                <div className="mb-6 p-4 bg-teal-100 rounded-full">
                  <Leaf className="h-10 w-10 text-teal-600" />
                </div>
                <h2 className="text-2xl font-bold mb-2">Just Want to Talk</h2>
                <p className="text-muted-foreground">
                  A listening ear, a friendly chat.
                </p>
              </div>
              <div className="absolute inset-0 bg-teal-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            </Card>
          ),
        })}
      </div>
    </div>
  );
}