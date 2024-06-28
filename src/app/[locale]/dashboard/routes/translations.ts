import { Language } from '@/shared/types/Language';

interface TranslationsMap {
  [key: string]: {
    [key: string]: string;
  };
}

const translationsData: TranslationsMap = {
  ca_ES: {
    basicInfo: 'Informació bàsica',
    title: 'Títol',
    description: 'Descripció',
    language: 'Idioma',
  },
  es_ES: {
    basicInfo: 'Información básica',
    title: 'Título',
    description: 'Descripción',
    language: 'Idioma',
  },
  en_US: {
    basicInfo: 'Basic Information',
    title: 'Title',
    description: 'Description',
    language: 'Language',
  },
  fr_FR: {
    basicInfo: 'Informations de base',
    title: 'Titre',
    description: 'Description',
    language: 'Langue',
  },
};

export const translateRoutes = (label: string, language: Language): string => {
  const translationByLanguage = translationsData[language];

  if (!translationByLanguage) {
    throw new Error(`Language '${language}' not supported.`);
  }

  const translation = translationByLanguage[label];
  if (translation === undefined) {
    throw new Error(`Label '${label}' not found for language '${language}'.`);
  }

  return translation;
};
