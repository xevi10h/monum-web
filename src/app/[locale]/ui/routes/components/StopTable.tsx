import { IStop } from '@/shared/interfaces/IStop';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import {
  DragDropContext,
  DragStart,
  Draggable,
  Droppable,
} from 'react-beautiful-dnd';
import { montserrat } from '../../fonts';
import { useLocale, useTranslations } from 'next-intl';
import { Language } from '@/shared/types/Language';
import {
  PlusIcon,
  ArrowTopRightOnSquareIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from '@heroicons/react/24/outline';
import AddStop from './AddStop';
import { Link } from '@/navigation';
import { Locale, LocaleToLanguage } from '@/shared/types/Locale';
import MediaTypeAudio from '../../media-type-audio';
import MediaTypeVideo from '../../media-type-video';
import MediaTypeText from '../../media-type-text';

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
  const t = useTranslations('RouteDetail');
  const locale = useLocale() as Locale;
  const [scrollToBottom, setScrollToBottom] = useState<boolean>(false);
  const [expandedStopsIds, setExpandedStopsIds] = useState<string[]>([]);

  const handleOnDragEnd = (result: any) => {
    setDraggingIndexMedia(null);
    setDraggingIndexPlace(null);
    if (!result.destination) return;
    if (result.destination.droppableId === 'places') {
      const items = Array.from(stops);
      const [reorderedItem] = items.splice(result.source.index, 1);
      items.splice(result.destination.index, 0, reorderedItem);
      setStops(items);
    }
    if (result.destination.droppableId.includes('medias')) {
      const stopIndex = parseInt(result.destination.droppableId.split('_')[1]);
      const items = Array.from(stops[stopIndex].medias);
      const [reorderedItem] = items.splice(result.source.index, 1);
      items.splice(result.destination.index, 0, reorderedItem);
      console.log('items', items);
      const updatedStops = [...stops];
      updatedStops[stopIndex].medias = items;
      setStops(updatedStops);
    }
  };

  const deleteStop = (index: number) => {
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
  const [draggingIndexMedia, setDraggingIndexMedia] = useState<string | null>(
    null,
  );
  const [addStop, setAddStop] = useState<boolean>(false);

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
          <span className="hidden md:block">{t('addStops')}</span>{' '}
          <PlusIcon className="h-5 md:ml-4" />
        </button>
      </div>
      <DragDropContext
        onDragEnd={handleOnDragEnd}
        onDragStart={(dragStart: DragStart) => {
          dragStart.draggableId.includes('place') &&
            setDraggingIndexPlace(dragStart.source.index);

          console.log('dragStart', dragStart);

          dragStart.draggableId.includes('media') &&
            setDraggingIndexMedia(dragStart.draggableId);
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
                          expandedStopsIds.includes(stop.place.id)
                            ? 'h-[45vh]'
                            : 'h-40'
                        } flex w-full cursor-pointer flex-col rounded shadow ${
                          index === draggingIndexPlace
                            ? 'bg-monum-green-default'
                            : 'bg-white'
                        } `}
                        onMouseDown={(e) => {
                          e.stopPropagation();
                        }}
                      >
                        <div className="relative flex h-40 w-full cursor-grab p-4">
                          <div className="flex-shrink-0">
                            <Image
                              src={
                                Array.isArray(stop.place.photos) &&
                                stop.place.photos[0].url
                                  ? stop.place.photos[0].url
                                  : ''
                              }
                              alt={`Photo ${index + 1}`}
                              width={200}
                              height={200}
                              style={{ objectFit: 'cover' }}
                              className="h-full w-[15vh] rounded"
                            />
                          </div>
                          <div className="ml-5 flex-grow ">
                            <div
                              className={`text-l font-semibold  ${
                                index === draggingIndexPlace
                                  ? 'text-gray-50'
                                  : 'text-gray-900'
                              }`}
                            >
                              {stop.place.name}
                            </div>
                            <div
                              className={`text-l  ${montserrat.className} ${
                                index === draggingIndexPlace
                                  ? 'text-gray-50'
                                  : 'text-gray-700'
                              }`}
                            >
                              {stop.place.name}
                            </div>
                            <div
                              className={`text-l italic ${
                                index === draggingIndexPlace
                                  ? 'text-gray-50'
                                  : 'text-gray-500'
                              }`}
                            >
                              {stop.place.name}
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
                              href={`/dashboard/places/${stop.place.id}/edit`}
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
                                  if (prev.includes(stop.place.id)) {
                                    return prev.filter(
                                      (id) => id !== stop.place.id,
                                    );
                                  }
                                  return [...prev, stop.place.id];
                                });
                              }}
                            >
                              {expandedStopsIds.includes(stop.place.id) ? (
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
                          <button
                            className="mr-5 flex h-full items-center justify-center"
                            onClick={(e) => {
                              e.stopPropagation();
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
                        {expandedStopsIds.includes(stop.place.id) && (
                          <div
                            onClick={(e) => {
                              e.stopPropagation();
                            }}
                            className="relative w-full flex-grow flex-col items-center justify-center border-t-2"
                          >
                            <div className="text-m relative flex h-12 w-full items-center pl-12 font-medium text-monum-green-dark ">
                              {t('mediasOfStop')}
                            </div>
                            <div className="relative h-full w-full pl-12 pr-4">
                              {stop.medias.map((media, mediaIndex) => {
                                if (
                                  !media ||
                                  !media.duration ||
                                  !media.type ||
                                  !media.id
                                )
                                  return null;

                                const duration =
                                  media.duration[LocaleToLanguage[locale]];
                                const title =
                                  media.title[LocaleToLanguage[locale]];

                                const minutes = Math.floor(duration / 60);
                                const seconds = (duration % 60).toFixed(0);

                                return (
                                  <div
                                    key={media.id}
                                    className={`cursor-drag mb-2 flex h-20 items-center justify-stretch gap-4 rounded bg-gray-200
                                        p-4
                                    `}
                                  >
                                    <div className="flex">
                                      <div>
                                        {mediaTypeIcon({
                                          type: media?.type || '',
                                          selected: false,
                                        })}
                                      </div>
                                      <div>{title}</div>

                                      <div className="w-2/6 text-right text-sm font-medium">
                                        {minutes} min {seconds} sec
                                      </div>
                                    </div>

                                    <div className="flex">
                                      <div className="mr-5 flex h-full items-center justify-center">
                                        <Link
                                          href={`/dashboard/places/${stop.place.id}/edit`}
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
                                              if (
                                                prev.includes(stop.place.id)
                                              ) {
                                                return prev.filter(
                                                  (id) => id !== stop.place.id,
                                                );
                                              }
                                              return [...prev, stop.place.id];
                                            });
                                          }}
                                        >
                                          {expandedStopsIds.includes(
                                            stop.place.id,
                                          ) ? (
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
                                      <button
                                        className="mr-5 flex h-full items-center justify-center"
                                        onClick={(e) => {
                                          e.stopPropagation();
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
          />
        </div>
      )}
    </div>
  );
}
