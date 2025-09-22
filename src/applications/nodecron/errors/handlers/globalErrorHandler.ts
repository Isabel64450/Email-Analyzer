import { UnhandledRequestError } from "@applications/express/errors/customs/UnhandledRequestError";
import LoggerInstance from "@config/logger/loggerInstance";
import { BaseError } from "@domainErrors/BaseError";
import { CouldntSendEmailError } from "@domainErrors/CouldntSendEmailError";
import { LLMRequestError } from "@domainErrors/LLMRequestError";
import { CouldntSendEmailErrorHandler } from "@applications/nodecron/errors/handlers/couldntSendEmailErrorHandler";
import { LLMRequestErrorHandler } from "@applications/nodecron/errors/handlers/LLMRequestErrorHandler";

export default class GlobalErrorHandler {
  public static handle(error: BaseError): void {
    // Example of handling errors based on their type
    if (error instanceof CouldntSendEmailError) {
      CouldntSendEmailErrorHandler(error as CouldntSendEmailError);
    } else if (error instanceof LLMRequestError) {
      LLMRequestErrorHandler(error as LLMRequestError);
    } else {
      this.handleUnknownError(error);
    }
  }

  private static handleUnknownError(error: BaseError): void {
    LoggerInstance.error(
      `🔥 error: [Unknown Error]: ${error.message}`,
      error.context
    );

    // TODO handle error
  }
}
