import LoggerInstance from "@config/logger/loggerInstance";
import { Router } from "express";
import fs from "fs";
import path from "path";

export class RoutersLoader {
  private readonly router: Router;
  private readonly routersDir: string = path.join(
    process.cwd(),
    "src",
    "applications",
    "express",
    "api",
    "routes"
  );

  constructor() {
    this.router = Router();
  }

  public loadRoutes(): Router {
    LoggerInstance.info("🚀 Running Routes loader...");
    // Read all router files from the specified directory
    fs.readdirSync(this.routersDir).forEach((file) => {
      // Ensure we're importing only TypeScript or JavaScript files
      if (file.endsWith(".ts")) {
        const routerPath = path.join(this.routersDir, file);
        const routerModule = require(routerPath);
        const routeInitializer = routerModule.default || routerModule;

        if (typeof routeInitializer === "function") {
          routeInitializer(this.router);
          LoggerInstance.info(
            `✅ Loaded router ${file.slice(0, file.length - 3)}`
          );
        } else {
          LoggerInstance.warn(
            `⚠️ Skipping ${file} as it does not export a function`
          );
        }
      }
    });

    LoggerInstance.info("✅ Routes loaded");
    return this.router;
  }
}
