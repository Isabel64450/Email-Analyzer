import { BasicUsecase } from "@usecases/BasicUsecase";
import { runWithGlobalErrorHandler } from "@applications/nodecron/utils/runWithGlobalErrorHandler";
import { BaseJob } from "@applications/nodecron/jobs/BaseJob";

export class FirstJob extends BaseJob {
  private basicUsecase: BasicUsecase;

  constructor() {
    super();
    this.basicUsecase = new BasicUsecase();
  }

  // Implements the `run` method with the job logic
  async run(): Promise<void> {
    await runWithGlobalErrorHandler(
      () => this.basicUsecase.execute(null),
      "First job"
    );
  }
}
