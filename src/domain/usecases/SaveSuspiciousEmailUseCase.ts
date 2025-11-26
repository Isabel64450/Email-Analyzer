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

    const analysisResult = await this.analyzeEmailUseCase.execute(userEmail, messageId);

    if (analysisResult.totalScore > 50) {
      const message: EmailMessage = analysisResult.message ?? undefined;

      if (!message) {
        throw new Error("Impossible de créer un SuspiciousEmail sans message.");
      }
      const exists = await this.suspiciousEmailRepo.exists(message.metadata.id);
    if (exists) {
      
      return null; 
    }
     
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
     
      await this.suspiciousEmailRepo.save(suspiciousEmail);

      
      return suspiciousEmail;
    } else {
      
      return analysisResult;
    }
  }
}