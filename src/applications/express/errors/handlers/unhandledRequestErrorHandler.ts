import { Response } from "express";
import envConfig from "@envConfig";
import LoggerInstance from "@config/logger/loggerInstance";
import { UnhandledRequestError } from "@applications/express/errors/customs/UnhandledRequestError";

export function UnhandledRequestErrorHandler(
  error: UnhandledRequestError,
  res: Response
): void {
  if (envConfig.env === "development") {
    LoggerInstance.error("🔥 error: %o", error);
  }

  res.status(404);
  res.send(error.message);
}
