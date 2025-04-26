import { Language } from './Language';

export type Locale = 'en' | 'es' | 'ca' | 'fr';
export const LanguageToLocale: Record<Language, Locale> = {
  en_US: 'en',
  es_ES: 'es',
  ca_ES: 'ca',
  fr_FR: 'fr',
};

export const LocaleToLanguage: Record<Locale, Language> = {
  en: 'en_US',
  es: 'es_ES',
  ca: 'ca_ES',
  fr: 'fr_FR',
};
