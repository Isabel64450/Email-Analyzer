export interface SuspiciousEmail {
  messageId: string;
  sender: string;
  recipient: string;
  subject?: string;
  receivedAt: Date;
  totalScore: number;
  analyses: Record<string, any>;
  rawHeaders: string;
  bodyPreview?: string;
}