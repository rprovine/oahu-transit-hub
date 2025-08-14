import { NextRequest, NextResponse } from 'next/server';
import { HubSpotService } from '@/lib/services/hubspot';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, ...params } = body;

    const hubspotService = new HubSpotService();

    switch (action) {
      case 'create_contact':
        const { email, firstName, lastName, phone, userType, subscriptionTier, source } = params;
        
        if (!email) {
          return NextResponse.json(
            { success: false, error: 'Email is required' },
            { status: 400 }
          );
        }

        // Check if contact exists first
        let contact = await hubspotService.findContactByEmail(email);
        
        if (!contact) {
          contact = await hubspotService.createContact({
            email,
            firstName,
            lastName,
            phone,
            userType,
            subscriptionTier,
            source
          });
        } else {
          // Update existing contact
          contact = await hubspotService.updateContact(contact.id, {
            firstname: firstName,
            lastname: lastName,
            phone,
            user_type: userType,
            subscription_tier: subscriptionTier,
            last_login: new Date().toISOString()
          });
        }

        return NextResponse.json({
          success: true,
          contact
        });

      case 'track_trip_plan':
        const { contactEmail, origin, destination, routeType } = params;
        
        if (!contactEmail || !origin || !destination) {
          return NextResponse.json(
            { success: false, error: 'Contact email, origin, and destination are required' },
            { status: 400 }
          );
        }

        await hubspotService.trackTripPlan(contactEmail, origin, destination, routeType);

        return NextResponse.json({
          success: true,
          message: 'Trip plan tracked successfully'
        });

      case 'track_subscription':
        const { contactEmail: subEmail, subscriptionTier: subTier, amount } = params;
        
        if (!subEmail || !subTier) {
          return NextResponse.json(
            { success: false, error: 'Contact email and subscription tier are required' },
            { status: 400 }
          );
        }

        await hubspotService.trackSubscription(subEmail, subTier, amount);

        return NextResponse.json({
          success: true,
          message: 'Subscription tracked successfully'
        });

      case 'track_activity':
        const { contactEmail: actEmail, activityType, details } = params;
        
        if (!actEmail || !activityType) {
          return NextResponse.json(
            { success: false, error: 'Contact email and activity type are required' },
            { status: 400 }
          );
        }

        await hubspotService.trackUserActivity(actEmail, activityType, details);

        return NextResponse.json({
          success: true,
          message: 'Activity tracked successfully'
        });

      default:
        return NextResponse.json(
          { success: false, error: 'Invalid action' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('CRM API error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process CRM request' },
      { status: 500 }
    );
  }
}