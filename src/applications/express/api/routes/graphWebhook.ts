import { Router, Request, Response } from 'express';
import { asyncHandler } from "@applications/express/utils/asyncHandler";
import { AnalyzeEmailUseCase } from '@usecases/AnalizeEmailUsecase';

const router = Router();
const analyzeUseCase = new AnalyzeEmailUseCase();

 export default (app:Router)=>{ app.use("",router);


    router.post("/webhook",asyncHandler(async (req: Request, res: Response) => {
    const notification = req.body.value?.[0];

    if (!notification?.resource) {
      return res.status(400).send('Invalid payload');
    }

    const parts = notification.resource.split('/');
    const userIdIndex = parts.indexOf('users') + 1;
    const messageIdIndex = parts.indexOf('messages') + 1;

    const userId = parts[userIdIndex];
    const messageId = parts[messageIdIndex];

    if (!userId || !messageId) {
      return res.status(400).send('Invalid resource format');
    }

    await analyzeUseCase.execute({ userId, messageId });

    res.status(202).send('Webhook processed');
  }))
 
};

