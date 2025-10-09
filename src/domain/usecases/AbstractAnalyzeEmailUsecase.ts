import { EmailMessage } from '@domainModels/emailAnalyzer/AnalyzedEmail';

export abstract class EmailAnalyzer {
  abstract analyze(email: EmailMessage): Promise<{
    score: number;
    message: string;
  }>;
}