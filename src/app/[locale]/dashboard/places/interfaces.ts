import { IAddress } from '@/shared/interfaces/IAddress';
import IPhoto from '@/shared/interfaces/IPhoto';

export interface Coordinates {
  lat: number;
  lng: number;
}
export interface Address {
  street: string;
  city: string;
  country: string;
  postalCode: string;
  province: string;
  coordinates: Coordinates;
}

export interface IPlace {
  id: string;
  name: string;
  nameTranslations: {
    [key: string]: string;
  };
  address: IAddress;
  description: {
    [key: string]: string;
  };
  importance: number;
  photos?: IPhoto[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Place {
  id: string;
  name: string;
  description?: string;
  address: Address;
  importance: number;
  coordinates?: Coordinates;
  createdAt: Date;
  updatedAt: Date;
}
