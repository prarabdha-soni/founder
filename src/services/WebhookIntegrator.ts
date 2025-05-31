import { Pool } from 'pg';
import axios from 'axios';

interface TenantContext {
  tenantId: string;
  userId: string;
}

export class WebhookIntegrator {
  private db: Pool;
  private context: TenantContext;

  constructor(context: TenantContext) {
    this.context = context;
    this.db = new Pool({ connectionString: process.env.DATABASE_URL });
  }

  async syncExternalData({ source, authToken, syncDays }) {
    switch (source) {
      case 'whatsapp':
        return this.syncWhatsApp(authToken, syncDays);
      case 'gmail':
        return this.syncGmail(authToken, syncDays);
      case 'hubspot':
        return this.syncHubSpot(authToken, syncDays);
      default:
        throw new Error(`Unsupported source: ${source}`);
    }
  }

  private async syncWhatsApp(authToken: string, days: number) {
    // WhatsApp Business API integration
    const conversations = await this.fetchWhatsAppMessages(authToken, days);
    
    let imported = 0;
    let updated = 0;
    let errors = 0;

    for (const conversation of conversations) {
      try {
        const exists = await this.checkExistingConversation(conversation.externalId);
        
        if (exists) {
          await this.updateConversation(conversation);
          updated++;
        } else {
          await this.importConversation(conversation, 'whatsapp');
          imported++;
        }
      } catch (error) {
        console.error('Sync error:', error);
        errors++;
      }
    }

    return { imported, updated, errors };
  }

  private async fetchWhatsAppMessages(authToken: string, days: number) {
    // Implementation for WhatsApp Business API
    const response = await axios.get('https://graph.facebook.com/v17.0/messages', {
      headers: { Authorization: `Bearer ${authToken}` },
      params: {
        since: new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString()
      }
    });

    return response.data.data.map(msg => ({
      externalId: msg.id,
      participant: msg.from,
      content: msg.text?.body || '',
      timestamp: msg.timestamp,
      metadata: msg
    }));
  }

  private async syncGmail(authToken: string, days: number) {
    // Gmail API integration
    const emails = await this.fetchGmailMessages(authToken, days);
    
    // Process emails similar to WhatsApp
    return this.processMessages(emails, 'email');
  }

  private async syncHubSpot(authToken: string, days: number) {
    // HubSpot API integration
    const activities = await this.fetchHubSpotActivities(authToken, days);
    
    return this.processMessages(activities, 'hubspot');
  }

  private async checkExistingConversation(externalId: string) {
    const result = await this.db.query(
      'SELECT id FROM conversations WHERE external_id = $1 AND tenant_id = $2',
      [externalId, this.context.tenantId]
    );
    return result.rows.length > 0;
  }

  private async importConversation(conversation: any, source: string) {
    await this.db.query(`
      INSERT INTO conversations 
      (id, tenant_id, user_id, participant_name, content, conversation_type, external_id, created_at)
      VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $6, $7)
    `, [
      this.context.tenantId,
      this.context.userId,
      conversation.participant,
      conversation.content,
      source,
      conversation.externalId,
      conversation.timestamp
    ]);
  }

  private async processMessages(messages: any[], source: string) {
    // Generic message processing logic
    let imported = 0;
    let updated = 0;
    let errors = 0;

    for (const message of messages) {
      try {
        const exists = await this.checkExistingConversation(message.externalId);
        
        if (!exists) {
          await this.importConversation(message, source);
          imported++;
        }
      } catch (error) {
        errors++;
      }
    }

    return { imported, updated, errors };
  }

  // Additional methods for other integrations...
  private async fetchGmailMessages(authToken: string, days: number) {
    // Gmail API implementation
    return [];
  }

  private async fetchHubSpotActivities(authToken: string, days: number) {
    // HubSpot API implementation
    return [];
  }
} 