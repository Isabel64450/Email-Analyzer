export interface EmailFetcher {
  fetchMessage(userId: string, messageId: string): Promise<any>;
}