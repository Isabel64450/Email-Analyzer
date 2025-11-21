import { EmailAnalyzer } from './AbstractAnalyzeEmailUsecase';
import { EmailMessage } from '@domainModels/emailAnalyzer/AnalyzedEmail';
import { GraphApiMessageProvider } from '@infra/microsoftGraph/adapters/GraphEmailAdapter';
import { emails } from '@domainUtils/emails';

export class ThreadHijackAnalyzer extends EmailAnalyzer {
  constructor(
    private readonly graphProvider: GraphApiMessageProvider, 
   
  ) {
    super();
  }

  async analyze(email: EmailMessage, userId?: string): Promise<{ score: number; message: string }> {
  if (!userId) {
    return { score: 0, message: "Impossible d'analyser la conversation : userId manquant." };
  }

  const inReplyToHeader = email.headers.find(h => h.name.toLowerCase() === 'in-reply-to');

  if (!inReplyToHeader) {
    return { score: 0, message: "Pas une réponse, donc pas d'anomalie." };
  }

  if (!email.metadata.conversationId) {
    return {
      score: 10,
      message: "Réponse supposée, mais aucun fil de discussion associé."
    };
  }

  let otherMessages: EmailMessage[] = [];

  // === Si graphProvider existe, on l’utilise ===
  if (this.graphProvider) {
    try {
      otherMessages = await this.graphProvider.getMessagesByConversationId(
        userId,
        email.metadata.conversationId,
        email.metadata.id
      );
    } catch (err) {
      
      otherMessages = emails.filter(
        e => e.metadata.conversationId === email.metadata.conversationId && e.metadata.id !== email.metadata.id
      );
    }
  } else {
    // === Mode local ===
    otherMessages = emails.filter(
      e => e.metadata.conversationId === email.metadata.conversationId && e.metadata.id !== email.metadata.id
    );
  }

  if (!otherMessages || otherMessages.length === 0) {
    return {
      score: 10,
      message: "Réponse supposée, mais aucun fil de discussion associé."
    };
  }

  // === Thread Hijack check ===
  const knownSenders = otherMessages.map(m => m.metadata.from);
  if (!knownSenders.includes(email.metadata.from)) {
    return {
      score: 10,
      message: `Expéditeur inattendu dans le fil (${email.metadata.from}) — possible Thread Hijack`
    };
  }

  return { score: 0, message: "Pas d'anomalie détectée." };
}}