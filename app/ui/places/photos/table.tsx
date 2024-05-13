'use client';
import { CSSProperties, useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import {
  DragDropContext,
  Droppable,
  Draggable,
  DragStart,
} from 'react-beautiful-dnd';
import Link from 'next/link';
import { Button } from '../../button';
import { useMutation } from '@apollo/client';
import { VariablesOf, graphql } from '@/graphql';
import { useRouter } from 'next/navigation';
import { PlusIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { montserrat } from '../../fonts';

type OldPhoto = {
  id: string;
  url: string;
  sizes: {
    small: string;
    medium: string;
    large: string;
    original: string;
  };
  createdBy: {
    username: string | null;
  };
  createdAt: Date;
  updatedAt: Date;
  order: number;
  name?: string;
};

type NewPhoto = {
  name: string;
  url: string;
  file: File;
  order?: number;
};

interface PhotosTableProps {
  photos: OldPhoto[];
  placeId: string;
}

const UpdatePlacePhotosMutation = graphql(`
  mutation Mutation(
    $updatePlacePhotosId: ID!
    $oldPhotos: [OldPhotosUpdateInput!]!
    $newPhotos: [NewPhotosUpdateInput]
  ) {
    updatePlacePhotos(
      id: $updatePlacePhotosId
      oldPhotos: $oldPhotos
      newPhotos: $newPhotos
    )
  }
`);

export default function PhotosTable({ photos, placeId }: PhotosTableProps) {
  const router = useRouter();
  const dateFormater = new Intl.DateTimeFormat('ca-ES', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
  });
  const [updatePlacePhotos, { loading, error }] = useMutation(
    UpdatePlacePhotosMutation,
    {
      onError: (error) => console.error('Update place error', error),
      onCompleted: (data) => {
        if (data.updatePlacePhotos) {
          const redirect = '/dashboard/places/list';
          router.push(redirect);
        } else {
          console.log('Failed updating place', data);
        }
      },
      update: (cache) => {
        cache.evict({
          id: cache.identify({ __typename: 'Place', id: placeId }),
        });
        cache.evict({ fieldName: 'getPlaceBySearchAndPagination' });
        cache.gc();
      },
    },
  );
  const [provisionalPhotos, setProvisionalPhotos] =
    useState<Array<OldPhoto | NewPhoto>>(photos);
  console.log('provisionalPhotos', provisionalPhotos);

  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [draggingIndex, setDraggingIndex] = useState<number | null>(null);
  const [inputImage, setInputImage] = useState<boolean>(false);

  const handleOnDragEnd = (result: any) => {
    setDraggingIndex(null);
    if (!result.destination) return;
    if (result.destination.droppableId === 'photos') {
      const items = Array.from(provisionalPhotos);
      const [reorderedItem] = items.splice(result.source.index, 1);
      items.splice(result.destination.index, 0, reorderedItem);
      setProvisionalPhotos(items);
    }
  };

  const deletePhoto = (index: number) => {
    const items = Array.from(provisionalPhotos);
    items.splice(index, 1);
    setProvisionalPhotos(items);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      const provisionalPhotosWithOrder = provisionalPhotos.map(
        (photo, index) => ({
          ...photo,
          order: index,
        }),
      );

      const oldPhotos = provisionalPhotosWithOrder.filter(
        (photo) => 'id' in photo,
      ) as OldPhoto[];

      const newPhotos = provisionalPhotosWithOrder.filter(
        (photo) => !('id' in photo),
      ) as NewPhoto[];

      // Convert newPhotos to base64
      const convertedNewPhotos = await Promise.all(
        newPhotos.map(async (photo) => {
          const photoBase64 = await convertFileToBase64(photo.file);
          return {
            photoBase64,
            order: photo.order,
            name: photo.name,
          };
        }),
      );

      const variables: VariablesOf<typeof UpdatePlacePhotosMutation> = {
        updatePlacePhotosId: placeId,
        oldPhotos: oldPhotos.map((photo) => ({
          id: photo.id,
          order: photo.order,
        })),
        newPhotos: convertedNewPhotos,
      };

      await updatePlacePhotos({ variables });
    } catch (error) {
      console.error('Update place error', error);
    }
  };

  const convertFileToBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = e.target.files;
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (
          file.type === 'image/jpeg' ||
          file.type === 'image/png' ||
          file.type === 'image/jpg'
        ) {
          setProvisionalPhotos((prev) => {
            let newName = file.name;
            let counter = 0;
            const regex = /(.+?)(?:\((\d+)\))?(\.[^.]*$|$)/;

            while (prev.some((photo) => photo.name === newName)) {
              const match = regex.exec(file.name);
              if (match) {
                const base = match[1];
                const extension = match[3] || '';
                counter++;
                newName = `${base}(${counter})${extension}`;
              } else {
                newName = `${file.name}(${counter})`;
              }
            }
            return [
              ...prev,
              {
                name: newName,
                url: URL.createObjectURL(file),
                file,
              },
            ];
          });
          setInputImage(false);
        } else {
          alert('Please select a valid image file.');
        }
      }
    }
  }, []);

  const [dragging, setDragging] = useState(false);

  const handleDragIn = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDragOut = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setDragging(true);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const files = e.dataTransfer.files;
      console.log('Dropped files', files);
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (
          file.type === 'image/jpeg' ||
          file.type === 'image/png' ||
          file.type === 'image/jpg'
        ) {
          setProvisionalPhotos((prev) => {
            let newName = file.name;
            let counter = 0;
            const regex = /(.+?)(?:\((\d+)\))?(\.[^.]*$|$)/;

            while (prev.some((photo) => photo.name === newName)) {
              const match = regex.exec(file.name);
              if (match) {
                const base = match[1];
                const extension = match[3] || '';
                counter++;
                newName = `${base}(${counter})${extension}`;
              } else {
                newName = `${file.name}(${counter})`;
              }
            }
            return [
              ...prev,
              {
                name: newName,
                url: URL.createObjectURL(file),
                file,
              },
            ];
          });
          setInputImage(false);
        } else {
          alert('Please select a valid image file.');
        }
      }
      e.dataTransfer.clearData();
    }
  }, []);

  return (
    <div
      className=" flex h-[80vh] flex-col"
      onClick={() => setInputImage(false)}
    >
      <div className="flex justify-end">
        <button
          onClick={(e) => {
            e.stopPropagation();
            setInputImage(!inputImage);
          }}
          className={`flex h-10 items-center rounded-lg ${inputImage ? 'bg-gray-100  text-gray-600' : 'bg-monum-green-default text-white'} px-4 text-sm font-medium `}
        >
          <span className="hidden md:block">
            {inputImage ? 'Cancel·lar' : 'Afegir Foto'}
          </span>{' '}
          {inputImage ? (
            <XMarkIcon className="h-5 md:ml-4" />
          ) : (
            <PlusIcon className="h-5 md:ml-4" />
          )}
        </button>
      </div>
      {inputImage && (
        <div
          className="container mx-auto px-4 py-6"
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <div
            className={`border-2 border-dashed p-6 ${dragging ? 'border-green-500 bg-green-100' : 'border-gray-300'} cursor-pointer rounded-md`}
            onDragEnter={handleDragIn}
            onDragLeave={handleDragOut}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={() => document.getElementById('fileInput')?.click()}
          >
            <p className="text-center text-gray-500">
              Arrossega les teves fotos aquí o fes clic per seleccionar-les
            </p>
            <input
              id="fileInput"
              type="file"
              multiple
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handleChange}
            />
          </div>
        </div>
      )}
      <div className="mt-5 flex-grow overflow-auto">
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
                {provisionalPhotos.map(
                  (photo: OldPhoto | NewPhoto, index: number) => {
                    const isOldPhoto = 'id' in photo;
                    return (
                      <Draggable
                        key={isOldPhoto ? photo.id : index}
                        draggableId={isOldPhoto ? photo.id : index.toString()}
                        index={index}
                      >
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`relative ${index !== 0 && 'mt-5'} flex h-[15vh] w-full cursor-pointer rounded p-4 shadow ${index === draggingIndex ? 'bg-monum-green-default' : 'bg-white'}`}
                            onClick={() => setSelectedImage(photo.url)}
                            onMouseDown={(e) => {
                              e.stopPropagation();
                            }}
                          >
                            <div className="flex-shrink-0">
                              <Image
                                src={photo.url}
                                alt={`Photo ${index + 1}`}
                                width={1000}
                                height={1000}
                                style={{ objectFit: 'cover' }}
                                className="h-full w-[15vh] rounded"
                              />
                            </div>
                            <div className="ml-5 flex-grow">
                              <div
                                className={`text-l font-semibold  ${index === draggingIndex ? 'text-gray-50' : 'text-gray-900'}`}
                              >
                                {`Foto ${index + 1}`}
                              </div>
                              <div
                                className={`text-l  ${montserrat.className} ${index === draggingIndex ? 'text-gray-50' : 'text-gray-700'}`}
                              >
                                {isOldPhoto
                                  ? `Creada el ${dateFormater.format(photo.createdAt)} per ${photo.createdBy.username}`
                                  : 'Nova foto'}
                              </div>
                              <div
                                className={`text-l italic ${index === draggingIndex ? 'text-gray-50' : 'text-gray-500'}`}
                              >
                                {photo?.name}
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
                                deletePhoto(index);
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
                  },
                )}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>
      <div className="mt-6 flex justify-center gap-4">
        <Link
          href="/dashboard/places/list"
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          Cancel·lar
        </Link>
        <Button
          disabled={loading}
          aria-disabled={loading}
          onClick={handleSubmit}
        >
          Actualitza
        </Button>
      </div>
      {selectedImage && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
          onClick={() => {
            setSelectedImage(null);
          }}
        >
          <div className="relative h-[80vh] w-[80vw] rounded-lg">
            <Image
              src={selectedImage}
              alt="Selected"
              layout="fill"
              objectFit="contain"
              sizes="2000px"
            />
          </div>
        </div>
      )}
    </div>
  );
}
