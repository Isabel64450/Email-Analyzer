import { AnalyzeEmailUseCase } from './AnalyzeEmailUsecase';
import { SuspiciousEmailRepositoryPort } from '@ports/SuspiciousEmailRepositoryPort';
import { SuspiciousEmail } from '@domainModels/emailAnalyzer/SuspiciousEmail';
import { EmailMessage } from '@domainModels/emailAnalyzer/AnalyzedEmail';

export class SaveSuspiciousEmailUseCase {
  constructor(
    private readonly analyzeEmailUseCase: AnalyzeEmailUseCase,
    private readonly suspiciousEmailRepo: SuspiciousEmailRepositoryPort
  ) {}

  async execute(userEmail: string, messageId?: string) {
    // 1️⃣ Analyse l'email
    const analysisResult = await this.analyzeEmailUseCase.execute(userEmail, messageId);

    // 2️⃣ Vérifie si le score total dépasse 90
    if (analysisResult.totalScore > 30) {
      const message: EmailMessage = analysisResult.message ?? undefined;

      if (!message) {
        throw new Error("Impossible de créer un SuspiciousEmail sans message.");
      }

      // 3️⃣ Crée l'objet SuspiciousEmail
      const suspiciousEmail: SuspiciousEmail = {
       messageId: message.metadata.id,
       sender: message.metadata.from,
       recipient: userEmail,  
       subject: message.metadata.subject ?? null,
       receivedAt: message.metadata.receivedDateTime,
       totalScore: analysisResult.totalScore,
       analyses: analysisResult.analyses,
       rawHeaders: JSON.stringify(message.headers), 
       bodyPreview: message.body.content.slice(0,200)
      };
      // 4️⃣ Sauvegarde dans la base via le repository
      await this.suspiciousEmailRepo.save(suspiciousEmail);

      console.log("📌 Suspicious email saved, score:", analysisResult.totalScore);
      return suspiciousEmail;
    } else {
      console.log("✅ Email score below threshold:", analysisResult.totalScore);
      return null;
    }
  }
}