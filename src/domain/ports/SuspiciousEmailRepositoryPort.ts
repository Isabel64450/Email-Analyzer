import { SuspiciousEmail } from "@domainModels/emailAnalyzer/SuspiciousEmail";

export interface SuspiciousEmailRepositoryPort {
  save(email: SuspiciousEmail): Promise<void>;
}