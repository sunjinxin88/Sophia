import { ChatMode, AnalysisMessage, TreeholeMessage } from "@/lib/types";
import { v4 as uuidv4 } from "@/lib/uuid";

export function getInitialMessages(mode: ChatMode) {
  if (mode === "analysis") {
    return [
      {
        id: uuidv4(),
        role: "assistant",
        content: "Hello! I'm here to help analyze conversations and suggest responses. Share your chat content or describe a situation, and I'll provide insights and recommendations.",
        timestamp: Date.now(),
      } as AnalysisMessage,
    ];
  } else {
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
}

// Sample follow-up questions for analysis mode
const followUpQuestions = [
  "What about this situation concerns you the most?",
  "How did you feel when you received this message?",
  "What's your main goal in responding to this conversation?",
  "Is there any context or history I should know about this relationship?",
  "What outcome are you hoping for from this conversation?",
  "Are there specific words or phrases that made you uncomfortable?",
  "In this situation, what do you think the other person's intentions might be?",
  "What's your biggest worry about how you might respond?",
];

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
  if (mode === "analysis") {
    return {
      id: uuidv4(),
      role: "assistant",
      content: "I understand the situation you're describing. Let me provide some analysis and a suggested response.",
      timestamp: Date.now(),
      analysis: getRandomAnalysis(userMessage),
      suggestion: getRandomSuggestion(userMessage),
      followUp: followUpQuestions[Math.floor(Math.random() * followUpQuestions.length)],
    } as AnalysisMessage;
  } else {
    return {
      id: uuidv4(),
      role: "assistant",
      content: supportiveResponses[Math.floor(Math.random() * supportiveResponses.length)],
      timestamp: Date.now(),
    } as TreeholeMessage;
  }
}

// Helper functions to generate random but contextual-looking responses
function getRandomAnalysis(message: string) {
  const analyses = [
    "It seems like there's some underlying tension in this conversation. The tone suggests the other person might be feeling frustrated or unheard.",
    "The message appears to be seeking reassurance rather than just information. There's an emotional undertone that might be worth addressing.",
    "I notice some ambiguity in the communication that could lead to misunderstandings. The other person might be expecting a more direct response.",
    "The conversation has a professional tone, but there are hints that building rapport would help move things forward more smoothly.",
    "The other person seems to be indirectly expressing concerns about timeline or quality. Addressing these proactively could help ease tension.",
  ];
  
  return analyses[Math.floor(Math.random() * analyses.length)];
}

function getRandomSuggestion(message: string) {
  const suggestions = [
    "I understand your concerns, and I appreciate you bringing this to my attention. Let's discuss how we can address this together.",
    "Thank you for sharing this with me. I value your perspective and would like to work through this situation together.",
    "I see where you're coming from, and I want to make sure we're on the same page. Could we schedule some time to discuss this further?",
    "I appreciate your feedback. I'd like to understand more about your expectations so we can find a solution that works for both of us.",
    "Thank you for bringing this up. I hadn't considered that perspective, and I'd like to learn more about your thoughts on this.",
  ];
  
  return suggestions[Math.floor(Math.random() * suggestions.length)];
}