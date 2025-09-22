export interface EmailSenderPort {
  sendEmails(from: string, emailList: string[], message: string): Promise<void>;
}
