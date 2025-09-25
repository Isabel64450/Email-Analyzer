export abstract class ScoringStep {
 
 protected score = 0
 
 protected reasons: string[] =[]



  abstract analyze(emailContent: string): { score: number; reasons: string[] };
}