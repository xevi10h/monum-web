'use client';
import { Link } from '@/navigation';
import { Button } from '@/app/[locale]/ui/button';
import { useMutation } from '@apollo/client';
import { VariablesOf, graphql } from '@/graphql';
import { useRouter } from '@/navigation';
import { useEffect, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { useGlobalStore } from '@/zustand/GlobalStore';
import { IMedia } from '@/shared/interfaces/IMedia';
import { translateMedias } from '@/app/[locale]/dashboard/places/[id]/medias/translations';
import { Language } from '@/shared/types/Language';
import VideoPreview from './VideoPreview';
import { MediaType } from '@/shared/types/MediaType';
import { Locale, LocaleToLanguage } from '@/shared/types/Locale';

const UpdateMediaMutation = graphql(`
  mutation UpdateMediaFull(
    $updateMediaFullId: ID!
    $updateMediaFull: UpdateMediaFullInput!
  ) {
    updateMediaFull(id: $updateMediaFullId, updateMediaFull: $updateMediaFull) {
      id
    }
  }
`);

export default function Form({
  placeId,
  media,
}: {
  placeId: string;
  media: IMedia;
}) {
  const setIsLoading = useGlobalStore((state) => state.setIsLoading);
  const languages = useTranslations('Languages');
  const locale = useLocale() as Locale;
  const [selectedLanguage, setSelectedLanguage] = useState(
    LocaleToLanguage[locale],
  );
  const [mediaUpdate, setMediaUpdate] = useState<Partial<IMedia>>({});
  const generic = useTranslations('Generic');
  const router = useRouter();
  const [videoFiles, setVideoFiles] = useState<{
    [key: string]: { type: 'url' | 'file'; data: string | File };
  }>({});
  const [languagesWithVideos, setLanguagesWithVideos] = useState<string[]>([]);

  const [borderColor, setBorderColor] = useState('border-gray-200'); // Border color for drag-and-drop area

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedLanguage(e.target.value as Language);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    let [key, language] = name.split('-');
    setMediaUpdate({
      ...mediaUpdate,
      [key]: {
        ...(mediaUpdate[key as keyof IMedia] as any),
        [language]: value,
      },
    });
  };

  useEffect(() => {
    setMediaUpdate(media);
    if (media.type === 'video' && media.url && typeof media.url === 'object') {
      console.log('media.url:', media.url);
      const initialFiles = Object.entries(media.url).reduce(
        (acc, [key, value]) => {
          acc[key] = { type: 'url', data: value };
          return acc;
        },
        {} as { [key: string]: { type: 'url' | 'file'; data: string | File } },
      );
      setVideoFiles(initialFiles);
      setLanguagesWithVideos(Object.keys(initialFiles));
    }
  }, [media]);

  // Handle file drop
  const handleDrop = (event: any) => {
    event.preventDefault();
    const droppedFile = event.dataTransfer.files[0];
    if (droppedFile && droppedFile.type === 'video/mp4') {
      setVideoFiles({
        ...videoFiles,
        [selectedLanguage]: { type: 'file', data: droppedFile },
      });
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
      setVideoFiles({
        ...videoFiles,
        [selectedLanguage]: { type: 'file', data: selectedFile },
      });
    } else {
      alert('Please select a valid MP4 video file.');
    }
  };

  const [updateMedia, { loading, error }] = useMutation(UpdateMediaMutation, {
    onError: (error) => console.error('Update media error:', error),
    onCompleted: (data) => {
      if (data?.updateMediaFull?.id) {
        const redirect = `/dashboard/places/${placeId}/medias`;
        router.push(redirect);
      } else {
        console.log('Failed updating media', data);
      }
    },
    update: (cache) => {
      cache.evict({
        id: cache.identify({ __typename: 'MediaFull', id: media.id }),
      });
      cache.evict({ fieldName: 'medias' });
      cache.gc();
    },
  });
  setIsLoading(loading);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const objectEntriesToArrays = (obj: { [key: string]: string }) =>
      Object.entries(obj).map(([key, value]) => ({ key, value }));

    try {
      if (mediaUpdate.type === 'text' || mediaUpdate.type === 'audio') {
        // Proceder con la lógica para texto o audio
        const variables: VariablesOf<typeof UpdateMediaMutation> = {
          updateMediaFull: {
            placeId,
            title: mediaUpdate?.title
              ? objectEntriesToArrays(mediaUpdate.title)
              : [],
            text: mediaUpdate?.text
              ? objectEntriesToArrays(mediaUpdate.text)
              : [],
            type: e.target.type.value,
          },
          updateMediaFullId: media.id,
        };
        await updateMedia({ variables });
      }

      if (mediaUpdate.type === 'video') {
        const videoPromises = Object.keys(videoFiles).map((language) => {
          const videoFile = videoFiles[language];

          if (videoFile.type === 'url') {
            return Promise.resolve({ language, base64: null, duration: null });
          }

          return new Promise<{
            language: string;
            base64: string;
            duration: number;
          }>((resolve, reject) => {
            const reader = new FileReader();
            const videoElement = document.createElement('video');

            videoElement.preload = 'metadata';
            videoElement.src = URL.createObjectURL(videoFile.data as File);
            videoElement.onloadedmetadata = () => {
              const duration = videoElement.duration;
              URL.revokeObjectURL(videoElement.src); // Limpiar
              reader.onload = () => {
                const base64 = (reader.result as string).split(',')[1];
                resolve({ language, base64, duration });
              };
              reader.onerror = reject;
              reader.readAsDataURL(videoFile.data as File);
            };
            videoElement.onerror = reject;
          });
        });

        const videos = await Promise.all(videoPromises);
        const updateMediaFullInput = {
          placeId,
          title: mediaUpdate?.title
            ? objectEntriesToArrays(mediaUpdate.title)
            : [],
          text: mediaUpdate?.text
            ? objectEntriesToArrays(mediaUpdate.text)
            : [],
          type: mediaUpdate?.type,
          videoBase64: videos
            .filter((video) => video.base64)
            .map((video) => ({
              key: video.language,
              value: video.base64 as string,
            })),
          videoDurationInSeconds: videos
            .filter((video) => video.duration)
            .map((video) => ({
              key: video.language,
              value: video.duration as number,
            })),
          videosToDelete: languagesWithVideos.filter(
            (language) => !Object.keys(videoFiles).includes(language),
          ) as Language[],
        };

        await updateMedia({
          variables: {
            updateMediaFull: updateMediaFullInput,
            updateMediaFullId: media.id,
          },
        });
      }
    } catch (error) {
      console.error('Update media error:', error);
    }
  };

  const discardVideo = (language: string) => {
    const updatedVideoFiles = { ...videoFiles };
    delete updatedVideoFiles[language];
    setVideoFiles(updatedVideoFiles);
  };

  console.log('mediaUpdate:', mediaUpdate);

  return (
    <form onSubmit={handleSubmit}>
      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        <div className="mb-4">
          <div className="mb-4 flex flex-row justify-between">
            <label
              htmlFor="basicInfo"
              className="text-m mb-2 block font-medium"
            >
              {translateMedias('basicInfo', selectedLanguage)}
            </label>
            <div className="flex flex-row items-center gap-4">
              <label
                htmlFor="title"
                className="font-small block text-sm font-medium"
              >
                {translateMedias('language', selectedLanguage)}:
              </label>
              <select
                id="language"
                name="language"
                className="rounded-md border border-gray-200 py-2 pl-3 text-sm text-gray-700"
                value={selectedLanguage}
                onChange={handleLanguageChange}
              >
                <option value="ca_ES">{languages('ca_ES')}</option>
                <option value="es_ES">{languages('es_ES')}</option>
                <option value="en_US">{languages('en_US')}</option>
                <option value="fr_FR">{languages('fr_FR')}</option>
              </select>
            </div>
          </div>
        </div>
        <div className="relative mt-2 rounded-md">
          <label htmlFor="type" className="mb-2 block pl-2 text-sm font-medium">
            {translateMedias('type', selectedLanguage)}:
          </label>
          <div className="relative">
            <select
              id="type"
              name="type"
              defaultValue={mediaUpdate?.type}
              value={mediaUpdate?.type}
              onChange={(e) =>
                setMediaUpdate({
                  ...mediaUpdate,
                  type: e.target.value as MediaType,
                })
              }
              className="peer block w-full rounded-md border border-gray-200 py-2 pl-3 text-sm outline-2 placeholder:text-gray-500"
            >
              <option value="text">
                {translateMedias('typeText', selectedLanguage)}
              </option>
              <option value="audio">
                {translateMedias('typeAudio', selectedLanguage)}
              </option>
              <option value="video">
                {translateMedias('typeVideo', selectedLanguage)}
              </option>
            </select>
          </div>
        </div>
        <div className="relative mt-2 rounded-md">
          <label
            htmlFor="title"
            className="mb-2 block pl-2 text-sm font-medium"
          >
            {translateMedias('title', selectedLanguage)}:
          </label>
          <div className="relative">
            <input
              required={true}
              id={`title-${selectedLanguage}`}
              name={`title-${selectedLanguage}`}
              type="string"
              value={mediaUpdate?.title?.[selectedLanguage] || ''}
              onChange={handleInputChange}
              placeholder={translateMedias('title', selectedLanguage)}
              className="peer block w-full rounded-md border border-gray-200 py-2 pl-3 text-sm outline-2 placeholder:text-gray-500"
            />
          </div>
        </div>
        {(mediaUpdate.type === 'text' || mediaUpdate.type === 'audio') && (
          <div className="relative mt-2 rounded-md">
            <label
              htmlFor="text"
              className="mb-2 block pl-2 text-sm font-medium"
            >
              {translateMedias('text', selectedLanguage)}:
            </label>
            <div className="relative">
              <textarea
                required={true}
                id={`text-${selectedLanguage}`}
                name={`text-${selectedLanguage}`}
                value={mediaUpdate?.text?.[selectedLanguage] || ''}
                onChange={handleInputChange}
                placeholder={translateMedias(
                  'textDescription',
                  selectedLanguage,
                )}
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-3 text-sm outline-2 placeholder:text-gray-500"
              />
            </div>
          </div>
        )}
        {mediaUpdate.type === 'video' && (
          <div className="relative mt-2 rounded-md">
            <label
              htmlFor="video"
              className="mb-2 block pl-2 text-sm font-medium"
            >
              {translateMedias('videoDescription', selectedLanguage)}{' '}
              <b>.mp4</b>
              {')'}
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
                <span>
                  <span>
                    {videoFiles[selectedLanguage]
                      ? ''
                      : translateMedias('grabOrAddVideo', selectedLanguage)}
                  </span>
                  <input
                    id="video"
                    name="video"
                    type="file"
                    accept="video/mp4"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </span>
              </label>
              <span>
                {Object.keys(videoFiles).map((language) => {
                  const videoData = videoFiles[language];
                  const videoUrl =
                    videoData.type === 'url'
                      ? (videoData.data as string)
                      : URL.createObjectURL(videoData.data as File);

                  return (
                    <VideoPreview
                      key={'video-preview-' + language}
                      language={selectedLanguage}
                      videoUrl={videoUrl}
                      discardVideo={() => discardVideo(language)}
                      hidden={selectedLanguage !== language}
                    />
                  );
                })}
              </span>
            </div>
          </div>
        )}
      </div>
      <div className="mt-6 flex justify-end gap-4">
        <Link
          href={`/dashboard/places/${placeId}/medias`}
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          {translateMedias('cancel', selectedLanguage)}
        </Link>

        <div className="flex flex-col items-center text-center">
          <Button disabled={loading} aria-disabled={loading} className="flex">
            {translateMedias('save', selectedLanguage)}
          </Button>
          <p className="mt-2 text-base text-gray-600">
            {loading && generic('loading')}
          </p>
        </div>
      </div>
    </form>
  );
}
