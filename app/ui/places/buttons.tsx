import { VariablesOf, graphql } from '@/graphql';
import { useMutation } from '@apollo/client';
import {
  PencilIcon,
  TrashIcon,
  PlusIcon,
  FolderIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export function NavigateToMedias({ id }: { id: string }) {
  return (
    <Link
      href={`/dashboard/places/${id}/medias`}
      className="rounded-md border bg-gray-300 p-2 hover:bg-gray-500"
    >
      <FolderIcon className="w-5" />
    </Link>
  );
}

export function CreatePlace() {
  return (
    <Link
      href="/dashboard/places/create"
      className="flex h-10 items-center rounded-lg bg-monum-green-600 px-4 text-sm font-medium text-white transition-colors hover:bg-monum-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-monum-green-600"
    >
      <span className="hidden md:block">Afegir Lloc</span>{' '}
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
  const handleSubmit = async (e: any) => {
    e.preventDefault();
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
  return (
    <form onSubmit={handleSubmit}>
      <button className="rounded-md border bg-red-300 p-2 hover:bg-red-500">
        <span className="sr-only">Delete</span>
        <TrashIcon className="w-5" />
      </button>
    </form>
  );
}
