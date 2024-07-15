import React, { useState, useEffect, useRef } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Locale, LocaleToLanguage } from '@/shared/types/Locale';
import { VariablesOf, graphql } from '@/graphql';
import { useQuery } from '@apollo/client';
import Image from 'next/image';
import MediaTypeAudio from '@/app/[locale]/ui/media-type-audio';
import MediaTypeVideo from '@/app/[locale]/ui/media-type-video';
import MediaTypeText from '@/app/[locale]/ui/media-type-text';
import { IStop } from '@/shared/interfaces/IStop';
import { Link, useRouter } from '@/navigation';
import { Button } from '@/app/[locale]/ui/button';
import { IPlace } from '@/shared/interfaces/IPlace';
import { Language } from '@/shared/types/Language';
import { IMedia } from '@/shared/interfaces/IMedia';
import { MediaType } from '@/shared/types/MediaType';

const getPlacesToAddStop = graphql(`
  query PlacesFull($textSearch: String) {
    placesFull(textSearch: $textSearch) {
      id
      name
      nameTranslations {
        key
        value
      }
      address {
        coordinates {
          lat
          lng
        }
        street {
          key
          value
        }
        city {
          key
          value
        }
        postalCode
        province {
          key
          value
        }
        country {
          key
          value
        }
      }
      importance
      imagesUrl
      photos {
        url
        sizes {
          small
          medium
          large
          original
        }
        order
        createdAt
        updatedAt
        id
        name
      }
      createdAt
      updatedAt
      description {
        key
        value
      }
    }
  }
`);

const getMediasToAddStop = graphql(`
  query MediasFull($textSearch: String, $placeId: ID) {
    mediasFull(textSearch: $textSearch, placeId: $placeId) {
      id
      placeId
      text {
        key
        value
      }
      rating
      url {
        key
        value
      }
      voiceId {
        key
        value
      }
      duration {
        key
        value
      }
      type
      createdAt
      updatedAt
      title {
        key
        value
      }
    }
  }
`);

