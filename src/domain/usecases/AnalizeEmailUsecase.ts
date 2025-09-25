export interface AnalyzeEmailInput {
  userId: string;
  messageId: string;
}

export class AnalyzeEmailUseCase {
  async execute(input: AnalyzeEmailInput): Promise<void> {
    const { userId, messageId } = input;

    // Ici, tu pourrais appeler ton Adapter Graph (mocké ou réel)
    console.log(`Analyse en cours pour message ${messageId} de user ${userId}`);

    // Tu peux mocker la réponse Graph ici aussi si tu veux aller plus loin
  }
}