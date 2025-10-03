export class EmailMetadata {
  constructor(
    public readonly id: string,
    public readonly subject: string,
    public readonly from: string,
    public readonly sentDateTime: Date,
    public readonly receivedDateTime: Date,    
    public readonly conversationId?: string,
    public readonly webLink?: string
  ) {}
}