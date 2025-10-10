import { MessageProvider } from '../ports/EmailAuthAnalyzerPort';
import { EmailAnalyzer } from './AbstractAnalyzeEmailUsecase';


export class AnalyzeEmailUseCase {
  constructor(
    private readonly messageProvider: MessageProvider,
    private readonly domainAuthUseCase: EmailAnalyzer,
    private readonly displayNameImpersonationUseCase: EmailAnalyzer,
    private readonly domainReputationUseCase: EmailAnalyzer,
    private readonly replyToMismatchUseCase: EmailAnalyzer,
    private readonly linkMismatchUsecase: EmailAnalyzer,
    private readonly urlRiskUsecase: EmailAnalyzer,
    private readonly attachementRiskUsecase: EmailAnalyzer
  ) {}

  async execute(userId: string, messageId: string) {
    const message = await this.messageProvider.getMessageById(userId, messageId);
    
   
    if (!message.headers || message.headers.length === 0) {
  throw new Error('En-têtes d’e-mail manquants.');
}

     

    const runAnalysis = (analyzer: EmailAnalyzer) => analyzer.analyze(message);

    const [
      domainAuthAnalysis,
      displayNameAnalysis,
      domainReputationAnalysis,
      replyToMismatchAnalysis,
      linkMismatchAnalysis,
      urlRiskAnalysis,
      attachementRiskAnalysis,
      
    ] = await Promise.all([
      runAnalysis(this.domainAuthUseCase),
      runAnalysis(this.displayNameImpersonationUseCase),
      runAnalysis(this.domainReputationUseCase),
      runAnalysis(this.replyToMismatchUseCase),
      runAnalysis(this.linkMismatchUsecase),
      runAnalysis(this.urlRiskUsecase),
      runAnalysis(this.attachementRiskUsecase)
      
    ]);


    return {
  analyses: {
    domainAuthentication: domainAuthAnalysis,
    displayNameImpersonation: displayNameAnalysis,
    domainReputation: domainReputationAnalysis, 
    replyToMismatch: replyToMismatchAnalysis,
    linkMismatch: linkMismatchAnalysis,
    urlRisk: urlRiskAnalysis,
    attachementRisk: attachementRiskAnalysis
  },
  totalScore:
    domainAuthAnalysis.score +
    displayNameAnalysis.score +
    domainReputationAnalysis.score +
    replyToMismatchAnalysis.score +
    linkMismatchAnalysis.score +
    urlRiskAnalysis.score + 
    attachementRiskAnalysis.score
};
  }
}