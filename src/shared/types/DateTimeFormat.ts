import { Language } from './Language';
import { Locale } from './Locale';

export type DateTimeFormat = 'en-US' | 'es-ES' | 'ca-ES' | 'fr-FR';
export const LanguageToDateTimeFormat: Record<Language, DateTimeFormat> = {
  en_US: 'en-US',
  es_ES: 'es-ES',
  ca_ES: 'ca-ES',
  fr_FR: 'fr-FR',
};
export const LocaleToDateTimeFormat: Record<Locale, DateTimeFormat> = {
  en: 'en-US',
  es: 'es-ES',
  ca: 'ca-ES',
  fr: 'fr-FR',
};
