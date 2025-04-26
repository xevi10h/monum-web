import { Language } from '@/shared/types/Language';

interface TranslationsMap {
  [key: string]: {
    [key: string]: string;
  };
}

const translationsData: TranslationsMap = {
  ca_ES: {
    editMonum: 'Edita el monum',
    addMonum: 'Afegir un monum',
    basicInfo: 'Informació bàsica',
    name: 'Nom',
    description: 'Descripció',
    importance: 'Importància',
    address: 'Adreça',
    completeAddress: 'Adreça completa',
    city: 'Ciutat',
    country: 'País',
    postalCode: 'Codi postal',
    province: 'Província',
    latitude: 'Latitud',
    longitude: 'Longitud',
    cancel: 'Cancel·lar',
    save: 'Guardar els canvis',
    saveNew: 'Afegir Monum',
    language: 'Idioma',
  },
  es_ES: {
    editMonum: 'Editar el monum',
    addMonum: 'Agregar un monum',
    basicInfo: 'Información básica',
    name: 'Nombre',
    description: 'Descripción',
    importance: 'Importancia',
    address: 'Dirección',
    completeAddress: 'Dirección completa',
    city: 'Ciudad',
    country: 'País',
    postalCode: 'Código postal',
    province: 'Provincia',
    latitude: 'Latitud',
    longitude: 'Longitud',
    cancel: 'Cancelar',
    save: 'Guardar los cambios',
    saveNew: 'Agregar Monum',
    language: 'Idioma',
  },
  en_US: {
    editMonum: 'Edit Monum',
    addMonum: 'Add a Monum',
    basicInfo: 'Basic Information',
    name: 'Name',
    description: 'Description',
    importance: 'Importance',
    address: 'Address',
    completeAddress: 'Complete Address',
    city: 'City',
    country: 'Country',
    postalCode: 'Postal Code',
    province: 'Province',
    latitude: 'Latitude',
    longitude: 'Longitude',
    cancel: 'Cancel',
    save: 'Save Changes',
    saveNew: 'Add Monum',
    language: 'Language',
  },
  fr_FR: {
    editMonum: 'Modifier le monum',
    addMonum: 'Ajouter un monum',
    basicInfo: 'Informations de base',
    name: 'Nom',
    description: 'Description',
    importance: 'Importance',
    address: 'Adresse',
    completeAddress: 'Adresse complète',
    city: 'Ville',
    country: 'Pays',
    postalCode: 'Code postal',
    province: 'Province',
    latitude: 'Latitude',
    longitude: 'Longitude',
    cancel: 'Annuler',
    save: 'Enregistrer les modifications',
    saveNew: 'Ajouter un monum',
    language: 'Langue',
  },
};

export const translatePlaces = (label: string, language: Language): string => {
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
