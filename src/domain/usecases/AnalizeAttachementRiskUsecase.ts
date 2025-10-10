import { EmailAnalyzer } from './AbstractAnalyzeEmailUsecase';
import { EmailMessage } from '@domainModels/emailAnalyzer/AnalyzedEmail';

export class AnalyzeAttachmentRiskUseCase extends EmailAnalyzer {
  async analyze(email: EmailMessage): Promise<{ score: number; message: string }> {
    const riskyExtensions = {
      executable: ['exe', 'bat', 'cmd', 'vbs', 'js', 'jar', 'ps1'],
      macros: ['docm', 'xlsm', 'pptm'],
      encryptedArchives: ['zip', 'rar', '7z'],
    };

    let score = 0;
    const reasons: string[] = [];

    for (const attachment of email.attachments || []) {
      const fileName = attachment.name || '';
      const ext = fileName.split('.').pop()?.toLowerCase() || '';

      if (riskyExtensions.executable.includes(ext)) {
        score += 40;
        reasons.push(`Fichier exécutable détecté : ${fileName}`);
      } else if (riskyExtensions.macros.includes(ext)) {
        score += 35;
        reasons.push(`Document Office avec macros : ${fileName}`);
      } else if (riskyExtensions.encryptedArchives.includes(ext)) {
        score += 20;
        reasons.push(`Archive potentiellement protégée : ${fileName}`);
      }
    }

    // Cap à 60 points maximum
    if (score > 60) score = 60;

    return score > 0
      ? { score, message: reasons.join('\n') }
      : { score: 0, message: 'Aucun fichier joint suspect détecté.' };
  }
}