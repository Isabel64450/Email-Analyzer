declare module 'nspell' {
  class NSpell {
    constructor(aff: string, dic: string);
    correct(word: string): boolean;
    suggest(word: string): string[];
  }

  function nspell(aff: string, dic: string): NSpell;

  export default nspell;
}