export class EmailAttachment {
  constructor(
    public readonly name: string,
    public readonly mimeType?: string,
    public readonly isEncrypted?: boolean
  ) {}

  get extension(): string {
    const parts = this.name.split('.');
    return parts.length > 1 ? parts.pop()!.toLowerCase() : '';
  }
}