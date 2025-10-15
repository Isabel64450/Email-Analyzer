import { EmailAnalyzer } from '@usecases/AbstractAnalyzeEmailUsecase';
import { EmailMessage } from '@domainModels/emailAnalyzer/AnalyzedEmail';
import { LanguageDetector } from '@infra/spellcheck/LanguageDetector';
import { loadDictionary } from '@domainUtils/LoadDictionary';

import nspell from 'nspell';


export class SpellCheckAnalyzer extends EmailAnalyzer {
  private readonly fauteSeuil = 3;

  async analyze(email: EmailMessage): Promise<{ score: number; message: string }> {
    const text = email.body.content;

    const lang = LanguageDetector.detectLanguageCode(text); // 'fr' ou 'en'

    const fauteCount = await this.countFautesReelles(text, lang);

    let score = 0;
    let message = 'Orthographe correcte.';

    if (fauteCount > this.fauteSeuil) {
      score += 10;
      message = 'Le texte contient un nombre inhabituel de fautes d’orthographe.';
    }

    return { score, message };
  }

 

  private async countFautesReelles(text: string, lang: string): Promise<number> {
    const spellChecker = await this.loadSpellChecker(lang);

    const words = text
      .toLowerCase()
      .replace(/[^a-zA-ZÀ-ÿ\s'-]/g, '') // nettoie ponctuations
      .split(/\s+/)
      .filter(Boolean);

    const mistakes = words.filter(word => !spellChecker.correct(word));
    return mistakes.length;
  }

private async loadSpellChecker(lang: string): Promise<ReturnType<typeof nspell>> {
  
  try {
    const { aff, dic } = await loadDictionary(lang as 'fr' | 'en');
    const spell = nspell(aff, dic);
    return spell;
  } catch (error) {
    console.error(`[loadSpellChecker] Error loading dictionary for lang=${lang}:`, error);
    throw error;
  }
}
}
 