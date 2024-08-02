'use client';
import { Link } from '@/navigation';
import { Button } from '@/app/[locale]/ui/button';
import { HashtagIcon, XCircleIcon } from '@heroicons/react/24/solid';
import { useMutation } from '@apollo/client';
import { VariablesOf, graphql } from '@/graphql';
import { useRouter } from '@/navigation';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useGlobalStore } from '@/zustand/GlobalStore';

const CreateMediaMutation = graphql(`
  mutation Mutation(
    $placeId: ID!
    $title: String!
    $text: String
    $type: MediaType!
    $videoBase64: String
    $videoDurationInSeconds: Int
  ) {
    createMedia(
      placeId: $placeId
      title: $title
      text: $text
      type: $type
      videoBase64: $videoBase64
      videoDurationInSeconds: $videoDurationInSeconds
    ) {
      id
    }
  }
`);

export default function Form({ placeId }: { placeId: string }) {
  const setIsLoading = useGlobalStore((state) => state.setIsLoading);
  const t = useTranslations('MediaCreate');
  const generic = useTranslations('Generic');
  const router = useRouter();
  const [videoFile, setVideoFile] = useState<File | null>(null); // State to store the dropped video file
  const [resourceType, setResourceType] = useState('text'); // Default resource type
  const [borderColor, setBorderColor] = useState('border-gray-200'); // Border color for drag-and-drop area

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
    setBorderColor('border-monum-green-default');
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
  setIsLoading(loading);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      if (resourceType === 'video' && !videoFile) {
        alert('Please select a video file.');
        return;
      }

      let videoBase64 = null;

      if (videoFile && typeof videoFile === 'object') {
        const videoElement = document.createElement('video');
        videoElement.preload = 'metadata';
        videoElement.src = URL.createObjectURL(videoFile);
        let duration = 0;
        videoElement.addEventListener('loadedmetadata', () => {
          duration = videoElement.duration;
          URL.revokeObjectURL(videoElement.src); // Clean up
        });
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

            videoBase64: videoBase64,
            videoDurationInSeconds: Math.round(duration),
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
            {t('type')}
          </label>
          <div className="relative">
            <select
              id="type"
              name="type"
              defaultValue={resourceType}
              onChange={(e) => setResourceType(e.target.value)}
              className="peer block w-full rounded-md border border-gray-200 py-2 pl-3 text-sm outline-2 placeholder:text-gray-500"
            >
              <option value="text">{t('typeText')}</option>
              <option value="audio">{t('typeAudio')}</option>
              <option value="video">{t('typeVideo')}</option>
            </select>
          </div>
        </div>
        <div className="relative mt-2 rounded-md">
          <label
            htmlFor="title"
            className="mb-2 block pl-2 text-sm font-medium"
          >
            {t('title')}
          </label>
          <div className="relative">
            <input
              required={true}
              id="title"
              name="title"
              type="string"
              placeholder={t('title')}
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
              {t('text')}:
            </label>
            <div className="relative">
              <textarea
                required={true}
                id="text"
                name="text"
                placeholder={t('textDescription')}
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-3 text-sm outline-2 placeholder:text-gray-500"
              />
            </div>
          </div>
        )}
        {resourceType === 'video' && (
          <div className="relative mt-2 rounded-md">
            <label
              htmlFor="video"
              className="mb-2 block pl-2 text-sm font-medium"
            >
              {t('videoDescription')} <b>.mp4</b>)
            </label>
            <div
              className={`relative cursor-pointer rounded-md border border-dashed p-4 ${borderColor}`}
              onDragOver={preventDefault}
              onDragLeave={() => setBorderColor('border-gray-200')}
              onDrop={handleDrop}
              onMouseEnter={() => setBorderColor('border-monum-green-default')}
              onMouseLeave={() => setBorderColor('border-gray-200')}
            >
              <label
                htmlFor="video"
                className="flex items-center justify-center"
              >
                <span>{videoFile ? '' : t('grabOrAddVideo')}</span>
                <input
                  id="video"
                  name="video"
                  type="file"
                  accept="video/mp4"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
              {/* Render video preview */}
              {videoFile && (
                <div className=" relative" style={{ maxWidth: '400px' }}>
                  <div className="absolute right-0 top-0 z-50 -mr-3 -mt-3">
                    <XCircleIcon
                      onClick={discardVideo}
                      className=" w-8 text-gray-400 hover:text-red-500"
                    />
                  </div>
                  <video controls className=" mt-2">
                    <source src={getVideoSrc(videoFile)} type="video/mp4" />
                    {t('formatNotSupported')}
                  </video>
                </div>
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
          {t('cancel')}
        </Link>

        <div className="flex flex-col items-center text-center">
          <Button disabled={loading} aria-disabled={loading} className="flex">
            {t('save')}
          </Button>
          <p className="mt-2 text-base text-gray-600">
            {loading && generic('loading')}
          </p>
        </div>
      </div>
    </form>
  );
}
