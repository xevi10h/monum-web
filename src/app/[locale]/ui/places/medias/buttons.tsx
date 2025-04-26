import { VariablesOf, graphql } from '@/graphql';
import { useMutation } from '@apollo/client';
import { PencilIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import { Link } from '@/navigation';
import { useRouter } from '@/navigation';
import { useState } from 'react';
import Modal from '@/app/[locale]/ui/shared/confirmation-modal';
import { useTranslations } from 'next-intl';
import { useGlobalStore } from '@/zustand/GlobalStore';

export function CreateMedia({ placeId }: { placeId: string }) {
  const t = useTranslations('MediaList');
  return (
    <div className="flex justify-end">
      <div className="max-w-fit">
        <Link
          href={`/dashboard/places/${placeId}/medias/create`}
          className="flex h-10 items-center rounded-lg bg-monum-green-default px-4 text-sm font-medium text-white transition-colors hover:bg-monum-green-default focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-monum-green-default"
        >
          <span className="hidden md:block">{t('addMedia')}</span>{' '}
          <PlusIcon className="h-5 md:ml-4" />
        </Link>
      </div>
    </div>
  );
}

const deleteMediaMutation = graphql(`
  mutation Mutation($deleteMediaId: ID!) {
    deleteMedia(id: $deleteMediaId)
  }
`);

export function DeleteMedia({ id, placeId }: { id: string; placeId: string }) {
  const setIsLoading = useGlobalStore((state) => state.setIsLoading);
  const t = useTranslations('MediaDelete');
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();
  const [deleteMedia, { loading, error }] = useMutation(deleteMediaMutation, {
    onCompleted: () => {
      router.push(`/dashboard/places/${placeId}/medias`);
    },
    onError: (error) => {
      console.error('Delete media error:', error);
    },
    update: (cache) => {
      cache.evict({ fieldName: 'medias' });
      cache.gc();
    },
  });

  setIsLoading(loading);

  const handleDelete = async () => {
    try {
      const variables: VariablesOf<typeof deleteMediaMutation> = {
        deleteMediaId: id,
      };
      await deleteMedia({ variables });
      console.log('Media deleted');
    } catch (error) {
      console.error('Media delete error:', error);
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

export function UpdateMedia({ id, placeId }: { id: string; placeId: string }) {
  return (
    <Link
      href={`/dashboard/places/${placeId}/medias/${id}/edit`}
      className="rounded-md border bg-blue-300 p-2 hover:bg-blue-500"
    >
      <PencilIcon className="w-5" />
    </Link>
  );
}
