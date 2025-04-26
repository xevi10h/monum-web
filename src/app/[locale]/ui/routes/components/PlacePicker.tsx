import { IStop } from '@/shared/interfaces/IStop';
import Image from 'next/image';
import { useState } from 'react';
import {
  DragDropContext,
  DragStart,
  Draggable,
  Droppable,
} from 'react-beautiful-dnd';
import { montserrat } from '../../fonts';
import { useLocale } from 'next-intl';
import { Language } from '@/shared/types/Language';
import {
  PlusIcon,
  ArrowTopRightOnSquareIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from '@heroicons/react/24/outline';
import AddStop from './AddStop';
import { Link } from '@/navigation';
import { Locale } from '@/shared/types/Locale';
import MediaTypeAudio from '../../media-type-audio';
import MediaTypeVideo from '../../media-type-video';
import MediaTypeText from '../../media-type-text';
import { LanguageToDateTimeFormat } from '@/shared/types/DateTimeFormat';
import { translateRoutes } from '@/app/[locale]/dashboard/routes/translations';

interface PlacePickerProps {
  stops: IStop[];
  setStops: React.Dispatch<React.SetStateAction<IStop[]>>;
  language: Language;
}

export default function PlacePicker({
  stops,
  setStops,
  language,
}: PlacePickerProps) {
  const locale = useLocale() as Locale;
  const [scrollToBottom, setScrollToBottom] = useState<boolean>(false);
  const [expandedStopsIds, setExpandedStopsIds] = useState<string[]>([]);

  const handleOnDragEnd = (result: any) => {
    setDraggingIndexPlace(null);
    if (!result.destination) return;
    if (result.destination.droppableId === 'places') {
      const items = Array.from(stops);
      const [reorderedItem] = items.splice(result.source.index, 1);
      items.splice(result.destination.index, 0, reorderedItem);
      setStops(items);
    }
  };

  const deleteStop = (index: number) => {
    if (index < 0 || index >= stops.length) return;
    const items = Array.from(stops);
    items.splice(index, 1);
    setStops(items);
  };

  const addNewStops = (newStops: IStop[]) => {
    setStops((prevStops) => {
      const updatedStops = [...prevStops, ...newStops];
      setScrollToBottom(true);
      return updatedStops;
    });
  };

  const mediaUp = (index: number, mediaId: string) => {
    const items = Array.from(stops);
    const stop = items[index];
    const medias = stop.medias;
    const mediaIndex = medias.findIndex((media) => media.id === mediaId);
    if (mediaIndex === 0) return;
    const [reorderedMedia] = medias.splice(mediaIndex, 1);
    medias.splice(mediaIndex - 1, 0, reorderedMedia);
    stop.medias = medias;
    items[index] = stop;
    setStops(items);
  };

  const mediaDown = (index: number, mediaId: string) => {
    const items = Array.from(stops);
    const stop = items[index];
    const medias = stop.medias;
    const mediaIndex = medias.findIndex((media) => media.id === mediaId);
    if (mediaIndex === medias.length - 1) return;
    const [reorderedMedia] = medias.splice(mediaIndex, 1);
    medias.splice(mediaIndex + 1, 0, reorderedMedia);
    stop.medias = medias;
    items[index] = stop;
    setStops(items);
  };

  const deleteMedia = (index: number, mediaId: string) => {
    const items = Array.from(stops);
    const stop = items[index];
    const medias = stop.medias;
    const mediaIndex = medias.findIndex((media) => media.id === mediaId);
    medias.splice(mediaIndex, 1);
    stop.medias = medias;
    items[index] = stop;
    setStops(items);
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

  const [draggingIndexPlace, setDraggingIndexPlace] = useState<number | null>(
    null,
  );

  const [addStop, setAddStop] = useState<boolean>(false);

  const dateFormater = new Intl.DateTimeFormat(
    LanguageToDateTimeFormat[language],
    {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
    },
  );

  return (
    <div className="mt-5 flex h-[50vh] flex-grow flex-col overflow-auto">
      <div className="mb-4 flex justify-end">
        <button
          onClick={(e) => {
            e.preventDefault();
            setAddStop(true);
          }}
          className={`flex h-10 items-center rounded-lg bg-monum-green-default px-4 text-sm font-medium text-white`}
        >
          <span className="hidden md:block">
            {translateRoutes('addStops', language)}
          </span>{' '}
          <PlusIcon className="h-5 md:ml-4" />
        </button>
      </div>
      <DragDropContext
        onDragEnd={handleOnDragEnd}
        onDragStart={(dragStart: DragStart) => {
          dragStart.draggableId.includes('place') &&
            setDraggingIndexPlace(dragStart.source.index);
        }}
      >
        <Droppable droppableId={`places`} direction="vertical">
          {(provided, snapshot) => (
            <div
              {...provided.droppableProps}
              ref={(el) => {
                provided.innerRef(el);
                if (el && scrollToBottom) {
                  el.scrollTo({
                    top: el.scrollHeight,
                    behavior: 'smooth',
                  });
                  setScrollToBottom(false);
                }
              }}
              className={'overflow-auto rounded bg-monum-green-light p-4'}
            >
              {stops.map((stop: IStop, index: number) => {
                const place = stop.place;
                const placeStreet = place?.address?.street?.[language] || '';
                const placeCity = place?.address?.city?.[language] || '';
                const placePostalCode = place?.address?.postalCode || '';
                const placeProvince =
                  place?.address?.province?.[language] || '';
                const placeCountry = place?.address?.country?.[language] || '';

                const placeAddress = `${placeStreet}, ${placeCity}, ${placePostalCode}, ${placeProvince}, ${placeCountry}`;
                return (
                  <Draggable
                    key={'place_' + index}
                    draggableId={'place_' + index}
                    index={index}
                  >
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className={`relative ${index !== 0 && 'mt-5'} transition-[height] ${
                          expandedStopsIds.includes(place.id) ? 'h-68' : 'h-28'
                        } flex w-full cursor-pointer flex-col rounded shadow ${
                          index === draggingIndexPlace
                            ? 'bg-monum-green-default'
                            : 'bg-white'
                        } `}
                        onMouseDown={(e) => {
                          e.stopPropagation();
                          e.preventDefault();
                        }}
                      >
                        <div className="relative flex h-28 w-full cursor-grab p-4">
                          <div className="h-full flex-shrink-0">
                            <Image
                              src={
                                Array.isArray(place.photos) &&
                                place.photos[0].url
                                  ? place.photos[0].url
                                  : ''
                              }
                              alt={`Photo ${index + 1}`}
                              width={100}
                              height={100}
                              style={{ objectFit: 'cover' }}
                              className="aspect-square h-20 w-20 rounded"
                            />
                          </div>
                          <div className="ml-5 flex-grow ">
                            <div
                              className={`text-l truncate font-semibold ${
                                index === draggingIndexPlace
                                  ? 'text-gray-50'
                                  : 'text-gray-900'
                              }`}
                            >
                              {place.nameTranslations[language]}
                            </div>
                            <div
                              className={`text-l truncate ${montserrat.className} ${
                                index === draggingIndexPlace
                                  ? 'text-gray-50'
                                  : 'text-gray-700'
                              }`}
                            >
                              {`${translateRoutes('updatedAt', language)}: ${dateFormater.format(place.createdAt)}`}
                            </div>
                            <div
                              className={`text-l truncate italic ${
                                index === draggingIndexPlace
                                  ? 'text-gray-50'
                                  : 'text-gray-500'
                              }`}
                            >
                              {placeAddress}
                            </div>
                          </div>

                          <div className="mr-5 flex h-full items-center justify-center">
                            <Image
                              src={
                                index === draggingIndexPlace
                                  ? '/drag-white.png'
                                  : '/drag.png'
                              }
                              alt={`Drag`}
                              width={200}
                              height={200}
                              style={{ objectFit: 'cover' }}
                              className="h-12 w-12"
                            />
                          </div>
                          <div className="mr-5 flex h-full items-center justify-center">
                            <Link
                              rel="noopener noreferrer"
                              target="_blank"
                              href={`/dashboard/places/${place.id}/edit`}
                              className={`flex h-12 w-12 cursor-pointer items-center justify-center rounded-full hover:bg-gray-200`}
                            >
                              <ArrowTopRightOnSquareIcon
                                className={`h-8 w-8`}
                                color={
                                  index === draggingIndexPlace
                                    ? 'white'
                                    : 'black'
                                }
                              />
                            </Link>
                          </div>
                          <div className="mr-5 flex h-full items-center justify-center">
                            <Link
                              href="#"
                              className="flex h-12 w-12 cursor-pointer items-center justify-center rounded-full hover:bg-gray-200"
                              onClick={(e) => {
                                setExpandedStopsIds((prev) => {
                                  if (prev.includes(place.id)) {
                                    return prev.filter((id) => id !== place.id);
                                  }
                                  return [...prev, place.id];
                                });
                              }}
                            >
                              {expandedStopsIds.includes(place.id) ? (
                                <ChevronUpIcon
                                  className="h-8 w-8"
                                  color={
                                    index === draggingIndexPlace
                                      ? 'white'
                                      : 'black'
                                  }
                                />
                              ) : (
                                <ChevronDownIcon
                                  className="h-8 w-8"
                                  color={
                                    index === draggingIndexPlace
                                      ? 'white'
                                      : 'black'
                                  }
                                />
                              )}
                            </Link>
                          </div>
                          <div className="flex h-full items-center">
                            <button
                              className="mr-5 aspect-square h-12 w-12"
                              onClick={(e) => {
                                e.stopPropagation();
                                e.preventDefault();
                                deleteStop(index);
                              }}
                            >
                              <Image
                                src={'/trash.png'}
                                alt={`Trash`}
                                width={200}
                                height={200}
                                style={{ objectFit: 'contain' }}
                                className={`h-12 w-12 rounded-full bg-monum-red-default px-3 hover:bg-monum-red-hover`}
                              />
                            </button>
                          </div>
                        </div>
                        {expandedStopsIds.includes(place.id) && (
                          <div
                            onClick={(e) => {
                              e.stopPropagation();
                              e.preventDefault();
                            }}
                            className="flex-column flex h-full w-full flex-col items-center justify-center border-t-2 pl-12 pr-4"
                          >
                            <div
                              className={`text-m w-full items-center pt-2 font-medium ${
                                index === draggingIndexPlace
                                  ? 'text-white'
                                  : 'text-monum-green-dark '
                              }`}
                            >
                              {translateRoutes('mediasSelected', language)}
                            </div>
                            <div
                              className={`flex-column my-2 h-40 w-full overflow-auto rounded-lg p-4 ${
                                index === draggingIndexPlace
                                  ? 'bg-white text-white'
                                  : 'bg-gray-200 text-monum-green-dark'
                              }`}
                            >
                              {stop.medias.map((media, mediaIndex) => {
                                if (
                                  !media ||
                                  !media.duration ||
                                  !media.type ||
                                  !media.id
                                )
                                  return null;

                                const duration = media.duration[language];
                                const title = media.title[language];

                                const minutes = Math.floor(duration / 60);
                                const seconds = (duration % 60).toFixed(0);

                                return (
                                  <div
                                    key={`place_${index}_media_${mediaIndex}`}
                                    className={`mb-2 flex h-14 w-full items-center gap-8 rounded-lg p-4 ${
                                      index === draggingIndexPlace
                                        ? 'bg-monum-green-default text-white'
                                        : 'bg-white text-monum-green-dark'
                                    }
                                    `}
                                  >
                                    <div className="flex h-full w-full items-center ">
                                      <div className="mr-4 self-center text-sm">
                                        {mediaTypeIcon({
                                          type: media?.type || '',
                                          selected:
                                            index === draggingIndexPlace,
                                        })}
                                      </div>

                                      <div className="w-full truncate text-sm">
                                        {title}
                                      </div>

                                      <div className="w-1/5 justify-self-end text-right text-sm font-medium">
                                        {minutes} min {seconds} sec
                                      </div>
                                    </div>

                                    <div className="flex w-1/4 flex-row justify-end gap-5">
                                      <div>
                                        <Link
                                          rel="noopener noreferrer"
                                          target="_blank"
                                          href={`/dashboard/places/${place.id}/medias/`}
                                          className={`flex h-8 w-8 cursor-pointer items-center justify-center rounded-full hover:bg-gray-400`}
                                        >
                                          <ArrowTopRightOnSquareIcon
                                            className={`h-6 w-6`}
                                            color={
                                              index === draggingIndexPlace
                                                ? 'white'
                                                : 'black'
                                            }
                                          />
                                        </Link>
                                      </div>
                                      <div className="flex-column h-8 w-8 items-center">
                                        <Link
                                          href="#"
                                          className={`flex h-4 w-full items-center justify-center rounded-full ${mediaIndex !== 0 ? 'cursor-pointer hover:bg-gray-400' : 'cursor-default'}`}
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            e.preventDefault();
                                            mediaIndex !== 0 &&
                                              mediaUp(index, media.id);
                                          }}
                                        >
                                          <ChevronUpIcon
                                            className="w-5"
                                            color={
                                              index === draggingIndexPlace
                                                ? 'white'
                                                : 'black'
                                            }
                                          />
                                        </Link>

                                        <Link
                                          href="#"
                                          className={`flex h-4 w-full cursor-pointer items-center justify-center rounded-full hover:bg-gray-400 ${mediaIndex !== stop.medias.length - 1 ? 'cursor-pointer hover:bg-gray-400' : 'cursor-default'}`}
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            e.preventDefault();
                                            mediaIndex !==
                                              stop.medias.length - 1 &&
                                              mediaDown(index, media.id);
                                          }}
                                        >
                                          <ChevronDownIcon
                                            className="w-5"
                                            color={
                                              index === draggingIndexPlace
                                                ? 'white'
                                                : 'black'
                                            }
                                          />
                                        </Link>
                                      </div>

                                      <button
                                        className="aspect-square h-8 w-8"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          e.preventDefault();
                                          deleteMedia(index, media.id);
                                        }}
                                      >
                                        <Image
                                          src={'/trash.png'}
                                          alt={`Trash`}
                                          width={150}
                                          height={150}
                                          style={{ objectFit: 'contain' }}
                                          className={`aspect-square rounded-full bg-monum-red-default px-2 hover:bg-monum-red-hover`}
                                        />
                                      </button>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </Draggable>
                );
              })}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
      {addStop && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
          onClick={() => {
            setAddStop(false);
          }}
        >
          <AddStop
            stops={stops}
            addNewStops={addNewStops}
            setAddStop={setAddStop}
            language={language}
          />
        </div>
      )}
    </div>
  );
}
