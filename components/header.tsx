"use client";

import { ChatMode } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart2, Leaf, Settings } from "lucide-react";

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
            {mode === "analysis" ? (
              <BarChart2 className="h-6 w-6" />
            ) : (
              <Leaf className="h-6 w-6" />
            )}
          </div>
          <h1 className="text-xl font-semibold">Sophia</h1>
        </div>

        <div className="hidden md:block">
          <Tabs value={mode} onValueChange={(value) => onModeChange(value as ChatMode)}>
            <TabsList>
              <TabsTrigger value="analysis" className="flex items-center gap-1">
                <BarChart2 className="h-4 w-4" />
                <span>Analysis & Suggestions</span>
              </TabsTrigger>
              <TabsTrigger value="treehole" className="flex items-center gap-1">
                <Leaf className="h-4 w-4" />
                <span>Tree Hole</span>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <Button variant="ghost" size="icon">
          <Settings className="h-5 w-5" />
          <span className="sr-only">Settings</span>
        </Button>
      </div>
    </header>
  );
}