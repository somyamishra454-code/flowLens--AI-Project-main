/**
 * Advanced Chatbot Integration Examples
 * 
 * This file contains optional enhancements you can use to integrate
 * real restaurant data with the chatbot.
 */

import ChatbotService from './chatbotService';

/**
 * Enhanced chatbot that includes restaurant context
 * Useful for providing Claude with real business data
 */
export class ContextualChatbot extends ChatbotService {
  private restaurantContext: string = '';

  /**
   * Set business context that will be included with each request
   * This helps Claude provide more relevant insights
   */
  setRestaurantContext(context: {
    restaurantName?: string;
    cuisine?: string;
    location?: string;
    avgOrderValue?: number;
    dailyRevenue?: number;
    topDishes?: string[];
    staffCount?: number;
    operatingHours?: string;
  }): void {
    const parts = [];
    if (context.restaurantName) parts.push(`Restaurant: ${context.restaurantName}`);
    if (context.cuisine) parts.push(`Cuisine: ${context.cuisine}`);
    if (context.location) parts.push(`Location: ${context.location}`);
    if (context.avgOrderValue) parts.push(`Average Order Value: ₹${context.avgOrderValue}`);
    if (context.dailyRevenue) parts.push(`Daily Revenue: ₹${context.dailyRevenue}`);
    if (context.topDishes) parts.push(`Top Dishes: ${context.topDishes.join(', ')}`);
    if (context.staffCount) parts.push(`Staff Count: ${context.staffCount}`);
    if (context.operatingHours) parts.push(`Operating Hours: ${context.operatingHours}`);

    this.restaurantContext = parts.join('\n');
  }

  /**
   * Get restaurant context
   */
  getRestaurantContext(): string {
    return this.restaurantContext;
  }
}

/**
 * Analytics helper - extract insights from chat responses
 */
export function extractInsights(response: string): {
  actionItems: string[];
  metrics: Record<string, string>;
  recommendations: string[];
} {
  // Simple extraction - you can make this more sophisticated
  const actionItems: string[] = [];
  const metrics: Record<string, string> = {};
  const recommendations: string[] = [];

  // Look for action items (lines with • or -)
  const actionPattern = /^[•\-]\s+(.+)$/gm;
  let match;
  while ((match = actionPattern.exec(response)) !== null) {
    actionItems.push(match[1]);
  }

  // Look for metrics (₹ symbol or percentage)
  const metricPattern = /(₹[\d,]+%?|\d+\.?\d*%)/g;
  while ((match = metricPattern.exec(response)) !== null) {
    metrics[`metric_${Object.keys(metrics).length}`] = match[1];
  }

  // Look for recommendations (sentences with "consider", "suggest", "recommend")
  const recPattern = /([^.!?]*(?:consider|suggest|recommend)[^.!?]*[.!?])/gi;
  while ((match = recPattern.exec(response)) !== null) {
    recommendations.push(match[1].trim());
  }

  return { actionItems, metrics, recommendations };
}

/**
 * Response formatter - make Claude's responses more readable
 */
export function formatResponse(response: string): {
  summary: string;
  sections: Array<{ title: string; content: string }>;
} {
  const lines = response.split('\n');
  const summary = lines[0] || '';
  const sections: Array<{ title: string; content: string }> = [];

  let currentSection = '';
  let currentContent = '';

  for (const line of lines.slice(1)) {
    // Check if line is a section header (ends with :)
    if (line.endsWith(':') && line.length < 100) {
      if (currentSection) {
        sections.push({
          title: currentSection,
          content: currentContent.trim(),
        });
      }
      currentSection = line.slice(0, -1); // Remove trailing :
      currentContent = '';
    } else if (line.trim()) {
      currentContent += line + '\n';
    }
  }

  if (currentSection) {
    sections.push({
      title: currentSection,
      content: currentContent.trim(),
    });
  }

  return { summary, sections };
}

/**
 * Custom hooks for chat events
 */
export type ChatEventListener = (event: {
  type: 'message_sent' | 'response_received' | 'error_occurred';
  data: any;
}) => void;

export class ChatbotWithEvents extends ChatbotService {
  private listeners: ChatEventListener[] = [];

  subscribe(listener: ChatEventListener): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private emit(type: string, data: any): void {
    this.listeners.forEach((l) => l({ type: type as any, data }));
  }

  async sendMessage(userMessage: string) {
    this.emit('message_sent', { message: userMessage });
    const response = await super.sendMessage(userMessage);
    if (response.error) {
      this.emit('error_occurred', { error: response.error });
    } else {
      this.emit('response_received', { response: response.content });
    }
    return response;
  }
}

/**
 * Rate limiting helper - prevent API spam
 */
export class RateLimitedChatbot extends ChatbotService {
  private lastMessageTime = 0;
  private minIntervalMs = 1000; // Minimum 1 second between messages

  setMinInterval(ms: number): void {
    this.minIntervalMs = ms;
  }

  async sendMessage(userMessage: string) {
    const now = Date.now();
    const timeSinceLastMessage = now - this.lastMessageTime;

    if (timeSinceLastMessage < this.minIntervalMs) {
      const waitTime = this.minIntervalMs - timeSinceLastMessage;
      await new Promise((resolve) => setTimeout(resolve, waitTime));
    }

    this.lastMessageTime = Date.now();
    return super.sendMessage(userMessage);
  }
}

/**
 * Example usage in a React component:
 *
 * ```tsx
 * import { ContextualChatbot, extractInsights } from '@/services/chatbotAdvanced';
 *
 * export function AdvancedChatBot() {
 *   const chatbot = useRef<ContextualChatbot | null>(null);
 *
 *   useEffect(() => {
 *     chatbot.current = new ContextualChatbot(apiKey);
 *     chatbot.current.setRestaurantContext({
 *       restaurantName: 'My Restaurant',
 *       cuisine: 'Indian',
 *       location: 'Downtown',
 *       dailyRevenue: 48760,
 *       topDishes: ['Paneer Butter Masala', 'Chicken Biryani'],
 *     });
 *   }, [apiKey]);
 *
 *   const handleMessage = async (msg: string) => {
 *     const response = await chatbot.current?.sendMessage(msg);
 *     if (response?.content) {
 *       const insights = extractInsights(response.content);
 *       console.log('Recommendations:', insights.recommendations);
 *     }
 *   };
 *
 *   return // ... your component
 * }
 * ```
 */
