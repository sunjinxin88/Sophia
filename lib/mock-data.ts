import { ChatMode, TreeholeMessage } from "@/lib/types";
import { v4 as uuidv4 } from "@/lib/uuid";

export function getInitialMessages(mode: ChatMode) {
  return [
    {
      id: uuidv4(),
      role: "assistant",
      content: "This is your safe space to share thoughts and feelings. I'm here to listen without judgment or analysis. Feel free to express whatever's on your mind.",
      timestamp: Date.now(),
      supportMessage: "I'm here for you",
    } as TreeholeMessage,
  ];
}

// Sample supportive responses for tree hole mode
const supportiveResponses = [
  "I hear you. It sounds like you're going through a lot right now.",
  "Thank you for sharing that with me. Your feelings are completely valid.",
  "It takes courage to express these thoughts and feelings.",
  "I'm here to listen whenever you need someone.",
  "That sounds really challenging. I'm glad you're taking time to process these feelings.",
  "You're not alone in feeling this way, even when it seems like it.",
  "It's okay to feel whatever you're feeling right now.",
  "Sometimes just putting our thoughts into words can help us process them better.",
];

export function getMockResponse(mode: ChatMode, userMessage: string) {
  return {
    id: uuidv4(),
    role: "assistant",
    content: supportiveResponses[Math.floor(Math.random() * supportiveResponses.length)],
    timestamp: Date.now(),
  } as TreeholeMessage;
}