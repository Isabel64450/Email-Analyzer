import { EmailMessage } from '../models/emailAnalyzer/AnalyzedEmail';

export interface MessageProvider {
  getMessageById(userId: string, messageId: string): Promise<EmailMessage>;
}