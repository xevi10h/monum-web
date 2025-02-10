import { Language } from '@/shared/types/Language';

interface TranslationsMap {
  [key: string]: {
    [key: string]: string | ((...args: any[]) => string);
  };
}

const translationsData: TranslationsMap = {
  ca_ES: {
    basicInfo: 'Informació bàsica',
    title: 'Títol',
    description: 'Descripció',
    language: 'Idioma',
    addStops: 'Afegir parades',
    updatedAt: 'Última actualització',
    mediasSelected: 'Recursos seleccionats de la parada',
    cancel: 'Cancel·lar',
    save: 'Guardar els canvis',
    chooseMultipleStops: 'Escull quines parades vols afegir a la ruta',
    searchMonums: 'Busca monums...',
    searchMedias: 'Busca recursos...',
    createRoute: 'Crear ruta',
    city: 'Ciutat',
    searchCity: 'Cerca una ciutat',
    selectCity: 'Selecciona una ciutat',
    monumsAndMediasSelected({
      monumsSelected,
      mediasSelected,
    }: {
      monumsSelected: number;
      mediasSelected: number;
    }): string {
      return `Has seleccionat ${monumsSelected} monums i ${mediasSelected} recursos`;
    },
  },
  es_ES: {
    basicInfo: 'Información básica',
    title: 'Título',
    description: 'Descripción',
    language: 'Idioma',
    addStops: 'Añadir paradas',
    updatedAt: 'Última actualización',
    mediasSelected: 'Recursos seleccionados de la parada',
    cancel: 'Cancelar',
    save: 'Guardar los cambios',
    searchMonums: 'Buscar monums...',
    searchMedias: 'Buscar recursos...',
    chooseMultipleStops: 'Elige qué paradas deseas agregar a la ruta',
    createRoute: 'Crear ruta',
    city: 'Ciudad',
    searchCity: 'Buscar una ciudad',
    selectCity: 'Selecciona una ciudad',
    monumsAndMediasSelected({
      monumsSelected,
      mediasSelected,
    }: {
      monumsSelected: number;
      mediasSelected: number;
    }): string {
      return `Has seleccionado ${monumsSelected} monums y ${mediasSelected} recursos`;
    },
  },
  en_US: {
    basicInfo: 'Basic Information',
    title: 'Title',
    description: 'Description',
    language: 'Language',
    addStops: 'Add stops',
    updatedAt: 'Last update',
    mediasSelected: 'Selected resources from the stop',
    cancel: 'Cancel',
    save: 'Save changes',
    searchMonums: 'Search monums...',
    searchMedias: 'Search media...',
    chooseMultipleStops: 'Choose which stops you want to add to the route',
    createRoute: 'Create route',
    city: 'City',
    searchCity: 'Search a city',
    selectCity: 'Select a city',
    monumsAndMediasSelected({
      monumsSelected,
      mediasSelected,
    }: {
      monumsSelected: number;
      mediasSelected: number;
    }): string {
      return `You have selected ${monumsSelected} monums and ${mediasSelected} media`;
    },
  },
  fr_FR: {
    basicInfo: 'Informations de base',
    title: 'Titre',
    description: 'Description',
    language: 'Langue',
    addStops: 'Ajouter des arrêts',
    updatedAt: 'Dernière mise à jour',
    mediasSelected: "Ressources sélectionnées de l'arrêt",
    cancel: 'Annuler',
    save: 'Enregistrer les modifications',
    searchMonums: 'Rechercher des monums...',
    searchMedias: 'Rechercher des médias...',
    chooseMultipleStops:
      "Choisissez les arrêts que vous souhaitez ajouter à l'itinéraire",
    createRoute: 'Créer un itinéraire',
    city: 'Ville',
    searchCity: 'Rechercher une ville',
    selectCity: 'Sélectionnez une ville',
    monumsAndMediasSelected({
      monumsSelected,
      mediasSelected,
    }: {
      monumsSelected: number;
      mediasSelected: number;
    }): string {
      return `Vous avez sélectionné ${monumsSelected} monums et ${mediasSelected} médias`;
    },
  },
};

export const translateRoutes = (
  label: string,
  language: Language,
  values?: any,
): string => {
  const translationByLanguage = translationsData[language];

  if (!translationByLanguage) {
    throw new Error(`Language '${language}' not supported.`);
  }

  const translation = translationByLanguage[label];
  if (translation === undefined) {
    throw new Error(`Label '${label}' not found for language '${language}'.`);
  }

  if (typeof translation === 'function') {
    return translation(values);
  }

  return translation;
};
