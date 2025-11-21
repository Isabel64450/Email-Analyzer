import axios from 'axios';
import { MessageProvider } from '@ports/EmailAuthAnalyzerPort';
import { EmailMessage} from '@domainModels/emailAnalyzer/AnalyzedEmail';
import { EmailHeader } from '../../../domain/models/emailAnalyzer/EmailHeader';
import { EmailBody } from '../../../domain/models/emailAnalyzer/EmailBody';
import { EmailMetadata } from '../../../domain/models/emailAnalyzer/EmailMetadata';
import { EmailAttachment } from '@domainModels/emailAnalyzer/EmailAttachement';
import { getAccessToken } from '../../../infrastructure/microsoftGraph/authentication/authGraphToken';

export class GraphApiMessageProvider implements MessageProvider {
  async getMessageById(userId: string, messageId: string): Promise<EmailMessage> {
    const accessToken = await getAccessToken();

    const url = `https://graph.microsoft.com/v1.0/users/${encodeURIComponent(userId)}/messages/${encodeURIComponent(messageId)}?$select=internetMessageHeaders,from,toRecipients,receivedDateTime,sentDateTime,subject,body,conversationId,webLink&$expand=attachments`;

    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });
    
    return this.mapToEmailMessage(response.data);
  }

  async getMessagesByConversationId(userId: string, conversationId: string, excludeMessageId: string): Promise<EmailMessage[]> {
    const accessToken = await getAccessToken();

    const url = `https://graph.microsoft.com/v1.0/users/${encodeURIComponent(userId)}/messages?$filter=conversationId eq '${conversationId}'&$select=internetMessageHeaders,from,toRecipients,receivedDateTime,sentDateTime,subject,body,id,conversationId,webLink&$expand=attachments`;

    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });
   
    const messages = response.data.value as any[];

    // Exclure le message déjà analysé
    const filtered = messages.filter(msg => msg.id !== excludeMessageId);

    return filtered.map(this.mapToEmailMessage);
  }

  private mapToEmailMessage(message: any): EmailMessage {
     
    const headers: EmailHeader[] = (message.internetMessageHeaders || []).map(
      (header: any) => new EmailHeader(header.name, header.value)
    );

    const body = new EmailBody(
      message.body?.contentType || 'text',
      message.body?.content || ''
    );

    const attachments: EmailAttachment[] = (message.attachments || []).map((att: any) => {
      return new EmailAttachment(att.name, att.contentType);
    });

    const metadata = new EmailMetadata(
      message.id,
      message.subject || '',
      message.from?.emailAddress?.address || '',
      new Date(message.sentDateTime),
      new Date(message.receivedDateTime),
      message.conversationId,
      message.webLink
    );

    return new EmailMessage(headers, body, metadata, attachments);
  }
}
