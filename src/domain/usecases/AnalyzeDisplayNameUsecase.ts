import { EmailAnalyzer } from './AbstractAnalyzeEmailUsecase';
import { EmailMessage } from '@domainModels/emailAnalyzer/AnalyzedEmail';
export class AnalyzeDisplayNameImpersonationUseCase extends EmailAnalyzer {
  private readonly trustedNames = [
    'CEO',
    'Chief Executive Officer',
    'CFO',
    'CTO',
    'HR',
    'Support',
    'IT Service',
    
  ]; 

  private readonly trustedDomains = [
    'monentreprise.com',
    'service.interne.com',
    
  ];

 async analyze(email: EmailMessage): Promise<{ score: number; message: string }> {
  
  const headers = email.headers;

    
    const fromHeader = headers.find(h => h.name.toLowerCase() === 'from');
    if (!fromHeader) {
      return { score: 0, message: 'Pas d\'entête From trouvée' };
    }

    
    const fromValue = fromHeader.value;

    
    const match = fromValue.match(/^(.*)<(.*)>$/);
    if (!match) {
      return { score: 0, message: 'Format entête From inattendu' };
    }
    const displayName = match[1].trim().toLowerCase();
    const emailAddress = match[2].trim().toLowerCase();

    
    const domain = emailAddress.split('@')[1] || '';

    
    const impersonating = this.trustedNames.some(name =>
      displayName.includes(name.toLowerCase())
    );

    const isInternalDomain = this.trustedDomains.includes(domain);
    const isExternalDomain = !isInternalDomain;

  
  if (impersonating && isExternalDomain) {
    return {
      score: 25,
      message: `Le nom d’affichage imite un contact interne (ex: ${displayName}) mais le domaine diffère (${domain}).`
    };
  }

  
  if (isInternalDomain) {
    return {
      score: -15,
      message: `Le domaine (${domain}) est reconnu comme interne de confiance. Risque réduit.`
    };
  }

    return { score: 0, message: 'Aucune usurpation détectée sur le nom affiché.' };
  }
}