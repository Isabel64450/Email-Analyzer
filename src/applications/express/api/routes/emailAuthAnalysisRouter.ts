import { Router, Request, Response } from "express";
import { asyncHandler } from "@applications/express/utils/asyncHandler";
import { AnalyzeEmailHeaderUsecase } from "@usecases/HeaderAnalizerScoreUsecase";

const route = Router();



const emailHeaderAnalizeUsecase: AnalyzeEmailHeaderUsecase = new AnalyzeEmailHeaderUsecase();

export default (app: Router) => {
  app.use("", route);

  
  route.post(
    "/analyze",
    asyncHandler(async (req: Request, res: Response) => {
     const { headers } = req.body;

      if (!headers || !Array.isArray(headers)) {
        return res.status(400).json({ error: "Missing or invalid 'headers' in request body" });
      }

      const result = emailHeaderAnalizeUsecase.analyze(headers); 
      return res.status(200).json(result);
    })
  );
};
