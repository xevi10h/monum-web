'use client';
import Link from 'next/link';
import { Button } from '@/app/ui/button';
import { HashtagIcon } from '@heroicons/react/24/outline';
import { useMutation } from '@apollo/client';
import { VariablesOf, graphql } from '@/graphql';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const CreateMediaMutation = graphql(`
  mutation Mutation(
    $placeId: ID!
    $title: String!
    $text: String
    $type: MediaType!
    $rating: Float!
    $videoBase64: String
  ) {
    createMedia(
      placeId: $placeId
      title: $title
      text: $text
      type: $type
      rating: $rating
      videoBase64: $videoBase64
    ) {
      id
    }
  }
`);

export default function Form({ placeId }: { placeId: string }) {
  const router = useRouter();
  const [videoFile, setVideoFile] = useState<File | null>(null); // State to store the dropped video file
  const [resourceType, setResourceType] = useState('text'); // Default resource type

  // Handle file drop
  const handleDrop = (event: any) => {
    event.preventDefault();
    const droppedFile = event.dataTransfer.files[0];
    if (droppedFile && droppedFile.type === 'video/mp4') {
      setVideoFile(droppedFile);
    } else {
      alert('Please drop a valid MP4 video file.');
    }
  };

  // Prevent default behavior for drag events
  const preventDefault = (event: any) => {
    event.preventDefault();
    event.stopPropagation();
  };

  // Handle file input change
  const handleFileChange = (event: any) => {
    const selectedFile = event.target.files[0];
    if (selectedFile && selectedFile.type === 'video/mp4') {
      setVideoFile(selectedFile);
    } else {
      alert('Please select a valid MP4 video file.');
    }
  };

  const [createMedia, { loading, error }] = useMutation(CreateMediaMutation, {
    onError: (error) => console.error('Create media error:', error),
    onCompleted: (data) => {
      if (data.createMedia?.id) {
        const redirect = `/dashboard/places/${placeId}/medias`;
        router.push(redirect);
      } else {
        console.log('Failed creating media', data);
      }
    },
  });
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      if (resourceType === 'video' && !videoFile) {
        alert('Please select a video file.');
        return;
      }

      let videoBase64 = null;

      if (videoFile && typeof videoFile === 'object') {
        // Create a new FileReader instance
        const reader = new FileReader();

        // Define a callback function to execute when the file is read
        reader.onload = async () => {
          // Read the content of the file as a base64 encoded string
          videoBase64 = reader.result as string;
          videoBase64 = videoBase64.split(',')[1];

          // Proceed with your logic here, for example, making a GraphQL mutation
          const variables: VariablesOf<typeof CreateMediaMutation> = {
            placeId,
            title: e.target.title.value,
            type: e.target.type.value,
            rating: parseFloat(e.target.rating.value),
            videoBase64: videoBase64,
          };
          await createMedia({ variables });
        };

        // Read the video file as a data URL
        reader.readAsDataURL(videoFile);
      } else {
        // Proceed with your logic here if no video file is uploaded
        const variables: VariablesOf<typeof CreateMediaMutation> = {
          placeId,
          title: e.target.title.value,
          text: e.target.text.value,
          type: e.target.type.value,
          rating: parseFloat(e.target.rating.value),
        };
        await createMedia({ variables });
      }
    } catch (error) {
      console.error('Create media error:', error);
    }
  };

  function getVideoSrc(videoFile: any): string | undefined {
    return URL.createObjectURL(videoFile);
  }

  const discardVideo = () => {
    setVideoFile(null); // Reset video file
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        <div className="relative mt-2 rounded-md">
          <label htmlFor="type" className="mb-2 block pl-2 text-sm font-medium">
            Tipus de recurs:
          </label>
          <div className="relative">
            <select
              id="type"
              name="type"
              defaultValue={resourceType}
              onChange={(e) => setResourceType(e.target.value)}
              className="peer block w-full rounded-md border border-gray-200 py-2 pl-3 text-sm outline-2 placeholder:text-gray-500"
            >
              <option value="text">Text</option>
              <option value="audio">Àudio</option>
              <option value="video">Vídeo</option>
            </select>
          </div>
        </div>
        <div className="relative mt-2 rounded-md">
          <label
            htmlFor="title"
            className="mb-2 block pl-2 text-sm font-medium"
          >
            Títol:
          </label>
          <div className="relative">
            <input
              id="title"
              name="title"
              type="string"
              placeholder="Títol"
              className="peer block w-full rounded-md border border-gray-200 py-2 pl-3 text-sm outline-2 placeholder:text-gray-500"
            />
          </div>
        </div>
        {(resourceType === 'text' || resourceType === 'audio') && (
          <div className="relative mt-2 rounded-md">
            <label
              htmlFor="text"
              className="mb-2 block pl-2 text-sm font-medium"
            >
              Text:
            </label>
            <div className="relative">
              <textarea
                id="text"
                name="text"
                placeholder="Contingut en text del recurs..."
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-3 text-sm outline-2 placeholder:text-gray-500"
              />
            </div>
          </div>
        )}
        <div className="relative mt-2 rounded-md">
          <label
            htmlFor="rating"
            className="mb-2 block pl-2 text-sm font-medium"
          >
            Qualificació o importància del recurs:
          </label>
          <div className="relative">
            <input
              id="rating"
              name="rating"
              type="number"
              min={0.0}
              max={10.0}
              step={0.1}
              placeholder="Qualificació"
              className="peer block w-full rounded-md border border-gray-200 py-2 pl-8 text-sm outline-2 placeholder:text-gray-500"
            />
            <HashtagIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
          </div>
        </div>
        {resourceType === 'video' && (
          <div className="relative mt-2 rounded-md">
            <label
              htmlFor="video"
              className="mb-2 block pl-2 text-sm font-medium"
            >
              Video (MP4):
            </label>
            <div
              className="relative cursor-pointer rounded-md border border-dashed border-gray-200 p-4"
              onDragOver={preventDefault}
              onDrop={handleDrop}
            >
              <label
                htmlFor="video"
                className="flex items-center justify-center"
              >
                <span>
                  {videoFile
                    ? ''
                    : 'Drag and drop your MP4 video here, or click to select.'}
                </span>
                <input
                  id="video"
                  name="video"
                  type="file"
                  accept="video/mp4"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
              {/* Render video preview and discard button */}
              {videoFile && (
                <div className="absolute right-0 top-0 m-2">
                  <button
                    onClick={discardVideo}
                    className="rounded-full bg-gray-200 p-1 hover:bg-red-200"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-gray-500 hover:text-red-500"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M14.707 5.293a1 1 0 011.414 1.414L11.414 12l4.707 4.707a1 1 0 11-1.414 1.414L10 13.414l-4.707 4.707a1 1 0 01-1.414-1.414L8.586 12 3.879 7.293a1 1 0 111.414-1.414L10 10.586l4.707-4.707a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </div>
              )}
              {/* Render video preview */}
              {videoFile && (
                <video controls className="mt-2 max-w-full">
                  <source src={getVideoSrc(videoFile)} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              )}
            </div>
          </div>
        )}
      </div>
      <div className="mt-6 flex justify-end gap-4">
        <Link
          href={`/dashboard/places/${placeId}/medias`}
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          Cancel·lar
        </Link>

        <div className="flex flex-col items-center text-center">
          <Button disabled={loading} aria-disabled={loading} className="flex">
            Afegir Recurs
          </Button>
          <p className="mt-2 text-base text-gray-600">
            {loading && 'Carregant...'}
          </p>
        </div>
      </div>
    </form>
  );
}
