import { Language } from '../types/Language';

export interface ICity {
  id: string;
  name: string;
  imageUrl?: string;
}

export interface ICityFull {
  id: string;
  name: {
    [key in Language]: string;
  };
  imageUrl?: string;
}
