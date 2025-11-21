import { EmailAnalyzer } from './AbstractAnalyzeEmailUsecase';
import { EmailMessage } from '@domainModels/emailAnalyzer/AnalyzedEmail';

export class UrgentLanguageAnalyzer extends EmailAnalyzer {
  async analyze(email: EmailMessage): Promise<{ score: number; message: string }> {
    
    const urgentKeywords = [
      'urgent',
      'immédiatement',
      'asap',
      '48h',
      '24h',
      'paiement',
      'transfert bancaire',
      'virement',
      'action requise',
      'sans délai',
      'critique',
      'immédiate'
    ];

    
    const content = (email.metadata.subject + ' ' + email.body.content)
      .toLowerCase()
      .normalize('NFD') 
      .replace(/[\u0300-\u036f]/g, '');

    
    const foundKeywords = urgentKeywords.filter(keyword => content.includes(keyword.toLowerCase()));

    if (foundKeywords.length > 0) {
      return {
        score: 10,
        message: `Le message utilise un langage d’urgence (${foundKeywords.join(', ')}).`
      };
    }

    return { score: 0, message: "Aucun langage d’urgence détecté." };
  }
}