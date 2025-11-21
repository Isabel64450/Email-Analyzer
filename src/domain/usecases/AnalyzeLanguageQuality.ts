import { EmailAnalyzer } from '@usecases/AbstractAnalyzeEmailUsecase';
import { EmailMessage } from '@domainModels/emailAnalyzer/AnalyzedEmail';
import { LanguageDetector } from '@infra/spellcheck/LanguageDetector';
import dictionaryEn from 'dictionary-en';
import dictionaryFr from 'dictionary-fr';
import nspell from 'nspell';
type Spellchecker = ReturnType<typeof nspell>;



export class SpellCheckAnalyzer extends EmailAnalyzer {
  private readonly fauteSeuil = 5;

  async analyze(email: EmailMessage): Promise<{ score: number; message: string }> {

    
    const text = email.body.content;

    const langRaw = LanguageDetector.detectLanguageCode(text);
    const lang = langRaw === 'fr' ? 'fr' : 'en';

    const fauteCount = await this.countFautesReelles(text, lang);
    /* console.log("🧩 Langue détectée :", lang);
    console.log("🔍 Nombre de fautes détectées :", fauteCount); */
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
  let seuilRatio = 0.15; // 15% de fautes tolérées
  let minFaute = 3;      // au moins 3 fautes pour déclencher

  if (email.body.contentType.toLowerCase().includes('html')) {
    seuilRatio += 0.05;  // tolère un peu plus pour HTML (bruit)
  }

  let score = 0;
  let message = `Orthographe correcte (${fauteCount} fautes sur ${totalWords} mots).`;

  if (fauteCount >= minFaute && ratio > seuilRatio) {
    score = 10;
    message = `Le message contient un taux inhabituel de fautes (${fauteCount}/${totalWords}, soit ${(ratio * 100).toFixed(1)}%).`;
  }

  // --- LOGS pour visualiser les erreurs ---
  /* console.log('=== Language Quality Analysis ===');
  console.log(`Langue détectée: ${lang}`);
  console.log(`Nombre de mots: ${totalWords}`);
  console.log(`Nombre de fautes détectées: ${fauteCount}`);
  console.log(`Ratio fautes/mots: ${(ratio * 100).toFixed(1)}%`);
  console.log(`Seuil ratio: ${(seuilRatio * 100).toFixed(1)}%`);
  console.log(`Score attribué: ${score}`);
  console.log('Message: ', message);
  console.log('================================'); */

  return { score, message };
}

 

  private async countFautesReelles(text: string, lang: 'en' | 'fr'): Promise<number> {
    const spellChecker = await this.loadSpellChecker(lang);
   
       const ignoreList = ["support", "team", "login", "update", "security", "email", "html", "href","span","strong"];
      const words = text
      // Supprime les URLs (ex: https://, http://)
      .replace(/https?:\/\/\S+/gi, '')
      // Supprime les domaines (ex: www.google.com)
      .replace(/\bwww\.[^\s]+\b/gi, '')
      // Supprime les emails (ex: contact@exemple.com)
      .replace(/\b\S+@\S+\.\S+\b/g, '')
      // Supprime tout ce qui n’est pas une lettre, espace, tiret ou apostrophe
      .replace(/[^a-zA-ZÀ-ÿ\s'-]/g, ' ')
      // Convertit en minuscules
      .toLowerCase()
      // Découpe en mots
      .split(/\s+/)
      // Filtre les chaînes vides
      .filter(word => word.length > 2 && !/^[A-Z]+$/.test(word));
      /* console.log("Texte nettoyé :", text);
      console.log("Mots analysés :", words);
 */
    const mistakes = words.filter(word => !spellChecker.correct(word) && !ignoreList.includes(word));
     /* console.log("Mots fautifs :", mistakes);
     console.log("Nombre de fautes détectées :", mistakes.length); */
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