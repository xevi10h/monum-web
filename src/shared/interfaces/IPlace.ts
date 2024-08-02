import IPhoto, { IPhotoExisting } from './IPhoto.js';
import { IAddress, IAddressTranslated } from './IAddress.js';
import IUser from './IUser.js';

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
  imagesUrl?: string[];
  createdBy?: IUser;
  createdAt: Date;
  updatedAt: Date;
  deleted?: boolean;
  deletedAt?: Date;
}

export interface IPlaceTranslated
  extends Omit<IPlace, 'address' | 'description'> {
  address: IAddressTranslated;
  description?: string;
  photos?: IPhotoExisting[];
}

export interface IPlacesSearchResults {
  places: IPlaceTranslated[];
  pageInfo: {
    totalPages: number;
    currentPage: number;
    totalResults: number;
  };
}

export interface ICoordinates {
  lat: number;
  lng: number;
}
export interface IPlaceMap {
  id: string;
  name: string;
  address: {
    coordinates: {
      lat: number;
      lng: number;
    };
  };
  importance: number;
}
