import LoggerInstance from "@config/logger/loggerInstance";
import { BaseUsecase } from "@usecases/BaseUsecase";

export class BasicUsecase extends BaseUsecase<null, void> {
  constructor() {
    super();
  }

  protected async apply(input: null): Promise<void> {
    LoggerInstance.info("✌️ Basic usecase called !");
    return;
  }
}
