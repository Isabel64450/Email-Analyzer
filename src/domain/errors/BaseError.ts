export abstract class BaseError extends Error {
  public readonly name: string;
  public readonly message: string;
  public readonly context?: Record<string, unknown>;
  public readonly timestamp: Date;

  constructor(
    name: string,
    message: string,
    context?: Record<string, unknown>
  ) {
    super(message);
    this.name = name;
    this.message = message;
    this.context = context;
    this.timestamp = new Date();

    // Ensure the name of this error is the same as the class name
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
