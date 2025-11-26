import { EmailAnalyzer } from '@usecases/AbstractAnalyzeEmailUsecase';
import { EmailMessage } from '@domainModels/emailAnalyzer/AnalyzedEmail';
import { LanguageDetector } from '@infra/spellcheck/LanguageDetector';
import dictionaryEn from 'dictionary-en';
import dictionaryFr from 'dictionary-fr';
import nspell from 'nspell';
import { decode } from "html-entities";
type Spellchecker = ReturnType<typeof nspell>;



export class SpellCheckAnalyzer extends EmailAnalyzer {
 

  async analyze(email: EmailMessage): Promise<{ score: number; message: string }> {

    
    
    const rawText = email.body.content;
    const text = decode(rawText);
    const langRaw = LanguageDetector.detectLanguageCode(text);
    const lang = langRaw === 'fr' ? 'fr' : 'en';

    const fauteCount = await this.countFautesReelles(text, lang);
    
      // Nettoyage pour compter les mots
  const words = text
    .replace(/https?:\/\/\S+/gi, '')         // supprime URLs
    .replace(/\bwww\.[^\s]+\b/gi, '')       // supprime domaines
    .replace(/\b\S+@\S+\.\S+\b/g, '')       // supprime emails
    .replace(/<[^>]+>/g, ' ')               // supprime balises HTML
    .replace(/[^a-zA-ZÀ-ÿ\s'-]/g, ' ')      // supprime caractères spéciaux
    .toLowerCase()
    .split(/\s+/)
    .filter(word => word.length > 2 && !/^[A-Z]+$/.test(word));

  const totalWords = words.length;
  const ratio = totalWords > 0 ? fauteCount / totalWords : 0;

  // Seuil dynamique
  let seuilRatio = 0.20; // 15% de fautes tolérées
  let minFaute = 5;      // au moins 3 fautes pour déclencher

  if (email.body.contentType.toLowerCase().includes('html')) {
    seuilRatio += 0.05;  // tolère un peu plus pour HTML (bruit)
  }

  let score = 0;
  let message = `Orthographe correcte (${fauteCount} fautes sur ${totalWords} mots).`;

  if (fauteCount >= minFaute && ratio > seuilRatio) {
    score = 10;
    message = `Le message contient un taux inhabituel de fautes (${fauteCount}/${totalWords}, soit ${(ratio * 100).toFixed(1)}%).`;
  }

  return { score, message };
}

 

  private async countFautesReelles(text: string, lang: 'en' | 'fr'): Promise<number> {
    const spellChecker = await this.loadSpellChecker(lang);
   
       const ignoreList = ["support", "team", "login", "update", "security", "email", "html", "href","span","strong","rejoignez", "réunion", "numéro", "code", "secret", "options","le","la","les","des","une","un","est","vous","nous",
    "réunion","maintenant","besoin","organisateurs","merci"];
       const cleanedText = decode(text)
    .replace(/https?:\/\/\S+/gi, '')
    .replace(/\bwww\.[^\s]+\b/gi, '')
    .replace(/\b\S+@\S+\.\S+\b/g, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/[^a-zA-ZÀ-ÿ0-9'\s-]/g, ' ')
    .toLowerCase()
    .split(/\s+/);

  const words = cleanedText
      .flatMap(w => w.includes("'") ? w.split("'") : [w])  
    .filter(w => w.length > 2)
    .filter(w => !/^\d/.test(w))                         
    .filter(w => !w.includes('-'))                       
    .filter(w => !ignoreList.includes(w));       

  const mistakes = words.filter(word => !spellChecker.correct(word));
    
    return mistakes.length;
  }

  private async loadSpellChecker(lang: 'en' | 'fr'): Promise<Spellchecker> {
    const dictionaryLoader = lang === 'fr' ? dictionaryFr : dictionaryEn;

    return new Promise((resolve, reject) => {
      dictionaryLoader((error: NodeJS.ErrnoException | undefined, dict) => {
        if (error) {
          return reject(error);
        }
        try {
          const spell = nspell(dict);
          resolve(spell);
        } catch (e) {
          reject(e);
        }
      });
    });
  }
  
}