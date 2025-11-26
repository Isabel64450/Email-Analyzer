import { db } from "./MariaDbConnection";
import { MariaDbSuspiciousEmailRepository } from "./SuspiciousEmailRepository";

export const instanciatorMariaDb = new MariaDbSuspiciousEmailRepository(db);