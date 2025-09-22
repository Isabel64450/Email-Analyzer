import envConfig from "@envConfig";
import LoggerInstance from "@config/logger/loggerInstance";
import { LLMRequestError } from "@domainErrors/LLMRequestError";
import { sendAlert } from "@applications/express/utils/sendAlert";

export function LLMRequestErrorHandler(error: LLMRequestError): void {
  if (envConfig.env === "development") {
    LoggerInstance.error("🔥 error: %o", error);
  } else {
    // In production, alert the dev team or trigger a notification
    sendAlert({
      title: "🚨 Could not send email in cron job",
      message: `Error occurred: ${error.message}`,
      timestamp: error.timestamp,
      context: error.context,
    });
  }

  // TODO handle error
}
