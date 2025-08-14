interface ContactData {
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  userType?: 'local' | 'tourist';
  subscriptionTier?: 'free' | 'premium';
  source?: string;
  properties?: Record<string, any>;
}

interface DealData {
  dealName: string;
  amount?: number;
  dealStage: string;
  contactId?: string;
  properties?: Record<string, any>;
}

interface EngagementData {
  contactId: string;
  engagementType: 'EMAIL' | 'CALL' | 'MEETING' | 'NOTE' | 'TASK';
  subject: string;
  body?: string;
  properties?: Record<string, any>;
}

export class HubSpotService {
  private accessToken: string;
  private baseUrl = 'https://api.hubapi.com';

  constructor() {
    this.accessToken = process.env.HUBSPOT_ACCESS_TOKEN || '';
  }

  async createContact(contactData: ContactData): Promise<any> {
    try {
      const properties = {
        email: contactData.email,
        firstname: contactData.firstName,
        lastname: contactData.lastName,
        phone: contactData.phone,
        // Custom properties for Oahu Transit Hub
        user_type: contactData.userType,
        subscription_tier: contactData.subscriptionTier,
        source: contactData.source || 'oahu_transit_hub',
        signup_date: new Date().toISOString(),
        ...contactData.properties
      };

      const response = await fetch(`${this.baseUrl}/crm/v3/objects/contacts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.accessToken}`
        },
        body: JSON.stringify({ properties })
      });

      if (!response.ok) {
        throw new Error(`HubSpot API error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('HubSpot create contact error:', error);
      throw error;
    }
  }

  async updateContact(contactId: string, properties: Record<string, any>): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/crm/v3/objects/contacts/${contactId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.accessToken}`
        },
        body: JSON.stringify({ properties })
      });

      if (!response.ok) {
        throw new Error(`HubSpot API error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('HubSpot update contact error:', error);
      throw error;
    }
  }

  async findContactByEmail(email: string): Promise<any> {
    try {
      const response = await fetch(
        `${this.baseUrl}/crm/v3/objects/contacts/${encodeURIComponent(email)}?idProperty=email`,
        {
          headers: {
            'Authorization': `Bearer ${this.accessToken}`
          }
        }
      );

      if (response.status === 404) {
        return null; // Contact not found
      }

      if (!response.ok) {
        throw new Error(`HubSpot API error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('HubSpot find contact error:', error);
      return null;
    }
  }

  async createDeal(dealData: DealData): Promise<any> {
    try {
      const properties = {
        dealname: dealData.dealName,
        amount: dealData.amount,
        dealstage: dealData.dealStage,
        source: 'oahu_transit_hub',
        createdate: new Date().toISOString(),
        ...dealData.properties
      };

      const response = await fetch(`${this.baseUrl}/crm/v3/objects/deals`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.accessToken}`
        },
        body: JSON.stringify({ properties })
      });

      if (!response.ok) {
        throw new Error(`HubSpot API error: ${response.status}`);
      }

      const deal = await response.json();

      // Associate deal with contact if contactId provided
      if (dealData.contactId) {
        await this.associateObjects('deals', deal.id, 'contacts', dealData.contactId);
      }

      return deal;
    } catch (error) {
      console.error('HubSpot create deal error:', error);
      throw error;
    }
  }

  async trackEngagement(engagementData: EngagementData): Promise<any> {
    try {
      const properties = {
        hs_engagement_type: engagementData.engagementType,
        hs_engagement_subject: engagementData.subject,
        hs_engagement_body: engagementData.body,
        hs_engagement_source: 'API',
        hs_engagement_source_id: 'oahu_transit_hub',
        hs_timestamp: new Date().toISOString(),
        ...engagementData.properties
      };

      const response = await fetch(`${this.baseUrl}/engagements/v1/engagements`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.accessToken}`
        },
        body: JSON.stringify({
          engagement: {
            type: engagementData.engagementType
          },
          properties,
          associations: {
            contactIds: [engagementData.contactId]
          }
        })
      });

      if (!response.ok) {
        throw new Error(`HubSpot API error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('HubSpot track engagement error:', error);
      throw error;
    }
  }

  async trackEvent(eventName: string, contactEmail: string, properties?: Record<string, any>): Promise<any> {
    try {
      const eventData = {
        eventName,
        email: contactEmail,
        properties: {
          source: 'oahu_transit_hub',
          timestamp: new Date().toISOString(),
          ...properties
        }
      };

      const response = await fetch(`${this.baseUrl}/events/v3/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.accessToken}`
        },
        body: JSON.stringify(eventData)
      });

      if (!response.ok) {
        throw new Error(`HubSpot API error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('HubSpot track event error:', error);
      throw error;
    }
  }

  private async associateObjects(
    fromObjectType: string,
    fromObjectId: string,
    toObjectType: string,
    toObjectId: string
  ): Promise<any> {
    try {
      const response = await fetch(
        `${this.baseUrl}/crm/v3/objects/${fromObjectType}/${fromObjectId}/associations/${toObjectType}/${toObjectId}/contact_to_deal`,
        {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${this.accessToken}`
          }
        }
      );

      if (!response.ok) {
        throw new Error(`HubSpot association error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('HubSpot associate objects error:', error);
      throw error;
    }
  }

  // Oahu Transit Hub specific methods
  async trackTripPlan(contactEmail: string, origin: string, destination: string, routeType: string): Promise<void> {
    try {
      await this.trackEvent('trip_planned', contactEmail, {
        origin,
        destination,
        route_type: routeType,
        app_section: 'trip_planner'
      });
    } catch (error) {
      console.error('Failed to track trip plan:', error);
    }
  }

  async trackSubscription(contactEmail: string, subscriptionTier: string, amount?: number): Promise<void> {
    try {
      const contact = await this.findContactByEmail(contactEmail);
      
      if (contact) {
        // Update contact subscription tier
        await this.updateContact(contact.id, {
          subscription_tier: subscriptionTier,
          last_subscription_date: new Date().toISOString()
        });

        // Create a deal for the subscription
        await this.createDeal({
          dealName: `${subscriptionTier} Subscription - ${contactEmail}`,
          amount: amount || (subscriptionTier === 'premium' ? 4.99 : 0),
          dealStage: 'closedwon',
          contactId: contact.id,
          properties: {
            subscription_type: subscriptionTier,
            product: 'oahu_transit_hub'
          }
        });

        // Track the subscription event
        await this.trackEvent('subscription_created', contactEmail, {
          subscription_tier: subscriptionTier,
          amount: amount || 0
        });
      }
    } catch (error) {
      console.error('Failed to track subscription:', error);
    }
  }

  async trackUserActivity(contactEmail: string, activityType: string, details?: Record<string, any>): Promise<void> {
    try {
      await this.trackEvent('user_activity', contactEmail, {
        activity_type: activityType,
        ...details
      });
    } catch (error) {
      console.error('Failed to track user activity:', error);
    }
  }
}