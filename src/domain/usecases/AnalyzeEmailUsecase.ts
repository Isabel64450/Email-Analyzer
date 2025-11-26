import { MessageProvider } from '../ports/EmailAuthAnalyzerPort';
import { EmailAnalyzer } from './AbstractAnalyzeEmailUsecase';
import { emails } from '@domainUtils/emails';
import { EmailMessage } from '@domainModels/emailAnalyzer/AnalyzedEmail';


export class AnalyzeEmailUseCase {
  constructor(
    private readonly messageProvider: MessageProvider,
    private readonly domainAuthUseCase: EmailAnalyzer,
    private readonly displayNameImpersonationUseCase: EmailAnalyzer,
    private readonly domainReputationUseCase: EmailAnalyzer,
    private readonly replyToMismatchUseCase: EmailAnalyzer,
    private readonly linkMismatchUsecase: EmailAnalyzer,
    private readonly urlRiskUsecase: EmailAnalyzer,
    private readonly attachementRiskUsecase: EmailAnalyzer,
    private readonly spellCheckUsecase: EmailAnalyzer,
    private readonly threadHijackUsecase: EmailAnalyzer,
    private readonly urgentLanguageUsecase: EmailAnalyzer
  ) {}

  async execute(userEmail: string, messageId?: string) {
    let userId: string | undefined
    let message:EmailMessage | undefined
     if (messageId) {
      
    message = emails.find(e => e.metadata.id === messageId);
    
    if (!message && messageId) {
      try {
        
        userId = await this.messageProvider.getUserIdByEmail(userEmail)
        
        message = await this.messageProvider.getMessageById(userId, messageId);
         
      } catch (err) {
        console.error("Erreur en récupérant l'userId ou le message:",err)
        
      }
    }
  }

  // Si pas de message trouvé, prends le message de test par défaut
  if (!message) {
    
    message = emails[0]; // ou emails[0] selon ton choix
  }
    
   
    if (!message.headers || message.headers.length === 0) {
  throw new Error('En-têtes d’e-mail manquants.');
}

     

    const runAnalysis = (analyzer: EmailAnalyzer) => analyzer.analyze(message, userId);

    const [
      domainAuthAnalysis,
      displayNameAnalysis,
      domainReputationAnalysis,
      replyToMismatchAnalysis,
      linkMismatchAnalysis,
      urlRiskAnalysis,
      attachementRiskAnalysis,
      spellcheckAnalysis,
      threadHijackAnalysis, 
      urgentLanguageAnalisys,
      
    ] = await Promise.all([
      runAnalysis(this.domainAuthUseCase),
      runAnalysis(this.displayNameImpersonationUseCase),
      runAnalysis(this.domainReputationUseCase),
      runAnalysis(this.replyToMismatchUseCase),
      runAnalysis(this.linkMismatchUsecase),
      runAnalysis(this.urlRiskUsecase),
      runAnalysis(this.attachementRiskUsecase),
      runAnalysis(this.spellCheckUsecase),
      runAnalysis(this.threadHijackUsecase),
      runAnalysis(this.urgentLanguageUsecase),
      
    ]);


    return {
  analyses: {
    domainAuthentication: domainAuthAnalysis,
    displayNameImpersonation: displayNameAnalysis,
    domainReputation: domainReputationAnalysis, 
    replyToMismatch: replyToMismatchAnalysis,
    linkMismatch: linkMismatchAnalysis,
    urlRisk: urlRiskAnalysis,
    attachementRisk: attachementRiskAnalysis,
    spellcheckAnalysis: spellcheckAnalysis,
    threadHijack: threadHijackAnalysis, 
    urgentLanguage: urgentLanguageAnalisys
  },
  totalScore:
    domainAuthAnalysis.score +
    displayNameAnalysis.score +
    domainReputationAnalysis.score +
    replyToMismatchAnalysis.score +
    linkMismatchAnalysis.score +
    urlRiskAnalysis.score + 
    attachementRiskAnalysis.score +
    spellcheckAnalysis.score +
    threadHijackAnalysis.score +
    urgentLanguageAnalisys.score,
    message

};
  }







}