import { Router, Request, Response } from "express";
import { asyncHandler } from "@applications/express/utils/asyncHandler";
import { BasicUsecase } from "@usecases/BasicUsecase";
import LoggerInstance from "@config/logger/loggerInstance";
const route = Router();

const basicUsecase: BasicUsecase = new BasicUsecase();

export default (app: Router) => {
  app.use("", route);

  route.get(
    "/test",
    asyncHandler((req: Request, res: Response) => {
      return res.send("Test route working !").status(200);
    })
  );

  route.get(
    "/test-usecase",
    asyncHandler(async (req: Request, res: Response) => {
      await basicUsecase.execute(null);
      return res.send("Test usecase working !").status(200);
    })
  );
};
