import LoggerInstance from "@config/logger/loggerInstance";
import { BaseError } from "@domainErrors/BaseError";
import { UnhandledRequestError } from "@applications/express/errors/customs/UnhandledRequestError";
import { UnhandledRequestErrorHandler } from "@applications/express/errors/handlers/unhandledRequestErrorHandler";
import { CouldntSendEmailError } from "@domainErrors/CouldntSendEmailError";
import { CouldntSendEmailErrorHandler } from "@applications/express/errors/handlers/couldntSendEmailErrorHandler";
import { LLMRequestError } from "@domainErrors/LLMRequestError";
import { LLMRequestErrorHandler } from "@applications/express/errors/handlers/LLMRequestErrorHandler";

// A generic handler that handles domain-specific errors
export default class GlobalErrorHandler {
  public static handle(error: BaseError, res: any): void {
    // Example of handling errors based on their type
    if (error instanceof UnhandledRequestError) {
      UnhandledRequestErrorHandler(error as UnhandledRequestError, res);
    } else if (error instanceof CouldntSendEmailError) {
      CouldntSendEmailErrorHandler(error as CouldntSendEmailError, res);
    } else if (error instanceof LLMRequestError) {
      LLMRequestErrorHandler(error as LLMRequestError, res);
    } else {
      this.handleUnknownError(error, res);
    }
  }

  private static handleUnknownError(error: BaseError, res: any): void {
    LoggerInstance.error(
      `🔥 error: [Unknown Error]: ${error.message}`,
      error.context
    );
    res
      .status(500)
      .send("An unexpected error occurred - Contact support for assistance.");
  }
}
