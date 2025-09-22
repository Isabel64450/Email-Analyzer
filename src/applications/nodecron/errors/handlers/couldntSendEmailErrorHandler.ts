import envConfig from "@envConfig";
import { CouldntSendEmailError } from "@domainErrors/CouldntSendEmailError";
import LoggerInstance from "@config/logger/loggerInstance";

export function CouldntSendEmailErrorHandler(
  error: CouldntSendEmailError
): void {
  if (envConfig.env === "development") {
    LoggerInstance.error("🔥 error: %o", error);
  }

  // TODO handle error
}
