import { PlusIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

export function CreateMedia({ placeId }: { placeId: string }) {
  return (
    <div className="mr-10 flex justify-end">
      <div className="max-w-fit">
        <Link
          href={`/dashboard/places/${placeId}/medias/create`}
          className="flex h-10 items-center rounded-lg bg-monum-green-600 px-4 text-sm font-medium text-white transition-colors hover:bg-monum-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-monum-green-600"
        >
          <span className="hidden md:block">Afegir Recurs</span>{' '}
          <PlusIcon className="h-5 md:ml-4" />
        </Link>
      </div>
    </div>
  );
}
