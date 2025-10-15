import * as langdetect from 'langdetect';

export class LanguageDetector {
  static detectLocale(text: string): string {
    const langCode = langdetect.detectOne(text);

    switch (langCode) {
      case 'fr':
        return 'fr-FR';
      case 'en':
        return 'en-US';
      default:
        return 'fr-FR'; // par défaut
    }
  }

  static detectLanguageCode(text: string): string {
    return langdetect.detectOne(text) || 'fr';
  }
}