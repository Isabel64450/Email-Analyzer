import { FirstJob } from "@applications/nodecron/jobs/firstJob";
import { BaseScheduler } from "@applications/nodecron/schedulers/BaseScheduler";

// Instantiate the first job
const firstJob = new FirstJob();

// Define the first job scheduler class extending BaseScheduler
export class FirstJobScheduler extends BaseScheduler {
  constructor() {
    super("*/2 * * * * *", firstJob); // Pass the cron timing and job to the base scheduler
  }
}
