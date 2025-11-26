import { SuspiciousEmailRepositoryPort } from "../../domain/ports/SuspiciousEmailRepositoryPort";
import { SuspiciousEmail } from "@domainModels/emailAnalyzer/SuspiciousEmail";
import { Pool } from "mariadb";

export class MariaDbSuspiciousEmailRepository implements SuspiciousEmailRepositoryPort {
  constructor(private readonly pool: Pool) {}

  async save(email: SuspiciousEmail): Promise<void> {
    try {
      await this.pool.query(
        `INSERT INTO suspicious_emails 
          (message_id, sender, recipient, subject, received_at, total_score, analyses, raw_headers, body_preview)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          email.messageId,
          email.sender,
          email.recipient,
          email.subject ?? null,
          email.receivedAt,
          email.totalScore,
          JSON.stringify(email.analyses),
          email.rawHeaders,
          email.bodyPreview ?? null
        ]
      );
    } catch (err) {
      console.error("Erreur SQL lors de saveSuspiciousEmail:", err);
      throw err;
    }
  }

async exists(messageId: string): Promise<boolean> {
    try {
      const result = await this.pool.query(
        `SELECT COUNT(1) AS count FROM suspicious_emails WHERE message_id = ?`,
        [messageId]
      );
      // mariadb retourne un array de RowDataPacket
      return result[0].count > 0;
    } catch (err) {
      console.error("Erreur SQL lors de exists:", err);
      throw err;
    }
  }











}