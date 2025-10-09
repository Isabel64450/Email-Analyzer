import axios from 'axios';
import { MessageProvider } from '../../../domain/ports/EmailAuthAnalyzerPort';
import { getAccessToken } from '../authentication/authGraphToken'; 
import { EmailMessage } from '../../../domain/models/emailAnalyzer/AnalyzedEmail';
import { EmailHeader } from '../../../domain/models/emailAnalyzer/EmailHeader';
import { EmailBody } from '../../../domain/models/emailAnalyzer/EmailBody';
import { EmailMetadata } from '../../../domain/models/emailAnalyzer/EmailMetadata';

export class GraphApiMessageProvider implements MessageProvider {
  async getMessageById(userId: string, messageId: string) : Promise<EmailMessage>  {
    const accessToken = await getAccessToken();

    const url = `https://graph.microsoft.com/v1.0/users/${encodeURIComponent(userId)}/messages/${encodeURIComponent(messageId)}?$select=internetMessageHeaders,from,toRecipients,receivedDateTime`;

    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });
        const message = response.data;
  
    const headers: EmailHeader[] = (message.internetMessageHeaders || []).map(
      (header: any) => new EmailHeader(header.name, header.value)
    );

  
    const body = new EmailBody(
      message.body?.contentType || 'text/plain',
      message.body?.content || ''
    );

   
    const metadata = new EmailMetadata(
      message.id,
      message.subject || '',
      message.from?.emailAddress?.address || '',
      new Date(message.sentDateTime),
      new Date(message.receivedDateTime),
      message.conversationId,
      message.webLink
    );

   
    return new EmailMessage(headers, body, metadata);
  }
}