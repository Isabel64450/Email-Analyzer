import express from "express";
import config from "./config/env/env";
import LoggerInstance from "@config/logger/loggerInstance";
import expressLoader from "./config/loaders/ExpressLoader";

export async function launchExpressApp() {
  const app = express();

  await expressLoader({ app: app });

  app
    .listen(config.port, () => {
      LoggerInstance.info(`
      ################################################
      🛡️  Server listening on port: ${config.port} 🛡️
      ################################################
    `);
    })
    .on("error", (err) => {
      LoggerInstance.error("🔥 error: %o", err);
      process.exit(1);
    });
}
