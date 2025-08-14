import { NextRequest, NextResponse } from 'next/server';
import { ClaudeService } from '@/lib/services/claude';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, ...params } = body;

    const claudeService = new ClaudeService();

    switch (action) {
      case 'plan_trip':
        const { origin, destination, userType, preferences, timeOfDay, weatherConditions, budget } = params;
        
        if (!origin || !destination || !userType) {
          return NextResponse.json(
            { success: false, error: 'Origin, destination, and userType are required' },
            { status: 400 }
          );
        }

        const tripPlan = await claudeService.planTrip({
          origin,
          destination,
          userType,
          preferences,
          timeOfDay,
          weatherConditions,
          budget
        });

        return NextResponse.json({
          success: true,
          tripPlan
        });

      case 'chat':
        const { messages, userType: chatUserType } = params;
        
        if (!messages || !Array.isArray(messages)) {
          return NextResponse.json(
            { success: false, error: 'Messages array is required' },
            { status: 400 }
          );
        }

        const response = await claudeService.chatAssistant(messages, chatUserType || 'tourist');

        return NextResponse.json({
          success: true,
          response
        });

      default:
        return NextResponse.json(
          { success: false, error: 'Invalid action' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('AI API error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process AI request' },
      { status: 500 }
    );
  }
}