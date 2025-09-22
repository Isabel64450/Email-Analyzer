import { SchedulersLoader } from "@applications/nodecron/config/loaders/SchedulersLoader";
import LoggerInstance from "@config/logger/loggerInstance";

export async function launchNodeCronApp() {
  LoggerInstance.info(`
    ###########################
    🛡️  Launching cron jobs  🛡️
    ###########################
  `);
  const schedulers = await new SchedulersLoader().loadSchedulers();
  schedulers.forEach((scheduler) => {
    scheduler.startScheduler();
  });
}
