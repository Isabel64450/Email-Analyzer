import { MessageProvider } from '../ports/EmailAuthAnalyzerPort';
import { AnalyzeEmailDomainAuthUseCase } from './AnalyzeEmailDomainUsecase';

export class AnalyzeEmailUseCase {
  constructor(
    private readonly messageProvider: MessageProvider,
    private readonly domainAuthUseCase: AnalyzeEmailDomainAuthUseCase
  ) {}

  async execute(userId: string, messageId: string) {
    const message = await this.messageProvider.getMessageById(userId, messageId);

    if (!message.headers || message.headers.length === 0) {
  throw new Error('En-têtes d’e-mail manquants.');
}

const domainAuthAnalysis = await this.domainAuthUseCase.execute(message.headers);
    // Tu peux enchaîner d’autres analyseurs ici plus tard (contenu, pièce jointe...)

    return {
      messageId,
      userId,
      analyses: {
        domainAuthentication: domainAuthAnalysis
      },
      totalScore: domainAuthAnalysis.score // total cumulé si plusieurs analyses
    };
  }
}