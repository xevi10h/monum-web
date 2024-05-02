import { VariablesOf, graphql } from '@/graphql';
import { useMutation } from '@apollo/client';
import {
  PencilIcon,
  TrashIcon,
  PlusIcon,
  FolderIcon,
  FolderOpenIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Modal from '@/app/ui/shared/confirmation-modal';

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
  return (
    <Link
      href="/dashboard/places/create"
      className="flex h-10 items-center rounded-lg bg-monum-green-default px-4 text-sm font-medium text-white transition-colors hover:bg-monum-green-default focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-monum-green-default"
    >
      <span className="hidden md:block">Afegir Monum</span>{' '}
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
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();
  const [deletePlace, { loading, error }] = useMutation(deletePlaceMutation, {
    onCompleted: () => {
      console.log('Place deleted');
      router.push('/dashboard/places');
    },
    onError: (error) => {
      console.error('Delete place error:', error);
    },
  });

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
          title="Eliminar el Monum"
          message="Estàs a punt d'eliminar aquest monum, aquesta acció no es pot desfer. Estàs segur/a que vols continuar?"
          closeClassName="bg-gray-300 hover:bg-gray-400"
          confirmClassName="bg-red-500 hover:bg-red-600"
          onClose={handleCloseModal}
          onConfirm={handleConfirmation}
        />
      )}
    </>
  );
}
