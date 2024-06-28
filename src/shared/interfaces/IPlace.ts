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
  imagesUrl?: string[];
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
