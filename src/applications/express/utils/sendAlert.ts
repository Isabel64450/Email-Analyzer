import nodemailer from "nodemailer";
import envConfig from "@envConfig";
import LoggerInstance from "@config/logger/loggerInstance";

interface AlertOptions {
  title: string;
  message: string;
  timestamp: Date;
  context?: Record<string, unknown>;
}

export async function sendAlert(alertOptions: AlertOptions): Promise<void> {
  try {
    // Create a transporter for sending emails
    const transporter = nodemailer.createTransport({
      service: "gmail",
      secure: true,
      auth: {
        user: envConfig.mailer.user,
        pass: envConfig.mailer.pass,
      },
    });

    const mailOptions = {
      from: envConfig.mailer.alertUser,
      to: envConfig.mailer.alertUser,
      subject: `🚨 ${alertOptions.title}`,
      text: `${alertOptions.message}\n\nTimestamp: ${
        alertOptions.timestamp
      }\nContext: ${
        alertOptions.context ? JSON.stringify(alertOptions.context) : "None"
      }`,
    };

    // Send the email
    await transporter.sendMail(mailOptions);

    LoggerInstance.info(`📧 Alert sent successfully: ${alertOptions.title}`);
  } catch (error) {
    LoggerInstance.error("❌ Failed to send alert email: ", error);
  }
}
