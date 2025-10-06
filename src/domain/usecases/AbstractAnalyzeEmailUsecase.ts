export abstract class EmailAnalyzer {
  abstract analyze(email: {
    subject: string;
    bodyContent: string;
    contentType: string;
  }): Promise<{
    score: number;
    message: string;
  }>;

  
}