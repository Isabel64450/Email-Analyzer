import { Response } from "express";
import envConfig from "@envConfig";
import LoggerInstance from "@config/logger/loggerInstance";
import { CouldntSendEmailError } from "@domainErrors/CouldntSendEmailError";

export function CouldntSendEmailErrorHandler(
  error: CouldntSendEmailError,
  res: Response
): void {
  if (envConfig.env === "development") {
    LoggerInstance.error("🔥 error: %o", error);
  }

  res.status(500);
  res.send(error.message + " - Contact support for assistance.");
}
