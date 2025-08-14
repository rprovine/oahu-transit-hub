interface TripPlan {
  summary: string;
  routes: {
    id: string;
    name: string;
    duration: string;
    cost: string;
    steps: string[];
    tips: string[];
    weather_considerations: string[];
    cultural_notes?: string[];
  }[];
  recommendations: {
    category: string;
    items: string[];
  }[];
  local_insights: string[];
}

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export class ClaudeService {
  private apiKey: string;
  private baseUrl = 'https://api.anthropic.com/v1/messages';

  constructor() {
    this.apiKey = process.env.ANTHROPIC_API_KEY || '';
  }

  async planTrip(request: {
    origin: string;
    destination: string;
    userType: 'local' | 'tourist';
    preferences?: string[];
    timeOfDay?: string;
    weatherConditions?: any;
    budget?: 'low' | 'medium' | 'high';
  }): Promise<TripPlan> {
    try {
      const systemPrompt = this.buildSystemPrompt(request.userType);
      const userPrompt = this.buildTripPrompt(request);

      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': this.apiKey,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: 'claude-3-sonnet-20240229',
          max_tokens: 2000,
          messages: [
            {
              role: 'user',
              content: `${systemPrompt}\n\n${userPrompt}`
            }
          ]
        })
      });

      if (!response.ok) throw new Error('Claude API failed');

      const data = await response.json();
      const content = data.content[0].text;

      return this.parseTripPlan(content);
    } catch (error) {
      console.error('Claude service error:', error);
      return this.getFallbackTripPlan(request);
    }
  }

  async chatAssistant(messages: ChatMessage[], userType: 'local' | 'tourist'): Promise<string> {
    try {
      const systemPrompt = this.buildChatSystemPrompt(userType);

      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': this.apiKey,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: 'claude-3-sonnet-20240229',
          max_tokens: 1000,
          system: systemPrompt,
          messages: messages
        })
      });

      if (!response.ok) throw new Error('Claude API failed');

      const data = await response.json();
      return data.content[0].text;
    } catch (error) {
      console.error('Claude chat error:', error);
      return "Aloha! I'm having trouble connecting right now, but I'd be happy to help you with your transit questions. Please try again in a moment.";
    }
  }

  private buildSystemPrompt(userType: 'local' | 'tourist'): string {
    const basePrompt = `You are a knowledgeable Hawaiian transit assistant for Oahu. You help people navigate the island using public transportation, walking, and cycling. Always respond with aloha spirit and include relevant Hawaiian cultural context.

Current Oahu Transit Options:
- TheBus: Island-wide bus system (Routes 1-88)
- HART Rail: Currently under construction, limited service
- Biki: Bike share system in urban Honolulu
- Walking: Often combined with other modes
- Para-transit services for accessibility needs

Key Areas:
- Honolulu/Downtown: Business district, government buildings
- Waikiki: Tourist area, hotels, beaches
- Ala Moana: Shopping, transit hub
- University of Hawaii Manoa: College area
- North Shore: Surf spots, rural areas
- Windward Side: Kailua, Kaneohe
- West Side: Kapolei, Ko Olina

Always provide:
1. Multiple route options (fastest, cheapest, most scenic)
2. Real-world timing considerations (traffic, weather)
3. Cultural context and local tips
4. Safety considerations
5. Cost breakdown
6. Weather-aware recommendations`;

    if (userType === 'tourist') {
      return basePrompt + `\n\nUser is a MALIHINI (visitor to Hawaii). Focus on:
- Cultural education and respect
- Pronunciation guides for Hawaiian words
- Tourist-friendly routes and destinations
- Beach and scenic recommendations
- Shopping and dining near transit stops
- Safety tips for visitors
- Local customs and etiquette`;
    } else {
      return basePrompt + `\n\nUser is a KAMA'AINA (local resident). Focus on:
- Efficient commuting options
- Cost-saving tips and passes
- Alternative routes during events/construction
- Local shortcuts and insider knowledge
- Work/school commute optimization
- Community events and transit`;
    }
  }

  private buildChatSystemPrompt(userType: 'local' | 'tourist'): string {
    return `You are a friendly Hawaiian transit assistant. Respond conversationally with aloha spirit. Include Hawaiian words naturally with pronunciations. Help with any transit questions, local recommendations, and cultural insights about Oahu.

${userType === 'tourist' ? 'User is visiting Hawaii (malihini)' : 'User is a Hawaii resident (kama\'aina)'}.`;
  }

  private buildTripPrompt(request: any): string {
    return `Plan a transit trip on Oahu:

FROM: ${request.origin}
TO: ${request.destination}
USER TYPE: ${request.userType === 'local' ? 'Kama\'aina (Local)' : 'Malihini (Tourist)'}
TIME: ${request.timeOfDay || 'Not specified'}
BUDGET: ${request.budget || 'Not specified'}
PREFERENCES: ${request.preferences?.join(', ') || 'None specified'}
WEATHER: ${request.weatherConditions ? JSON.stringify(request.weatherConditions) : 'Not provided'}

Provide a comprehensive trip plan with multiple route options, cultural insights, and practical tips. Format as structured JSON with routes, recommendations, and local insights.`;
  }

  private parseTripPlan(content: string): TripPlan {
    try {
      // Try to extract JSON from the response
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    } catch (error) {
      console.error('Failed to parse Claude response as JSON');
    }

    // Fallback to text parsing
    return {
      summary: content.split('\n')[0] || 'Trip plan generated',
      routes: [
        {
          id: 'route-1',
          name: 'Recommended Route',
          duration: '30-45 minutes',
          cost: '$2.75',
          steps: ['Check detailed response for steps'],
          tips: ['Follow the detailed instructions provided'],
          weather_considerations: ['Check current conditions']
        }
      ],
      recommendations: [
        {
          category: 'General',
          items: ['See detailed response for recommendations']
        }
      ],
      local_insights: [content]
    };
  }

  private getFallbackTripPlan(request: any): TripPlan {
    const isLocal = request.userType === 'local';
    
    return {
      summary: `Aloha! Here's your ${isLocal ? 'kama\'aina' : 'malihini'} trip plan from ${request.origin} to ${request.destination}.`,
      routes: [
        {
          id: 'bus-route',
          name: 'TheBus Route',
          duration: '25-40 minutes',
          cost: '$2.75',
          steps: [
            'Walk to nearest bus stop (2-5 minutes)',
            'Take TheBus route (timing varies)',
            'Transfer if needed at major hub',
            'Walk from final stop to destination (2-8 minutes)'
          ],
          tips: [
            'Download the DaBus app for real-time updates',
            'Have exact change or use HOLO card',
            'Allow extra time during rush hours (7-9 AM, 4-6 PM)'
          ],
          weather_considerations: [
            'Carry umbrella during rainy season',
            'Stay hydrated in hot weather',
            'Bus stops may have limited shade'
          ],
          cultural_notes: isLocal ? undefined : [
            'Say "aloha" when boarding and "mahalo" when leaving',
            'Offer seats to kupuna (elders)',
            'Remove backpack in crowded buses'
          ]
        },
        {
          id: 'walk-bike',
          name: 'Walk + Biki Bike',
          duration: '20-35 minutes',
          cost: '$4.95 (day pass)',
          steps: [
            'Walk to nearest Biki station',
            'Rent bike using app or station kiosk',
            'Bike to destination area',
            'Return bike at destination Biki station'
          ],
          tips: [
            'Check Biki app for station availability',
            'Wear helmet (recommended but not required)',
            'Follow bike lane rules'
          ],
          weather_considerations: [
            'Avoid during heavy rain',
            'Early morning rides are cooler',
            'Trade winds provide natural cooling'
          ]
        }
      ],
      recommendations: [
        {
          category: isLocal ? 'Money-Saving Tips' : 'Cultural Experiences',
          items: isLocal ? [
            'Get monthly HOLO card for regular commuting',
            'Look into employer transit benefits',
            'Walk short distances to save money'
          ] : [
            'Visit local markets near transit stops',
            'Try plate lunch from shops near bus stops',
            'Learn basic Hawaiian phrases for respectful interaction'
          ]
        },
        {
          category: 'Safety & Comfort',
          items: [
            'Keep belongings secure and visible',
            'Stay aware of your surroundings',
            'Have backup transportation plan',
            'Carry water and sun protection'
          ]
        }
      ],
      local_insights: [
        isLocal 
          ? 'As a kama\'aina, you know the island\'s rhythm. Check for special events that might affect your usual routes.'
          : 'Welcome to Oahu! Take time to enjoy the journey - our buses often have scenic routes that tourists love.',
        'Trade winds typically blow from the northeast, making east-facing stops more comfortable.',
        'Friday afternoons and Sunday evenings tend to be busiest for both tourists and locals.'
      ]
    };
  }
}