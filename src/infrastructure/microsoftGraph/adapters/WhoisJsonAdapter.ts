import axios from 'axios';
import { WhoisDomainInfoProvider } from '../../../domain/ports/WhoisDomainInfoProvider';

export class WhoisJsonAdapter implements WhoisDomainInfoProvider {
  private readonly apiKey = process.env.WHOIS_API_KEY;
  
  async getDomainCreationDate(domain: string): Promise<Date | null> {
    try {
      const response = await axios.get('https://whoisjson.com/api/v1/whois', {
  headers: {
    Authorization: `TOKEN=${this.apiKey}`
  },
  params: {
    domain: domain
  }
      });

      const createdAt = response.data.created;
      
      return createdAt ? new Date(createdAt) : null;

    } catch (error) {
      console.error('Erreur WHOIS :', error);
      return null;
    }
  }
}