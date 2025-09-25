import {InternetHeader ,AnalyzerResult, EmailRiskDecision} from "@domainModels/EmailAuthAnalysis"


export class AnalyzeEmailHeaderUsecase {
  analyze(headers: InternetHeader[]): AnalyzerResult {
    let score = 0;
    const reasons: string[] = [];

    const getHeader = (name: string) =>
      headers.find(h => h.name.toLowerCase() === name.toLowerCase())?.value || '';

    const authResults = getHeader('Authentication-Results');
    const spfHeader = getHeader('Received-SPF');
    const dkimHeader = getHeader('DKIM-Signature');
    const arcHeader = getHeader('ARC-Authentication-Results');

    // ----- SPF -----
    if (/softfail|fail/i.test(spfHeader) || /spf=fail|spf=softfail/i.test(authResults)) {
      score += 25;
      reasons.push('SPF a échoué ou est en softfail');
    }

    // ----- DKIM -----
    const dkimValid = /dkim=pass/i.test(authResults);
    if (!dkimHeader || !dkimValid) {
      score += 20;
      reasons.push('DKIM est absent ou invalide');
    }

    // ----- DMARC -----
    if (/dmarc=fail/i.test(authResults)) {
      score += 35;
      reasons.push('DMARC a échoué');
    }

    // ----- ARC -----
    const arcInvalid = /arc=fail/i.test(authResults);
    if (arcInvalid || /fail/i.test(arcHeader)) {
      score += 10;
      reasons.push('ARC invalide (forward douteux)');
    }

    // Cap à 100 max
    score = Math.min(score, 100);

    // Détermination de la décision
    let decision: EmailRiskDecision = 'OK';
    if (score >= 80) decision = 'Dangerous';
    else if (score >= 60) decision = 'Very Suspicious';
    else if (score >= 30) decision = 'Suspicious';

    return {
      score,
      decision,
      reasons,
    };
  }
}