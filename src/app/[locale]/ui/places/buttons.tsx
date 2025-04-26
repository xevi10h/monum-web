import { VariablesOf, graphql } from '@/graphql';
import { useMutation } from '@apollo/client';
import {
  PencilIcon,
  TrashIcon,
  PlusIcon,
  FolderIcon,
  FolderOpenIcon,
  PhotoIcon,
  ListBulletIcon,
  MapIcon,
  LanguageIcon,
} from '@heroicons/react/24/outline';
import { Link, useRouter } from '@/navigation';
import { useState } from 'react';
import Modal from '@/app/[locale]/ui/shared/confirmation-modal';
import { useTranslations } from 'next-intl';
import { useGlobalStore } from '@/zustand/GlobalStore';
import TranslationModal from '../shared/translation-modal';

export function NavigateToPhotos({ id }: { id: string }) {
  const [isHovered, setIsHovered] = useState(false);
  return (
    <Link
      href={`/dashboard/places/${id}/photos`}
      className="relative rounded-md border bg-green-300 p-2 hover:bg-green-500"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <PhotoIcon className={`w-5`} />
    </Link>
  );
}

export function NavigateToMedias({ id }: { id: string }) {
  const [isHovered, setIsHovered] = useState(false);
  return (
    <Link
      href={`/dashboard/places/${id}/medias`}
      className="relative rounded-md border bg-gray-300 p-2 hover:bg-gray-500"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <FolderOpenIcon className={`w-5 ${isHovered ? 'block' : 'hidden'}`} />
      <FolderIcon className={`w-5 ${isHovered ? 'hidden' : 'block'}`} />
    </Link>
  );
}

export function CreatePlace() {
  const t = useTranslations('MonumsList');
  return (
    <Link
      href="/dashboard/places/create"
      className="flex h-10 items-center rounded-lg bg-monum-green-default px-4 text-sm font-medium text-white transition-colors hover:bg-monum-green-default focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-monum-green-default"
    >
      <span className="hidden md:block">{t('addMonum')}</span>{' '}
      <PlusIcon className="h-5 md:ml-4" />
    </Link>
  );
}

export function UpdatePlace({ id }: { id: string }) {
  return (
    <Link
      href={`/dashboard/places/${id}/edit`}
      className="rounded-md border bg-blue-300 p-2 hover:bg-blue-500"
    >
      <PencilIcon className="w-5" />
    </Link>
  );
}

const deletePlaceMutation = graphql(`
  mutation Mutation($deletePlaceId: ID!) {
    deletePlace(id: $deletePlaceId)
  }
`);

export function DeletePlace({ id }: { id: string }) {
  const setIsLoading = useGlobalStore((state) => state.setIsLoading);
  const t = useTranslations('MonumDelete');
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();
  const [deletePlace, { loading, error }] = useMutation(deletePlaceMutation, {
    onCompleted: () => {
      console.log('Place deleted');
      router.push('/dashboard/places/list');
    },
    onError: (error) => {
      console.error('Delete place error:', error);
    },
    update: (cache) => {
      cache.evict({ fieldName: 'getPlaceBySearchAndPagination' });
      cache.gc();
    },
  });
  setIsLoading(loading);

  const handleDelete = async () => {
    try {
      const variables: VariablesOf<typeof deletePlaceMutation> = {
        deletePlaceId: id,
      };
      await deletePlace({ variables });
      console.log('Place deleted');
    } catch (error) {
      console.error('Place delete error:', error);
    }
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    setShowModal(true);
  };

  const handleConfirmation = () => {
    setShowModal(false);
    handleDelete();
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <button className="rounded-md border bg-red-300 p-2 hover:bg-red-500">
          <span className="sr-only">Delete</span>
          <TrashIcon className="w-5" />
        </button>
      </form>
      {showModal && (
        <Modal
          title={t('title')}
          message={t('message')}
          closeClassName="bg-gray-300 hover:bg-gray-400"
          confirmClassName="bg-red-500 hover:bg-red-600"
          onClose={handleCloseModal}
          onConfirm={handleConfirmation}
        />
      )}
    </>
  );
}

interface TogglePlaceViewProps {
  view: 'list' | 'map';
}

export const TogglePlaceView: React.FC<TogglePlaceViewProps> = ({
  view,
}: TogglePlaceViewProps) => {
  const router = useRouter();
  return (
    <div className="flex justify-center gap-4 p-4">
      <button
        className={`rounded-full p-2 ${view === 'list' ? 'bg-blue-500' : 'bg-gray-300'} shadow-lg`}
        onClick={() => router.push('/dashboard/places/list')}
      >
        <ListBulletIcon className="h-6 w-6 text-white" />
      </button>
      <button
        className={`rounded-full p-2 ${view === 'map' ? 'bg-blue-500' : 'bg-gray-300'} shadow-lg`}
        onClick={() => router.push('/dashboard/places/map')}
      >
        <MapIcon className="h-6 w-6 text-white" />
      </button>
    </div>
  );
};

export function TranslatePlace({ id }: { id: string }) {
  const setIsLoading = useGlobalStore((state) => state.setIsLoading);
  const t = useTranslations('MonumDelete');
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();
  const [deletePlace, { loading, error }] = useMutation(deletePlaceMutation, {
    onCompleted: () => {
      console.log('Place deleted');
      router.push('/dashboard/places/list');
    },
    onError: (error) => {
      console.error('Delete place error:', error);
    },
    update: (cache) => {
      cache.evict({ fieldName: 'getPlaceBySearchAndPagination' });
      cache.gc();
    },
  });
  setIsLoading(loading);

  const handleDelete = async () => {
    try {
      const variables: VariablesOf<typeof deletePlaceMutation> = {
        deletePlaceId: id,
      };
      await deletePlace({ variables });
      console.log('Place deleted');
    } catch (error) {
      console.error('Place delete error:', error);
    }
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    setShowModal(true);
  };

  const handleConfirmation = () => {
    setShowModal(false);
    handleDelete();
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <button className="rounded-md border bg-amber-300 p-2 hover:bg-amber-500">
          <span className="sr-only">Delete</span>
          <LanguageIcon className="w-5" />
        </button>
      </form>
      {showModal && (
        <TranslationModal
          onClose={handleCloseModal}
          onConfirm={handleConfirmation}
        />
      )}
    </>
  );
}
