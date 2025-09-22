export abstract class BaseJob {
  // The `run` method must be implemented by any job that extends this class
  abstract run(): Promise<void>;
}
