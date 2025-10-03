export class EmailBody {
  constructor(
    public readonly contentType: string,
    public readonly content: string
  ) {}
}