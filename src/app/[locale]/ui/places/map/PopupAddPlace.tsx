'use client';
import { PlusIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { montserrat } from '../../fonts';
import { Link } from '@/navigation';
import { Popup } from 'react-map-gl';
import { useTranslations } from 'next-intl';

interface PopupAddPlaceProps {
  closePopup: () => void;
  coordinates: { lat: number; lng: number };
}

const PopupAddPlace: React.FC<PopupAddPlaceProps> = ({
  closePopup,
  coordinates,
}) => {
  const t = useTranslations('MonumsMap');
  return (
    <Popup
      key={`[${coordinates.lng.toString()},${coordinates.lat.toString()}]`}
      latitude={coordinates.lat}
      longitude={coordinates.lng}
      closeOnClick={false}
      closeButton={false}
    >
      <div className="w-full rounded-lg px-2 py-2">
        <div
          className={`${montserrat.className} mb-4 rounded-lg text-center text-base
      `}
        >
          {t('whatDoYouWant')}
        </div>
        <div className="flex flex-row space-x-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              closePopup();
            }}
            className="flex h-8 items-center justify-center rounded-lg bg-gray-100 px-2 text-gray-600"
          >
            <span
              className={`${montserrat.className}`}
              style={{ fontSize: '10px' }}
            >
              {t('cancel')}
            </span>
            <XMarkIcon className="ml-1 h-4" />
          </button>
          <Link
            href={{
              pathname: '/dashboard/places/create',
              query: {
                defaultLat: coordinates.lat,
                defaultLng: coordinates.lng,
              },
            }}
            className="flex h-8 items-center justify-center rounded-lg bg-monum-green-default px-2 text-white"
          >
            <span
              className={`${montserrat.className}`}
              style={{ fontSize: '10px' }}
            >
              {t('addMonum')}
            </span>
            <PlusIcon className="ml-1 h-4" />
          </Link>
        </div>
        <button onClick={closePopup} className={`absolute right-2 top-2`}>
          <XMarkIcon className="h-5" />
        </button>
      </div>
    </Popup>
  );
};

export default PopupAddPlace;
