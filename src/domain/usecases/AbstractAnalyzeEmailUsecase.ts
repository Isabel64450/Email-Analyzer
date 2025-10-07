import { EmailHeader } from '../models/emailAnalyzer/EmailHeader'; 
export abstract class EmailAnalyzer {
  abstract analyze(email: {
    subject?: string;
    bodyContent?: string;
    contentType?: string;
    headers?: EmailHeader[];
  }): Promise<{
    score: number;
    message: string;
  }>;
}