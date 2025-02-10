import { Language } from '../types/Language.js';
import { ICity, ICityFull } from './ICity.js';
import { IStop, IStopTranslated } from './IStop.js';
import IUser from './IUser.js';

export interface IRoute {
  id: string;
  title: {
    [key in Language]: string;
  };
  description: {
    [key in Language]: string;
  };
  rating?: number;
  stops?: IStop[];
  duration?: number;
  optimizedDuration?: number;
  distance?: number;
  optimizedDistance?: number;
  cityId?: string;
  city?: ICityFull;
  createdBy?: IUser;
  createdAt: Date;
  updatedAt: Date;
  deleted?: boolean;
  deletedAt?: Date;
  stopsCount?: number;
}

export interface IRouteSimplified
  extends Omit<IRoute, 'title' | 'description' | 'stops' | 'city'> {
  title: {
    [key in Language]: string;
  };
  description: {
    [key in Language]: string;
  };
  city: ICity;
  stops?: IStopTranslated[];
}

export interface IRouteTranslated
  extends Omit<IRoute, 'title' | 'description' | 'stops' | 'city'> {
  title: string;
  description: string;
  city: ICity;
  stops?: IStopTranslated[];
}
