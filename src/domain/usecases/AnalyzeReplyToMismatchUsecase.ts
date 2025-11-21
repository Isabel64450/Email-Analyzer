import { EmailAnalyzer } from './AbstractAnalyzeEmailUsecase';
import { EmailMessage } from '@domainModels/emailAnalyzer/AnalyzedEmail';

export class AnalyzeReplyToMismatchUseCase extends EmailAnalyzer {
  async analyze(email: EmailMessage): Promise<{ score: number; message: string }> {
  
  const headers = email.headers;

    const fromHeader = headers.find(h => h.name.toLowerCase() === 'from');
    const replyToHeader = headers.find(h => h.name.toLowerCase() === 'reply-to');

    if (!fromHeader || !replyToHeader) {
      return { score: 0, message: 'Aucune incohérence Reply-To détectée.' };
    }

    const fromEmail = this.extractEmail(fromHeader.value);
    const replyToEmail = this.extractEmail(replyToHeader.value);

    const fromDomain = this.extractDomain(fromEmail);
    const replyToDomain = this.extractDomain(replyToEmail);

    if (fromDomain && replyToDomain && fromDomain !== replyToDomain) {
      return {
        score: 15,
        message: `L’adresse de réponse diffère du domaine d’expédition (From: ${fromDomain}, Reply-To: ${replyToDomain}).`
      };
    }

    return {
      score: 0,
      message: 'Reply-To et From ont des domaines cohérents.'
    };
  }

  private extractEmail(input: string): string {

    const match = input.match(/<(.+?)>/);
    if (match) return match[1];
    return input.trim();
  }

  private extractDomain(email: string): string {
    const parts = email.split('@');
    return parts.length === 2 ? parts[1].toLowerCase() : '';
  }
}