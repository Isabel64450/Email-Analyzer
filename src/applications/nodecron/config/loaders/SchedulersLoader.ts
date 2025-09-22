import { BaseScheduler } from "@applications/nodecron/schedulers/BaseScheduler";
import LoggerInstance from "@config/logger/loggerInstance";
import fs from "fs";
import path from "path";

export class SchedulersLoader {
  private schedulersFolderPath: string;

  constructor() {
    this.schedulersFolderPath = path.join(__dirname, "../../schedulers");
  }

  async loadSchedulers(): Promise<BaseScheduler[]> {
    const schedulerInstances: BaseScheduler[] = [];

    const schedulerFiles = this.getSchedulerFiles();

    for (const file of schedulerFiles) {
      const schedulerInstance = await this.instantiateScheduler(file);
      if (schedulerInstance) {
        schedulerInstances.push(schedulerInstance);
      }
    }

    return schedulerInstances;
  }

  // Method to read and filter scheduler files
  private getSchedulerFiles(): string[] {
    const files = fs.readdirSync(this.schedulersFolderPath);

    // Filter files that start with a lowercase letter and end with 'Scheduler.ts'
    return files.filter((file) => /^[a-z].*Scheduler\.ts$/.test(file));
  }

  // Method to construct the class name from the file name
  private constructClassName(fileName: string): string {
    return fileName
      .replace(/^[a-z]/, (char) => char.toUpperCase())
      .replace(".ts", "");
  }

  // Method to dynamically import and instantiate the scheduler class
  private async instantiateScheduler(
    file: string
  ): Promise<BaseScheduler | null> {
    const filePath = path.join(this.schedulersFolderPath, file);
    const className = this.constructClassName(file);

    try {
      const module = await import(filePath);
      const SchedulerClass = module[className];

      // Check if the class extends BaseScheduler
      if (SchedulerClass && SchedulerClass.prototype instanceof BaseScheduler) {
        return new SchedulerClass();
      } else {
        LoggerInstance.error(
          `Scheduler in ${file} does not extend BaseScheduler or class name doesn't match.`
        );
      }
    } catch (error) {
      LoggerInstance.error(`Failed to import scheduler from ${file}: ${error}`);
    }

    return null;
  }
}
