import * as nodemailer from "nodemailer";
import { EmailSenderPort } from "@ports/EmailSenderPort";
import { CouldntSendEmailError } from "@domainErrors/CouldntSendEmailError";
import config from "@envConfig";

export class GmailEmailSenderAdapter implements EmailSenderPort {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: config.mailer.user,
        pass: config.mailer.pass,
      },
    });
  }

  async sendEmails(
    from: string,
    emailList: string[],
    message: string
  ): Promise<void> {
    const mailOptions = {
      from: from,
      to: emailList,
      subject: "News of the day 😘",
      text: message,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log("Emails sent successfully");
    } catch (error) {
      console.error("Error sending emails:", error);
      throw new CouldntSendEmailError("Failed to send emails");
    }
  }
}
