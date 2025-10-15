import fs from 'fs/promises';
import path from 'path';

export async function loadDictionary(lang: 'fr' | 'en'): Promise<{ aff: string; dic: string }> {
  const basePath = path.resolve(__dirname, '../../../dictionaries');
  const affPath = path.join(basePath, `${lang}.aff`);
  const dicPath = path.join(basePath, `${lang}.dic`);

  try {
    const [aff, dic] = await Promise.all([
      fs.readFile(affPath, 'utf-8'),
      fs.readFile(dicPath, 'utf-8')
    ]);
    return { aff, dic };
  } catch (err) {
    console.error(`[loadDictionary] Failed to load files for language ${lang}`, err);
    throw err;
  }
}