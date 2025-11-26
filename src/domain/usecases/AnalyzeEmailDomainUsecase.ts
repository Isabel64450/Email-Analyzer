
import { EmailAnalyzer } from './AbstractAnalyzeEmailUsecase';
import { EmailMessage } from '@domainModels/emailAnalyzer/AnalyzedEmail';

export class AnalyzeEmailDomainAuthUseCase extends EmailAnalyzer {
  private knownDomains = ["afec.fr",  "francetravail.gouv.fr",
  "pole-emploi.fr"];
  async analyze(email: EmailMessage): Promise<{ score: number; message: string }> {
 
  const headers = email.headers;
     
    let score = 0;
    const reasons: string[] = [];

    const headerMap: Record<string, string> = {};
    headers.forEach(h => {
      headerMap[h.name.toLowerCase()] = h.value;
    });

    const authResults = headerMap['authentication-results'] || '';
    const receivedSpf = headerMap['received-spf'] || '';
    const dkimSignature = headerMap['dkim-signature'] || '';
    const arc = headerMap['arc-authentication-results'] || '';

    const fromHeader = headerMap['from'] || '';

    const emailMatch = fromHeader.match(/<(.+?)>/);
    const fromAddress = emailMatch ? emailMatch[1] : fromHeader;

    const fromDomain = fromAddress.split("@")[1]?.toLowerCase() || '';

    // SPF
    if (/softfail|fail/i.test(receivedSpf)) {
      score += 25;
      reasons.push('SPF échoué (softfail/fail)');
    }

    // DKIM
    const isKnownDomain = this.knownDomains.includes(fromDomain);
    const dkimFail = /dkim=fail|none/i.test(authResults);
    const dkimMissing = !dkimSignature;
    if (!isKnownDomain && (dkimFail || dkimMissing)) {
      score += 20;
      reasons.push('DKIM absent ou invalide');
    }

    // DMARC
    if (/dmarc=fail/i.test(authResults)) {
      score += 35;
      reasons.push('DMARC échoué');
    }

    // ARC
    if (/arc=fail/i.test(authResults) || /fail/i.test(arc)) {
      score += 10;
      reasons.push('ARC invalide (forward douteux)');
    }

    const message = reasons.length
      ? `L’authentification de l’expéditeur a échoué (${reasons.join(', ')}).`
      : 'Authentification du domaine réussie.';

    return { score, message };
  }
}