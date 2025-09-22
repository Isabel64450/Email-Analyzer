import LoggerInstance from "@config/logger/loggerInstance";
import GlobalErrorHandler from "@applications/nodecron/errors/handlers/globalErrorHandler";
import { BaseError } from "@domainErrors/BaseError";

export async function runWithGlobalErrorHandler(
  job: () => Promise<void>,
  jobName: string
): Promise<void> {
  try {
    LoggerInstance.info(`🚀 Running ${jobName}...`);
    await job();
    LoggerInstance.info(`✅ ${jobName} completed successfully!`);
  } catch (error: unknown) {
    GlobalErrorHandler.handle(error as BaseError);
  }
}
