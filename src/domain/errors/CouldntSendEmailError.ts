import { ErrorConstants } from "@domainConstants/error";
import { BaseError } from "./BaseError";

export class CouldntSendEmailError extends BaseError {
  constructor(message: string) {
    super(ErrorConstants.names.COULDNT_SEND_EMAIL_ERROR, message);
  }
}
