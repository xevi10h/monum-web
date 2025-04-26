import { Language } from '@/shared/types/Language';

interface TranslationsMap {
  [key: string]: {
    [key: string]: string;
  };
}

const translationsData: TranslationsMap = {
  ca_ES: {
    medias: 'Recursos',
    title: 'Títol',
    type: 'Tipus de recurs',
    text: 'Text',
    textDescription: 'Introdueix el text del recurs',
    mediaMark: 'Qualificació del recurs',
    cancel: 'Cancel·lar',
    save: 'Guardar Recurs',
    create: 'Afegir Recurs',
    typeText: 'Text',
    typeAudio: 'Àudio',
    typeVideo: 'Vídeo',
    videoDescription: 'Vídeo (en format ',
    grabOrAddVideo:
      'Arrossega i deixa anar un fitxer de vídeo aquí o fes clic per seleccionar un fitxer.',
    formatNotSupported: 'Format de vídeo no suportat',
    basicInfo: 'Informació bàsica',
    language: 'Idioma',
  },
  es_ES: {
    medias: 'Recursos',
    title: 'Título',
    type: 'Tipo de recurso',
    text: 'Texto',
    textDescription: 'Introduce el texto del recurso',
    mediaMark: 'Calificación del recurso',
    cancel: 'Cancelar',
    save: 'Guardar recurso',
    create: 'Agregar recurso',
    typeText: 'Texto',
    typeAudio: 'Audio',
    typeVideo: 'Vídeo',
    videoDescription: 'Vídeo (en formato ',
    grabOrAddVideo:
      'Arrastra y suelta un archivo de vídeo aquí o haz clic para seleccionar un archivo.',
    formatNotSupported: 'Formato de vídeo no soportado',
    basicInfo: 'Información básica',
    language: 'Idioma',
  },
  en_US: {
    medias: 'Media',
    title: 'Title',
    type: 'Media Type',
    text: 'Text',
    textDescription: 'Enter the text of the media',
    mediaMark: 'Media Rating',
    cancel: 'Cancel',
    save: 'Save Media',
    create: 'Add Media',
    typeText: 'Text',
    typeAudio: 'Audio',
    typeVideo: 'Video',
    videoDescription: 'Video (in format ',
    grabOrAddVideo:
      'Drag and drop a video file here or click to select a file.',
    formatNotSupported: 'Video format not supported',
    basicInfo: 'Basic Information',
    language: 'Language',
  },
  fr_FR: {
    medias: 'Médias',
    title: 'Titre',
    type: 'Type de média',
    text: 'Texte',
    textDescription: 'Entrez le texte du média',
    mediaMark: 'Note du média',
    cancel: 'Annuler',
    save: 'Ajouter un média',
    create: 'Créer un média',
    typeText: 'Texte',
    typeAudio: 'Audio',
    typeVideo: 'Vidéo',
    videoDescription: 'Vidéo (au format ',
    grabOrAddVideo:
      'Glissez-déposez un fichier vidéo ici ou cliquez pour en sélectionner un.',
    formatNotSupported: 'Format vidéo non supporté',
    basicInfo: 'Informations de base',
    language: 'Langue',
  },
};

export const translateMedias = (label: string, language: Language): string => {
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