interface AddStopProps {
  stops: IStop[];
  addNewStops: (stops: IStop[]) => void;
  setAddStop: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function AddStop({
  stops,
  addNewStops,
  setAddStop,
}: AddStopProps) {
  const t = useTranslations('RouteDetail');
  const locale = useLocale() as Locale;
  const [searchPlaces, setSearchPlaces] = useState('');
  const [searchMedias, setSearchMedias] = useState('');
  const placesContainerRef = useRef<HTMLDivElement | null>(null);
  const mediasContainerRef = useRef<HTMLDivElement | null>(null);
  const [selectedPlaceId, setSelectedPlaceId] = useState<string | null>(null);
  const [selectedStops, setSelectedStops] = useState<IStop[]>([]);

  const arrayToObjectLanguage = (array: any[]) =>
    array.reduce(
      (obj, item) => {
        obj[item.key as Language] = item.value;
        return obj;
      },
      {} as { [key in Language]: string },
    );

  useEffect(() => {
    if (placesContainerRef.current) {
      placesContainerRef.current.scrollTop = 0;
    }
  }, [searchPlaces]);

  useEffect(() => {
    if (mediasContainerRef.current) {
      mediasContainerRef.current.scrollTop = 0;
    }
  }, [searchMedias]);

  const variablesPlaces: VariablesOf<typeof getPlacesToAddStop> = {
    textSearch: searchPlaces,
  };

  const { data: dataPlace } = useQuery(getPlacesToAddStop, {
    variables: variablesPlaces,
  });

  const places: IPlace[] = [];
  dataPlace?.placesFull?.forEach((place) => {
    if (!place || !place.id) return;
    if (!stops.some((stop: IStop) => stop.place.id === place.id)) {
      const rawCreatedAt = place?.createdAt;
      const rawUpdatedAt = place?.updatedAt;
      const createdAt =
        typeof rawCreatedAt === 'string' || typeof rawCreatedAt === 'number'
          ? new Date(rawCreatedAt)
          : new Date();
      const updatedAt =
        typeof rawUpdatedAt === 'string' || typeof rawUpdatedAt === 'number'
          ? new Date(rawUpdatedAt)
          : new Date();
      const imagesUrl: string[] = [];
      place.imagesUrl?.forEach((image) => {
        image && imagesUrl.push(image);
      });

      places.push({
        id: place.id,
        name: place.name,
        nameTranslations: arrayToObjectLanguage(
          place.nameTranslations as any[],
        ),
        address: {
          coordinates: {
            lat: place.address.coordinates.lat,
            lng: place.address.coordinates.lng,
          },
          street:
            Array.isArray(place.address.street) &&
            arrayToObjectLanguage(place.address.street as any[]),
          city:
            Array.isArray(place.address.city) &&
            arrayToObjectLanguage(place.address.city as any[]),
          postalCode: place?.address?.postalCode
            ? place?.address?.postalCode
            : undefined,
          province:
            Array.isArray(place.address.province) &&
            arrayToObjectLanguage(place.address.province as any[]),
          country:
            Array.isArray(place.address.country) &&
            arrayToObjectLanguage(place.address.country as any[]),
        },
        importance: place.importance,
        imagesUrl,
        photos: place.photos.map((photo: any) => ({
          url: photo.url,
          sizes: photo.sizes,
          order: photo.order,
          createdAt: new Date(photo.createdAt),
          updatedAt: new Date(photo.updatedAt),
          id: photo.id,
          name: photo.name,
        })),
        createdAt,
        updatedAt,
        description:
          Array.isArray(place.description) &&
          arrayToObjectLanguage(place.description as any[]),
      });
    }
  });

  const variablesMedias: VariablesOf<typeof getMediasToAddStop> = {
    placeId: selectedPlaceId,
    textSearch: searchMedias,
  };

  const { data: allMedias } = useQuery(getMediasToAddStop, {
    variables: variablesMedias,
  });

  const medias: IMedia[] = [];
  allMedias?.mediasFull?.forEach((media) => {
    if (!media?.placeId) return;
    const rawCreatedAt = media?.createdAt;
    const rawUpdatedAt = media?.updatedAt;
    const createdAt =
      typeof rawCreatedAt === 'string' || typeof rawCreatedAt === 'number'
        ? new Date(rawCreatedAt)
        : new Date();
    const updatedAt =
      typeof rawUpdatedAt === 'string' || typeof rawUpdatedAt === 'number'
        ? new Date(rawUpdatedAt)
        : new Date();
    medias.push({
      id: media?.id,
      placeId: media.placeId,
      text:
        Array.isArray(media?.text) &&
        arrayToObjectLanguage(media.text as any[]),
      rating: media?.rating ? media?.rating : undefined,
      url:
        Array.isArray(media?.url) && arrayToObjectLanguage(media.url as any[]),
      voiceId:
        Array.isArray(media?.voiceId) &&
        arrayToObjectLanguage(media.voiceId as any[]),
      duration:
        Array.isArray(media?.duration) &&
        arrayToObjectLanguage(media.duration as any[]),
      type: media?.type as MediaType,
      createdAt,
      updatedAt,
      title:
        Array.isArray(media?.title) &&
        arrayToObjectLanguage(media.title as any[]),
    });
  });

  const clickPlace = (place: IPlace) => {
    if (!place) return;
    setSelectedPlaceId(place.id);
    if (!selectedStops.some((stop) => stop.place.id === place.id)) {
      setSelectedStops([
        ...selectedStops,
        {
          place,
          medias: [],
          order: stops.length + selectedStops.length,
          optimizedOrder: stops.length + selectedStops.length,
        },
      ]);
    }
  };

  const handleClickPlaceCheckbox = (place: IPlace) => {
    if (!place) return;
    if (!selectedStops.some((stop) => stop.place.id === place.id)) {
      setSelectedStops([
        ...selectedStops,
        {
          place,
          medias: [],
          order: stops.length + selectedStops.length,
          optimizedOrder: stops.length + selectedStops.length,
        },
      ]);
    } else {
      setSelectedStops(
        selectedStops.filter((stop) => stop.place.id !== place.id),
      );
    }
  };

  const clickMedia = (media: IMedia) => {
    if (!media.id) return;
    const stopOfMedia = selectedStops.find(
      (stop) => stop.place.id === media.placeId,
    );
    if (!stopOfMedia) return;

    const selectedMedias = stopOfMedia.medias;

    if (selectedMedias.some((selectedMedia) => selectedMedia.id === media.id)) {
      stopOfMedia.medias = selectedMedias.filter(
        (selectedMedia) => selectedMedia.id !== media.id,
      );
    } else {
      stopOfMedia.medias = [...selectedMedias, media];
    }

    setSelectedStops([...selectedStops]);
  };

  const mediaTypeIcon = ({
    type,
    selected,
  }: {
    type: string;
    selected: boolean;
  }) => {
    return type === 'audio' ? (
      <MediaTypeAudio
        className={`w-6 ${selected ? 'text-white' : 'text-black'}`}
      />
    ) : type === 'video' ? (
      <MediaTypeVideo
        className={`w-6 ${selected ? 'text-white' : 'text-black'}`}
      />
    ) : (
      <MediaTypeText
        className={`w-6 ${selected ? 'text-white' : 'text-black'}`}
      />
    );
  };

  console.log('selectedStops', selectedStops);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div
        onClick={(e) => {
          e.stopPropagation();
        }}
        className="relative flex h-[80vh] w-[80vw] flex-col overflow-hidden bg-white p-8"
      >
        <div className="mb-4 h-1/6 w-full text-center">
          <h1 className="text-2xl font-bold text-monum-green-dark">
            {t('chooseMultipleStops')}
          </h1>
          <p className="text-monum-grey-500 text-lg">
            {t('monumsAndMediasSelected', {
              monumsSelected: selectedStops.length,
              mediasSelected: selectedStops.reduce(
                (acc, stop) => acc + stop.medias.length,
                0,
              ),
            })}
          </p>
        </div>
        <div className="h-10/12 mb-4 flex w-full flex-1 pb-4">
          <div className="w-1/2 pr-4">
            <input
              type="text"
              placeholder={t('searchMonums')}
              value={searchPlaces}
              onChange={(e) => setSearchPlaces(e.target.value)}
              className="mb-4 w-full rounded border px-2 py-1"
            />
            <div ref={placesContainerRef} className="h-[40vh] overflow-auto">
              {places?.map((place, index) => (
                <div
                  key={place.id}
                  onClick={() => clickPlace(place)}
                  className={`mb-2 flex w-full cursor-pointer items-center justify-between gap-6 rounded-lg p-4 ${place?.id === selectedPlaceId ? 'bg-monum-green-default text-white' : selectedStops.some((stop) => stop.place.id === place.id) ? 'bg-monum-green-light' : 'bg-gray-200'}`}
                >
                  <div className="flex w-1/6 items-center gap-4">
                    <input
                      type="checkbox"
                      id="myCheckbox"
                      checked={selectedStops.some(
                        (stop) => stop.place.id === place.id,
                      )}
                      onChange={() => handleClickPlaceCheckbox(place)}
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                      className="border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    {Array.isArray(place.photos) && place.photos[0] && (
                      <Image
                        src={place.photos[0].url || ''}
                        alt={place?.name || ''}
                        width={50}
                        height={50}
                        className="aspect-square rounded"
                        objectFit="cover"
                        layout="fixed"
                      />
                    )}
                  </div>
                  <div className="w-4/6">{place.name}</div>
                  <div className="w-1/6 justify-self-end">
                    <Image
                      src={`/map_marker_importance_${place.importance}.png`}
                      alt={`Marker for ${place.name}`}
                      width={32}
                      height={32}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
          {selectedPlaceId && (
            <div className="w-1/2 overflow-auto pl-4">
              <input
                type="text"
                placeholder={t('searchMedias')}
                value={searchMedias}
                onChange={(e) => setSearchMedias(e.target.value)}
                className="mb-4 w-full rounded border px-2 py-1"
              />
              <div ref={placesContainerRef} className="h-[40vh] overflow-auto">
                {medias?.map((media, index) => {
                  if (!media || !media.duration || !media.type || !media.id)
                    return null;

                  const duration = media.duration[LocaleToLanguage[locale]];
                  const title = media.title[LocaleToLanguage[locale]];

                  const minutes = Math.floor(duration / 60);
                  const seconds = (duration % 60).toFixed(0);

                  return (
                    <div
                      key={media.id}
                      onClick={() => clickMedia(media)}
                      className={`mb-2 flex cursor-pointer items-center justify-stretch gap-4 rounded p-4 ${selectedStops.some((stop) => media.id && stop.medias.some((stopMedia) => stopMedia.id === media.id)) ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                    >
                      <div>
                        {mediaTypeIcon({
                          type: media?.type || '',
                          selected: selectedStops.some(
                            (stop) =>
                              media.id &&
                              stop.medias.some(
                                (stopMedia) => stopMedia.id === media.id,
                              ),
                          ),
                        })}
                      </div>
                      <div>{title}</div>

                      <div className="w-2/6 text-right">
                        {minutes} min {seconds} sec
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
        <div className="h-1/12 flex w-full content-end justify-center gap-4 pt-8">
          <Link
            href="#"
            onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
              e.preventDefault();
              setAddStop(false);
            }}
            className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
          >
            {t('cancel')}
          </Link>
          <Link
            href="#"
            onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
              e.preventDefault();
              addNewStops(selectedStops);
              setAddStop(false);
            }}
            className="flex h-10 items-center rounded-lg bg-monum-green-default px-4 text-sm font-medium text-white transition-colors hover:bg-monum-green-default"
          >
            {t('addStops')}
          </Link>
        </div>
      </div>
    </div>
  );
}
