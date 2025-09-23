export abstract class ScoringStep {
 
  abstract analyze(emailContent: string): number;
}