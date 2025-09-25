import axios from 'axios';

export class GraphEmailAdapter {
  private token: string;

  constructor(accessToken: string) {
    this.token = accessToken;
  }

  async fetchMessage(userId: string, messageId: string) {
    const url = `https://graph.microsoft.com/v1.0/users/${userId}/messages/${messageId}`;
    
    try {
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
        params: {
          $select: 'internetMessageHeaders,subject,from,body,attachments'
        }
      });

      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération du message via Graph :', error);
      throw error;
    }
  }
}