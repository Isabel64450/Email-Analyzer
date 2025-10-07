import { Router, Request, Response } from "express";
import { asyncHandler } from "@applications/express/utils/asyncHandler";
import { AnalyzeEmailDomainAuthUseCase } from "@usecases/AnalyzeEmailDomainUsecase";
import {AnalyzeEmailUseCase} from "../../../../domain/usecases/AnalyzeEmailUsecase"
import { GraphApiMessageProvider } from "@infra/microsoftGraph/adapters/GraphEmailAdapter";
import { AnalyzeDisplayNameImpersonationUseCase } from "@usecases/AnalyzeDisplayNameUsecase";
import { WhoisJsonAdapter} from "@infra/microsoftGraph/adapters/WhoisJsonAdapter";
import { AnalyzeDomainReputationUseCase } from "@usecases/AnalyzeDomainReputationUsecase";

const route = Router();
const whoisAdapter = new WhoisJsonAdapter(); 
const messageProvider = new GraphApiMessageProvider();
const domainAuthUseCase = new AnalyzeEmailDomainAuthUseCase();
const displayNameUsecase = new AnalyzeDisplayNameImpersonationUseCase()
const domainReputationUseCase = new AnalyzeDomainReputationUseCase(whoisAdapter);
const analyzeEmailUseCase = new AnalyzeEmailUseCase(messageProvider, domainAuthUseCase, displayNameUsecase,domainReputationUseCase);
export default (app: Router) => {
  app.use("", route);

  route.get(
    "/test",
    asyncHandler((req: Request, res: Response) => {
      return res.send("Test route working !").status(200);
    })
  );

  route.get('/messages/:userId/:messageId', async (req: Request, res: Response) => {
  const { userId, messageId } = req.params;

  if (!userId || !messageId) {
    return res.status(400).json({ error: 'Paramètres requis manquants.' });
  }

  try {
    const message = await analyzeEmailUseCase.execute(userId, messageId);
    res.json(message);
  } catch (error: any) {
    console.error('❌ Erreur lors de la récupération du message:', error.message);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

  
};