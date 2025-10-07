import { MessageProvider } from '../ports/EmailAuthAnalyzerPort';
import { EmailAnalyzer } from './AbstractAnalyzeEmailUsecase';
import { AnalyzeEmailDomainAuthUseCase } from './AnalyzeEmailDomainUsecase';
import { AnalyzeDisplayNameImpersonationUseCase } from './AnalyzeDisplayNameUsecase';
export class AnalyzeEmailUseCase {
  constructor(
    private readonly messageProvider: MessageProvider,
    private readonly domainAuthUseCase: EmailAnalyzer,
    private readonly displayNameImpersonationUseCase: EmailAnalyzer,
    private readonly domainReputationUseCase: EmailAnalyzer
  ) {}

  async execute(userId: string, messageId: string) {
    const message = await this.messageProvider.getMessageById(userId, messageId);
    
   
    if (!message.headers || message.headers.length === 0) {
  throw new Error('En-têtes d’e-mail manquants.');
}

     const domainAuthAnalysis = await this.domainAuthUseCase.analyze({
      subject: message.metadata.subject,
      bodyContent: message.body.content,
      contentType: message.body.contentType,
      headers: message.headers,});
   
     const displayNameAnalysis = await this.displayNameImpersonationUseCase.analyze({
      subject: message.metadata.subject,
      bodyContent: message.body.content,
      contentType: message.body.contentType,
      headers: message.headers,
    });
     const domainReputationAnalysis = await this.domainReputationUseCase.analyze({
      subject: message.metadata.subject,
      bodyContent: message.body.content,
      contentType: message.body.contentType,
      headers: message.headers, 
    });

    return {
  analyses: {
    domainAuthentication: domainAuthAnalysis,
    displayNameImpersonation: displayNameAnalysis,
    domainReputation: domainReputationAnalysis, 
  },
  totalScore:
    domainAuthAnalysis.score +
    displayNameAnalysis.score +
    domainReputationAnalysis.score,
};
  }
}