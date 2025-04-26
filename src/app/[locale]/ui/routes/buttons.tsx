import { VariablesOf, graphql } from '@/graphql';
import { useMutation } from '@apollo/client';
import {
  PencilIcon,
  TrashIcon,
  PlusIcon,
  MapIcon,
} from '@heroicons/react/24/outline';
import { Link, useRouter } from '@/navigation';
import { useState } from 'react';
import Modal from '@/app/[locale]/ui/shared/confirmation-modal';
import { useTranslations } from 'next-intl';
import { useGlobalStore } from '@/zustand/GlobalStore';

export function CreateRoute() {
  const t = useTranslations('RoutesList');
  return (
    <Link
      href="/dashboard/routes/create"
      className="flex h-10 items-center rounded-lg bg-monum-green-default px-4 text-sm font-medium text-white transition-colors hover:bg-monum-green-default focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-monum-green-default"
    >
      <span className="hidden md:block">{t('addRoute')}</span>{' '}
      <PlusIcon className="h-5 md:ml-4" />
    </Link>
  );
}

export function ViewRouteInMap({ id }: { id: string }) {
  return (
    <Link
      href={`/dashboard/routes/${id}/map`}
      className="relative rounded-md border bg-monum-green-light p-2 hover:bg-monum-green-hover"
    >
      <MapIcon className="w-5" />
    </Link>
  );
}

export function UpdateRoute({ id }: { id: string }) {
  return (
    <Link
      href={`/dashboard/routes/${id}/edit`}
      className="rounded-md border bg-blue-300 p-2 hover:bg-blue-500"
    >
      <PencilIcon className="w-5" />
    </Link>
  );
}

const deleteRouteMutation = graphql(`
  mutation Mutation($deleteRouteId: ID!) {
    deleteRoute(id: $deleteRouteId)
  }
`);

export function DeleteRoute({ id }: { id: string }) {
  const setIsLoading = useGlobalStore((state) => state.setIsLoading);
  const t = useTranslations('RouteDelete');
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();
  const [deleteRoute, { loading, error }] = useMutation(deleteRouteMutation, {
    onCompleted: () => {
      router.push('/dashboard/routes');
    },
    onError: (error) => {
      console.error('Delete route error:', error);
    },
    update: (cache) => {
      cache.evict({ fieldName: 'routesPaginated' });
      cache.gc();
    },
  });
  setIsLoading(loading);

  const handleDelete = async () => {
    try {
      const variables: VariablesOf<typeof deleteRouteMutation> = {
        deleteRouteId: id,
      };
      await deleteRoute({ variables });
    } catch (error) {
      console.error('Route delete error:', error);
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
