import { ErrorConstants } from "@domainConstants/error";
import { BaseError } from "@domainErrors/BaseError";

export class ConstraintValidationError extends BaseError {
  constructor(message: string, context?: Record<string, unknown>) {
    super(ErrorConstants.names.CONSTRAINT_VALIDATION_ERROR, message, context);
  }
}
