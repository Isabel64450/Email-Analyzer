declare module 'langdetect' {
  export function detect(text: string): { lang: string; probability: number }[];
  export function detectOne(text: string): string;
}