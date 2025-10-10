import { EmailHeader } from './EmailHeader';
import { EmailBody } from './EmailBody';
import { EmailMetadata } from './EmailMetadata';
import { EmailAttachment } from './EmailAttachement';

export class EmailMessage {
  constructor(
    public readonly headers: EmailHeader[],
    public readonly body: EmailBody,
    public readonly metadata: EmailMetadata,
    public readonly attachments: EmailAttachment[]
  ) {}
}