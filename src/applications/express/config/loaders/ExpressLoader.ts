import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import httpConfig from "@applications/express/config/http/http";
import { BaseError } from "@domainErrors/BaseError";
import GlobalErrorHandler from "@applications/express/errors/handlers/globalErrorHandler";
import { UnhandledRequestError } from "@applications/express/errors/customs/UnhandledRequestError";
import { RoutersLoader } from "./RoutesLoader";
import LoggerInstance from "@config/logger/loggerInstance";
export default ({ app }: { app: express.Application }) => {
  LoggerInstance.info("🚀 Running Express loader...");

  app.get("/status", (req, res) => {
    res.status(200).end();
  });
  app.head("/status", (req, res) => {
    res.status(200).end();
  });

  app.enable("trust proxy");

  app.use(cors());

  app.use(express.json());

  // Load routes with RoutesLoader
  app.use(httpConfig.api.prefix, new RoutersLoader().loadRoutes());

  /// catch 404 and forward to error handler
  app.use((req, res, next) => {
    const err = new UnhandledRequestError("Not Found");
    next(err);
  });

  app.use((err: BaseError, req: Request, res: Response, next: NextFunction) => {
    GlobalErrorHandler.handle(err, res);
  });

  //
  app.use((err: BaseError, req: Request, res: Response, next: NextFunction) => {
    res.status(500);
    res.send("Internal Server Error - Contact support for assistance.");
  });
  LoggerInstance.info("✅ Express loaded");
};
