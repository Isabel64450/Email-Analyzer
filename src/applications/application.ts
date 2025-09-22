import LoggerInstance from "@config/logger/loggerInstance";
import envConfig from "@envConfig";
import { launchExpressApp } from "@applications/express/app";
import { launchNodeCronApp } from "@applications/nodecron/app";

export function launchApplication() {
  const applications = envConfig.applications;

  if (applications?.includes("express")) {
    launchExpressApp();
  }

  if (applications?.includes("nodecron")) {
    launchNodeCronApp();
  }

  if (
    !applications?.includes("express") &&
    !applications?.includes("nodecron")
  ) {
    LoggerInstance.error(
      'Invalid APPLICATIONS value. Please set APPLICATIONS to "express", "nodecron", or both.'
    );
  }
}

launchApplication();
