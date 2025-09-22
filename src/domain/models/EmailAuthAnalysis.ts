
type AuthResult = 'pass' | 'fail' | 'neutral' | 'softfail' | 'temperror' | 'permerror' | 'none' | 'policy' | 'unknown';


interface SPFResult {
  result: AuthResult;
  domain: string;
  ip: string;
  explanation?: string;
}


interface DKIMSignature {
  domain: string;
  selector: string;
  result: AuthResult;
  identity?: string;
}


interface DMARCResult {
  result: AuthResult;
  domain: string;
  policy?: string;
}


interface ARCSet {
  instance: number; 
  seal: {
    result: AuthResult;
    domain: string;
  };
  signature: {
    result: AuthResult;
    domain: string;
  };
  authResults: {
    spf?: SPFResult;
    dkim?: DKIMSignature[];
    dmarc?: DMARCResult;
  };
}


interface EmailAuthAnalysis {
  spf?: SPFResult;
  dkim?: DKIMSignature[];
  dmarc?: DMARCResult;
  arc?: ARCSet[];
}