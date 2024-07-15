import { IMedia, IMediaTranslated } from './IMedia';
import { IPlace, IPlaceTranslated } from './IPlace';

export interface IStopSimplified {
  order: number;
  optimizedOrder?: number;
  medias: IMedia[];
  place: IPlace;
}

export interface IStopTranslated {
  order: number;
  optimizedOrder?: number;
  medias: IMediaTranslated[];
  place: IPlaceTranslated;
}

export interface IStopReduced {
  order: number;
  optimizedOrder?: number;
  mediasIds: string[];
  placeId: string;
}
