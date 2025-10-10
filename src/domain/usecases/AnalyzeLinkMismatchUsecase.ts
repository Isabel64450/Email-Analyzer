import { EmailAnalyzer } from './AbstractAnalyzeEmailUsecase';
import { EmailMessage } from '@domainModels/emailAnalyzer/AnalyzedEmail';

export class AnalyzeLinkMismatchUseCase extends EmailAnalyzer {
  async analyze(email: EmailMessage): Promise<{ score: number; message: string }> {
    const { body } = email;
   
    const isHtml = body.contentType.toLowerCase().includes('html');

const htmlContent = isHtml
  ? body.content
  : body['alternativeContent']?.type?.toLowerCase().includes('html')
    ? body['alternativeContent'].content
    : null;

if (!htmlContent) {
  return {
    score: 0,
    message: 'Contenu HTML non disponible pour analyse des liens.',
  };
}
    const linkRegex = /<a[^>]*href=["'](.*?)["'][^>]*>(.*?)<\/a>/gi;
    let match;
    const mismatches: string[] = [];

    while ((match = linkRegex.exec(htmlContent)) !== null) {
      const href = match[1];
      const linkText = match[2];

      const hrefDomain = this.extractDomain(href);
      const textDomain = this.extractDomain(linkText);

      if (hrefDomain && textDomain && hrefDomain !== textDomain) {
        mismatches.push(`Lien: "${linkText}" → ${href}`);
      }
    }

    if (mismatches.length > 0) {
      return {
        score: 25,
        message: `Certains liens affichent un texte incohérent avec leur URL réelle :\n${mismatches.join('\n')}`,
      };
    }

    return {
      score: 0,
      message: 'Tous les liens sont cohérents avec leur texte visible.',
    };
  }

  private extractDomain(text: string): string | null {
    try {
      const url = new URL(text.startsWith('http') ? text : 'http://' + text);
      return url.hostname.replace(/^www\./, '').toLowerCase();
    } catch {
      return null;
    }
  }
}