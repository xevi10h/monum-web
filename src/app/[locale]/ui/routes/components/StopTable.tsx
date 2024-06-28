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
import { useTranslations } from 'next-intl';
import { Language } from '@/shared/types/Language';
import { PlusIcon } from '@heroicons/react/24/outline';
import AddStop from './AddStop';

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
  console.log(stops);
  const t = useTranslations('RouteDetail');
  const [provisionalStops, setProvisionalStops] = useState<Array<IStop>>(stops);
  const handleOnDragEnd = (result: any) => {
    setDraggingIndex(null);
    if (!result.destination) return;
    if (result.destination.droppableId === 'photos') {
      const items = Array.from(provisionalStops);
      const [reorderedItem] = items.splice(result.source.index, 1);
      items.splice(result.destination.index, 0, reorderedItem);
      setProvisionalStops(items);
    }
  };
  const deleteStop = (index: number) => {
    const items = Array.from(provisionalStops);
    items.splice(index, 1);
    setProvisionalStops(items);
  };
  const [draggingIndex, setDraggingIndex] = useState<number | null>(null);
  const [selectedPlace, setSelectedPlace] = useState<string | null>(null);
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
          <span className="hidden md:block">{t('addStop')}</span>{' '}
          <PlusIcon className="h-5 md:ml-4" />
        </button>
      </div>
      <DragDropContext
        onDragEnd={handleOnDragEnd}
        onDragStart={(dragStart: DragStart) => {
          setDraggingIndex(dragStart.source.index);
        }}
      >
        <Droppable droppableId={`photos`} direction="vertical">
          {(provided, snapshot) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className={'overflow-auto rounded bg-monum-green-light p-4'}
            >
              {provisionalStops.map((stop: IStop, index: number) => {
                return (
                  <Draggable
                    key={index}
                    draggableId={index.toString()}
                    index={index}
                  >
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className={`relative ${index !== 0 && 'mt-5'} flex h-[15vh] w-full cursor-pointer rounded p-4 shadow ${index === draggingIndex ? 'bg-monum-green-default' : 'bg-white'}`}
                        onClick={() => setSelectedPlace(stop.place.id)}
                        onMouseDown={(e) => {
                          e.stopPropagation();
                        }}
                      >
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
                        <div className="ml-5 flex-grow">
                          <div
                            className={`text-l font-semibold  ${index === draggingIndex ? 'text-gray-50' : 'text-gray-900'}`}
                          >
                            {stop.place.name}
                          </div>
                          <div
                            className={`text-l  ${montserrat.className} ${index === draggingIndex ? 'text-gray-50' : 'text-gray-700'}`}
                          >
                            {stop.place.name}
                          </div>
                          <div
                            className={`text-l italic ${index === draggingIndex ? 'text-gray-50' : 'text-gray-500'}`}
                          >
                            {stop.place.name}
                          </div>
                        </div>
                        <div className="mr-5 flex h-full items-center justify-center">
                          <Image
                            src={
                              index === draggingIndex
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
                    )}
                  </Draggable>
                );
              })}
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
          <AddStop />
        </div>
      )}
    </div>
  );
}
