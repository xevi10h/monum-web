import { translateMedias } from '@/app/[locale]/dashboard/places/[id]/medias/translations';
import { Language } from '@/shared/types/Language';
import { XCircleIcon } from '@heroicons/react/24/solid';

interface VideoProps {
  language: Language;
  videoUrl: string;
  discardVideo: () => void;
  hidden: boolean;
}

export default function VideoPreview({
  language,
  videoUrl,
  discardVideo,
  hidden,
}: VideoProps) {
  return (
    <div
      className={`relative ${hidden && 'hidden'}`}
      style={{ maxWidth: '400px' }}
    >
      <div className="absolute right-0 top-0 z-50 -mr-3 -mt-3">
        <XCircleIcon
          onClick={discardVideo}
          className="w-8 text-gray-400 hover:text-red-500"
        />
      </div>
      <video controls className="mt-2">
        <source src={videoUrl} type="video/mp4" />
        {translateMedias('formatNotSupported', language)}
      </video>
    </div>
  );
}
