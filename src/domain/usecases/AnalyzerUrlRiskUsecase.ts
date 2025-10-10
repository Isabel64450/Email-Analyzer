import { EmailAnalyzer } from './AbstractAnalyzeEmailUsecase';
import { EmailMessage } from '@domainModels/emailAnalyzer/AnalyzedEmail';

export class AnalyzeUrlRiskUseCase extends EmailAnalyzer {
  private readonly shorteners = ['bit.ly', 't.co', 'tinyurl.com', 'goo.gl', 'ow.ly'];

  private readonly loginKeywords = ['login', 'signin', 'account', 'auth'];

  async analyze(email: EmailMessage): Promise<{ score: number; message: string }> {
    const { body } = email;
    const htmlContent = body.contentType.toLowerCase().includes('html')
      ? body.content
      : null;

    if (!htmlContent) {
      return { score: 0, message: 'Pas de contenu HTML à analyser pour les risques d’URLs.' };
    }

    const linkRegex = /<a[^>]*href=["'](.*?)["'][^>]*>/gi;
    let match;
    let score = 0;
    const reasons: string[] = [];

    while ((match = linkRegex.exec(htmlContent)) !== null) {
      const url = match[1];

      // 1. Vérifie si l’URL est raccourcie
      const domain = this.extractDomain(url);
      if (this.shorteners.includes(domain)) {
        score += 10;
        reasons.push(`Le message contient un lien raccourci (${domain}) masquant la destination.`);
      }

      // 2. Vérifie les liens non-HTTPS vers pages sensibles
      if (url.startsWith('http://') && this.loginKeywords.some(k => url.toLowerCase().includes(k))) {
        score += 15;
        reasons.push(`Lien non sécurisé (HTTP) vers une page d'identification : ${url}`);
      }

      // 3. Vérifie les homograph attacks
      if (this.containsIDNHomograph(domain)) {
        score += 15;
        reasons.push(`Lien avec domaine suspect (attaque homographique IDN) : ${domain}`);
      }
    }

    if (score > 0) {
      return { score, message: reasons.join('\n') };
    }

    return { score: 0, message: 'Aucun risque détecté dans les URLs.' };
  }

  private extractDomain(url: string): string {
    try {
      const parsed = new URL(url.startsWith('http') ? url : 'http://' + url);
      return parsed.hostname.toLowerCase().replace(/^www\./, '');
    } catch {
      return '';
    }
  }

  private containsIDNHomograph(domain: string): boolean {
    try {
      const ascii = domain.normalize('NFC'); // Normalisation unicode
      const punycode = ascii.startsWith('xn--'); // IDN en punycode
      const unicode = ascii !== ascii.normalize('NFKC'); // form différent

      // Autre technique basique : comparer caractères similaires
      const visuallySimilar = /[а-яё]/i.test(domain); // Lettres cyrilliques par ex

      return punycode || unicode || visuallySimilar;
    } catch {
      return false;
    }
  }
}