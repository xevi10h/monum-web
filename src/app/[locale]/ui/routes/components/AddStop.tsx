import { useState, useEffect, useRef } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Locale } from '@/shared/types/Locale';
import { LocaleToDateTimeFormat } from '@/shared/types/DateTimeFormat';
import { VariablesOf, graphql } from '@/graphql';
import { useQuery } from '@apollo/client';
import Image from 'next/image';

const getPlacesToAddStop = graphql(`
  query Places($textSearch: String) {
    places(textSearch: $textSearch) {
      id
      name
      importance
      imagesUrl
      createdAt
    }
  }
`);

const getMediasToAddStop = graphql(`
  query Medias($placeId: ID) {
    medias(placeId: $placeId) {
      id
      title
    }
  }
`);

export default function AddStop() {
  const t = useTranslations('RouteDetail');
  const locale = useLocale() as Locale;
  const [searchPlaces, setSearchPlaces] = useState('');
  const [searchMedias, setSearchMedias] = useState('');
  const placesContainerRef = useRef<HTMLDivElement | null>(null);
  const mediasContainerRef = useRef<HTMLDivElement | null>(null);
  const [selectedPlaceId, setSelectedPlaceId] = useState<string | null>(null);
  const [selectedMedias, setSelectedMedias] = useState<string[]>([]);
  const [selectedPlaces, setSelectedPlaces] = useState<string[]>([]);
  const query = searchPlaces;

  useEffect(() => {
    if (placesContainerRef.current) {
      placesContainerRef.current.scrollTop = 0;
    }
  }, [searchPlaces]);

  const variables: VariablesOf<typeof getPlacesToAddStop> = {
    textSearch: query,
  };

  const { data } = useQuery(getPlacesToAddStop, {
    variables,
  });
  const places: {
    id: string;
    name: string;
    photo?: string;
    importance: number;
    createdAt?: Date;
  }[] = [];
  data?.places?.forEach((place) => {
    if (!place || !place.id) return;
    places.push({
      id: place.id,
      name: place?.name,
      photo:
        place?.imagesUrl && place.imagesUrl[0] ? place.imagesUrl[0] : undefined,
      importance: place?.importance,
      createdAt: place?.createdAt ? new Date(place.createdAt) : undefined,
    });
  });

  const variablesMedias: VariablesOf<typeof getMediasToAddStop> = {
    placeId: selectedPlaceId,
  };

  const { data: allMedias } = useQuery(getMediasToAddStop, {
    variables: variablesMedias,
  });
  const medias = allMedias?.medias?.map((media) => ({
    id: media?.id,
    title: media?.title,
  }));

  const dateFormater = new Intl.DateTimeFormat(LocaleToDateTimeFormat[locale], {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
  });

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div
        onClick={(e) => {
          e.stopPropagation();
        }}
        className="flex h-[80vh] w-[80vw] flex-col overflow-hidden bg-white p-8"
      >
        <div className="mb-4 w-full text-center">
          <h1 className="text-2xl font-bold text-monum-green-dark">
            {t('chooseMultipleStops')}
          </h1>
          <p className="text-monum-grey-500 text-lg">
            {t('monumsAndMediasSelected', {
              monumsSelected: selectedPlaces.length,
              mediasSelected: selectedMedias.length,
            })}
          </p>
        </div>
        <div className="flex w-full flex-1">
          <div className="w-1/2 pr-4">
            <input
              type="text"
              placeholder={t('searchMonums')}
              value={searchPlaces}
              onChange={(e) => setSearchPlaces(e.target.value)}
              className="mb-4 w-full rounded border px-2 py-1"
            />
            <div
              ref={placesContainerRef}
              className="max-h-[65vh] overflow-auto"
            >
              {places?.map((place, index) => (
                <div
                  key={place.id}
                  onClick={() => {
                    place.id && setSelectedPlaceId(place.id);
                  }}
                  className={`h-50px relative mb-2 flex w-full cursor-pointer items-center gap-2 rounded-lg p-4 ${place?.id === selectedPlaceId ? 'bg-monum-green-default text-white' : selectedPlaces.includes(place.id) ? 'bg-monum-green-light' : 'bg-white'}`}
                >
                  <input
                    type="checkbox"
                    id="myCheckbox"
                    checked={selectedPlaces.includes(place.id)}
                    onChange={() => {
                      if (selectedPlaces.includes(place.id)) {
                        setSelectedPlaces(
                          selectedPlaces.filter((id) => id !== place.id),
                        );
                      } else {
                        setSelectedPlaces([...selectedPlaces, place.id]);
                      }
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  {place.photo && (
                    <Image
                      src={place.photo}
                      alt={place?.name || ''}
                      width={50}
                      height={50}
                      className=" aspect-square rounded"
                      objectFit="cover"
                      layout="fixed"
                    />
                  )}
                  <div className=" text-sm">{place.name}</div>
                  <Image
                    src={`/map_marker_importance_${place.importance}.png`}
                    alt={`Marker for ${place.name}`}
                    width={24}
                    height={24}
                  />
                </div>
              ))}
            </div>
          </div>
          {selectedPlaceId && (
            <div className="w-1/2 overflow-auto pl-4">
              <input
                type="text"
                placeholder={t('searchMedias')}
                value={searchPlaces}
                onChange={(e) => setSearchMedias(e.target.value)}
                className="mb-4 w-full rounded border px-2 py-1"
              />
              {medias?.map((media, index) => (
                <div
                  key={media.id}
                  onClick={(e) => {
                    e.preventDefault();
                  }}
                  className={`mb-2 rounded p-2 ${selectedPlaceId === media.id ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                >
                  {media.title}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
