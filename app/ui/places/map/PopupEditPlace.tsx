'use client';
import { Popup } from 'react-map-gl';
import { montserrat } from '../../fonts';
import {
  DeletePlace,
  NavigateToMedias,
  NavigateToPhotos,
  UpdatePlace,
} from '@/app/ui/places/buttons';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { PlaceMap } from '@/app/dashboard/places/interfaces';

interface PopupEditPlaceProps {
  place: PlaceMap;
  closePopup: () => void;
}

const PopupEditPlace: React.FC<PopupEditPlaceProps> = ({
  place,
  closePopup,
}) => {
  return (
    <Popup
      key={place.id}
      latitude={place.address.coordinates.lat}
      longitude={place.address.coordinates.lng}
      closeOnClick={false}
      anchor="bottom"
      offset={[0, -50] as [number, number]}
      closeButton={false}
      style={{
        minWidth: '250px',
        alignItems: 'space-between',
        justifyContent: 'center',
      }}
    >
      <div className="w-full items-stretch justify-items-center rounded-lg px-4 py-2">
        <div
          className={`${montserrat.className} mb-4 rounded-lg text-center text-base
      `}
        >
          {place.name}
        </div>

        <div className="flex w-full flex-row items-stretch justify-between">
          <UpdatePlace id={place.id} />
          <NavigateToMedias id={place.id} />
          <NavigateToPhotos id={place.id} />
          <DeletePlace id={place.id} />
        </div>
        <button onClick={closePopup} className={`absolute right-2 top-2`}>
          <XMarkIcon className="h-5" />
        </button>
      </div>
    </Popup>
  );
};

export default PopupEditPlace;
