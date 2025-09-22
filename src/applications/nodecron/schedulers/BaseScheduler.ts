// src/applications/nodecron/schedulers/BaseScheduler.ts

import cron, { ScheduledTask } from "node-cron";
import { BaseJob } from "@applications/nodecron/jobs/BaseJob";

export abstract class BaseScheduler {
  protected cronTiming: string;
  protected job: BaseJob;
  protected scheduledTask: ScheduledTask | null = null;

  constructor(cronTiming: string, job: BaseJob) {
    this.cronTiming = cronTiming;
    this.job = job;
  }

  // Method to define and return the cron scheduler
  getScheduler(): ScheduledTask {
    if (!this.scheduledTask) {
      this.scheduledTask = cron.schedule(
        this.cronTiming,
        () => this.job.run(),
        { scheduled: false }
      );
    }
    return this.scheduledTask;
  }

  // Method to start the cron scheduler
  startScheduler(): void {
    const scheduler = this.getScheduler();
    scheduler.start();
  }
}
