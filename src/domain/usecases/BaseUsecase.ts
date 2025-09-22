import { validate } from "class-validator";
import { ConstraintValidationError } from "@domainErrors/ConstraintValidationError";

export abstract class BaseUsecase<InputType, OutputType> {
  // Méthode abstraite que chaque usecase doit implémenter
  protected abstract apply(input: InputType): Promise<OutputType>;

  // Méthode pour valider l'input
  protected async validateInput(input: InputType): Promise<void> {
    if (input != null) {
      const errors = await validate(input);
      if (errors.length > 0) {
        throw new ConstraintValidationError(`Validation failed.`, {
          validationErrors: errors,
        });
      }
    } else {
      const errors = await validate({});
      if (errors.length > 0) {
        throw new ConstraintValidationError(`Validation failed.`, {
          validationErrors: errors,
        });
      }
    }
  }

  // Méthode pour exécuter la validation avant d'appeler la méthode apply
  public async execute(input: InputType): Promise<OutputType> {
    await this.validateInput(input);
    return await this.apply(input);
  }
}
