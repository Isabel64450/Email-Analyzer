import axios from 'axios';
import { MessageProvider } from '../../../domain/ports/EmailAuthAnalyzerPort';
import { getAccessToken } from '../authentication/authGraphToken'; 

export class GraphApiMessageProvider implements MessageProvider {
  async getMessageById(userId: string, messageId: string) {
    const accessToken = await getAccessToken();

    const url = `https://graph.microsoft.com/v1.0/users/${encodeURIComponent(userId)}/messages/${encodeURIComponent(messageId)}?$select=internetMessageHeaders,from,toRecipients,receivedDateTime`;

    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    const message = response.data;

    return message
  }
}