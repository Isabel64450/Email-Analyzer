import { EmailHeader } from './EmailHeader';
import { EmailBody } from './EmailBody';
import { EmailMetadata } from './EmailMetadata';


export class AnalyzedEmail {
  constructor(
    public readonly header: EmailHeader,
    public readonly body: EmailBody,
    public readonly metadata: EmailMetadata
  ) {}
}