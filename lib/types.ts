/**
 * 聊天模式
 */
export type ChatMode = 'analysis' | 'treehole';

/**
 * 聊天消息
 */
export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

/**
 * 聊天响应
 */
export interface ChatResponse {
  content: string;
  analysis?: string;
  suggestion?: string;
  followUp?: string;
}

/**
 * API 错误响应
 */
export interface ApiError {
  error: string;
  status?: number;
}

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: number;
}

export interface AnalysisMessage extends Message {
  analysis?: string;
  suggestion?: string;
  followUp?: string;
}

export interface TreeholeMessage extends Message {
  supportMessage?: string;
}

export type ModeMessages = {
  analysis: AnalysisMessage[];
  treehole: TreeholeMessage[];
};