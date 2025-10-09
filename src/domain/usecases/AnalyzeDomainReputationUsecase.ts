import { EmailAnalyzer } from './AbstractAnalyzeEmailUsecase';
import { WhoisDomainInfoProvider } from '../ports/WhoisDomainInfoProvider';
import { EmailMessage } from '@domainModels/emailAnalyzer/AnalyzedEmail';


export class AnalyzeDomainReputationUseCase extends EmailAnalyzer {
  constructor(private readonly whoisProvider: WhoisDomainInfoProvider) {
    super();
  }

  async analyze(email: EmailMessage): Promise<{ score: number; message: string }> {
  const subject = email.metadata.subject;
  const body = email.body.content;
  const headers = email.headers;
    const from = email.headers?.find(h => h.name.toLowerCase() === 'from')?.value;
    if (!from) return { score: 0, message: 'Pas d’expéditeur' };

    const domain = this.extractDomain(from);
    const creationDate = await this.whoisProvider.getDomainCreationDate(domain);

    if (!creationDate) {
      return {
        score: 10,
        message: 'Impossible de vérifier l’ancienneté du domaine'
      };
    }

    const ageInDays = Math.floor((Date.now() - creationDate.getTime()) / (1000 * 60 * 60 * 24));
    if (ageInDays < 30) {
      return {
        score: 15,
        message: `Le domaine a été créé il y a seulement ${ageInDays} jours`
      };
    }

    return {
      score: 0,
      message: 'Le domaine a une ancienneté suffisante'
    };
  }

  private extractDomain(from: string): string {
    const match = from.match(/@([^>\s]+)/);
    return match ? match[1].toLowerCase() : '';
  }
}