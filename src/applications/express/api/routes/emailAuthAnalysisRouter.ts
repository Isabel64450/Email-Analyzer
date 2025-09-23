import { Router, Request, Response } from "express";
import { asyncHandler } from "@applications/express/utils/asyncHandler";
import { BasicUsecase } from "@usecases/BasicUsecase";

const route = Router();



const emailHeaderAnalizeUsecase: AnalyzeEmailHeaderUsecase = new AnalyzeEmailHeaderUsecase();

export default (app: Router) => {
  app.use("", route);

  
  route.get(
    "/finalScore-usecase",
    asyncHandler(async (req: Request, res: Response) => {
      await emailHeaderAnalizeUsecase.execute(null);
      return res.send("Test usecase working !").status(200);
    })
  );
};
