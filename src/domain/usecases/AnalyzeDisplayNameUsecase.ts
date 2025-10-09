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
    // ajoute d’autres noms / titres internes ici
  ]; 

  private readonly trustedDomains = [
    'monentreprise.com',
    'service.interne.com',
    // ajoute les domaines internes légitimes
  ];

 async analyze(email: EmailMessage): Promise<{ score: number; message: string }> {
  
  const headers = email.headers;

    // Trouve l'entête 'From' qui contient normalement le displayName et l'adresse mail
    const fromHeader = headers.find(h => h.name.toLowerCase() === 'from');
    if (!fromHeader) {
      return { score: 0, message: 'Pas d\'entête From trouvée' };
    }

    // Exemple de format : "John CEO" <john.ceo@autredomaine.com>
    const fromValue = fromHeader.value;

    // Extraire displayName et email via regex simple
    const match = fromValue.match(/^(.*)<(.*)>$/);
    if (!match) {
      return { score: 0, message: 'Format entête From inattendu' };
    }
    const displayName = match[1].trim().toLowerCase();
    const emailAddress = match[2].trim().toLowerCase();

    // Extraire domaine
    const domain = emailAddress.split('@')[1] || '';

    // Vérifier si displayName contient un nom interne "sensible"
    const impersonating = this.trustedNames.some(name =>
      displayName.includes(name.toLowerCase())
    );

    const isInternalDomain = this.trustedDomains.includes(domain);
  const isExternalDomain = !isInternalDomain;

  // Cas 1 : Usurpation d’un nom sensible depuis un domaine externe → +25
  if (impersonating && isExternalDomain) {
    return {
      score: 25,
      message: `Le nom d’affichage imite un contact interne (ex: ${displayName}) mais le domaine diffère (${domain}).`
    };
  }

  // Cas 2 : Domaine interne utilisé = réduction du score → -15
  if (isInternalDomain) {
    return {
      score: -15,
      message: `Le domaine (${domain}) est reconnu comme interne de confiance. Risque réduit.`
    };
  }

    return { score: 0, message: 'Aucune usurpation détectée sur le nom affiché.' };
  }
}