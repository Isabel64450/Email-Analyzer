import { BaseError } from "@domainErrors/BaseError";
import { ErrorConstants } from "@applications/express/constants/error";

export class UnhandledRequestError extends BaseError {
  constructor(message: string, context?: Record<string, unknown>) {
    super(ErrorConstants.names.UNHANDLED_REQUEST_ERROR, message, context);
  }
}
