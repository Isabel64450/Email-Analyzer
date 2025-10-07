export interface WhoisDomainInfoProvider {
  getDomainCreationDate(domain: string): Promise<Date | null>;
}