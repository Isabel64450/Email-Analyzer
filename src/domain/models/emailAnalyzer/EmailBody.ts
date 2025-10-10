export class EmailBody {
  constructor(
    public readonly contentType: string, // text/plain ou text/html
    public readonly content: string,
    public readonly alternativeContent?: { type: string; content: string } // exemple : { type: 'text/html', content: '<html>...' }
  ) {}
}