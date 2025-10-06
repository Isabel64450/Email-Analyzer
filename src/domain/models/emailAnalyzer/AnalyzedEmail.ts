import { EmailHeader } from './EmailHeader';
import { EmailBody } from './EmailBody';
import { EmailMetadata } from './EmailMetadata';


export class EmailMessage {
  constructor(
    public readonly headers: EmailHeader[],
    public readonly body: EmailBody,
    public readonly metadata: EmailMetadata
  ) {}
}