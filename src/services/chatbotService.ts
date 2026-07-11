// Chatbot service for Groq AI integration
// API key should be stored in environment variables, never in code

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatResponse {
  content: string;
  error?: string;
}

class ChatbotService {
  private apiKey: string;
  private apiBaseUrl = 'https://api.groq.com/openai/v1/chat/completions';
  private conversationHistory: Message[] = [];
  private model = 'llama-3.3-70b-versatile';

  constructor(apiKey?: string) {
    // Get API key from environment variable or constructor
    this.apiKey = apiKey || import.meta.env.VITE_GROQ_API_KEY || '';
    if (!this.apiKey) {
      console.warn('Groq API key not configured. Set VITE_GROQ_API_KEY environment variable.');
    }
  }

  /**
   * Send a message to Groq and get a response
   */
  async sendMessage(userMessage: string): Promise<ChatResponse> {
    if (!this.apiKey) {
      return {
        content: '',
        error: 'API key not configured. Please set VITE_GROQ_API_KEY environment variable.',
      };
    }

    try {
      // Add user message to history
      this.conversationHistory.push({
        role: 'user',
        content: userMessage,
      });

      // Prepare messages for API (keep last 10 for context)
      const recentMessages = this.conversationHistory.slice(-10);

      const response = await fetch(this.apiBaseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: this.model,
          max_tokens: 1024,
          temperature: 0.7,
          messages: [
            {
              role: 'system',
              content: `You are an AI COO (Chief Operations Officer) Assistant for FlowLens, a restaurant management platform. 
              
Your role is to:
- Monitor operational metrics (revenue, orders, alerts)
- Identify critical operational issues
- Provide actionable recommendations
- Analyze kitchen, inventory, and delivery systems
- Prioritize issues by revenue impact
- Give urgent recommendations for critical problems
- Be direct, data-driven, and action-oriented

Current Operational Context:
- Daily Revenue: ₹162,000
- Active Alerts: 4 critical
- Orders Today: 216
- Monitored Stations: 4

Respond with specific, implementable actions. Focus on operational efficiency and revenue protection.`,
            },
            ...recentMessages,
          ],
        }),
      });

      if (!response.ok) {
        let errorMessage = `API error: ${response.status}`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.error?.message || errorMessage;
        } catch (e) {
          // Response wasn't JSON
          errorMessage = `API error ${response.status}: ${response.statusText}`;
        }
        
        // More helpful error messages
        if (response.status === 401) {
          errorMessage = 'Invalid API key. Please check your VITE_GROQ_API_KEY in .env.local';
        } else if (response.status === 403) {
          errorMessage = 'API key not authorized. Make sure you have a valid Groq API key.';
        }
        
        throw new Error(errorMessage);
      }

      const data = await response.json();
      const assistantMessage = data.choices[0]?.message?.content || '';

      // Add assistant response to history
      this.conversationHistory.push({
        role: 'assistant',
        content: assistantMessage,
      });

      return {
        content: assistantMessage,
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('Chatbot error:', errorMessage);
      return {
        content: '',
        error: errorMessage,
      };
    }
  }

  /**
   * Clear conversation history
   */
  clearHistory(): void {
    this.conversationHistory = [];
  }

  /**
   * Get conversation history
   */
  getHistory(): Message[] {
    return this.conversationHistory;
  }

  /**
   * Update API key (for runtime configuration)
   */
  setApiKey(key: string): void {
    this.apiKey = key;
  }
}

export default ChatbotService;
