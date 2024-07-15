import { Language } from '../types/Language.js';
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
  createdBy?: IUser;
  createdAt: Date;
  updatedAt: Date;
  deleted?: boolean;
  deletedAt?: Date;
  stopsCount?: number;
}

export interface IRouteSimplified
  extends Omit<IRoute, 'title' | 'description' | 'stops'> {
  title: {
    [key in Language]: string;
  };
  description: {
    [key in Language]: string;
  };
  stops?: IStopTranslated[];
}

export interface IRouteTranslated
  extends Omit<IRoute, 'title' | 'description' | 'stops'> {
  title: string;
  description: string;
  stops?: IStopTranslated[];
}
