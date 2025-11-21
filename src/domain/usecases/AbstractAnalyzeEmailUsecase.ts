import { EmailMessage } from '@domainModels/emailAnalyzer/AnalyzedEmail';

export abstract class EmailAnalyzer {
  abstract analyze(email: EmailMessage, userId? :string): Promise<{
    score: number;
    message: string;
  }>;
}