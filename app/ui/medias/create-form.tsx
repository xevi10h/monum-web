'use client';
import Link from 'next/link';
import { Button } from '@/app/ui/button';
import { HashtagIcon } from '@heroicons/react/24/outline';
import { useMutation } from '@apollo/client';
import { VariablesOf, graphql } from '@/graphql';
import { useRouter } from 'next/navigation';

const CreateMediaMutation = graphql(`
  mutation Mutation(
    $placeId: ID!
    $title: String!
    $text: String!
    $type: MediaType!
    $rating: Float!
  ) {
    createMedia(
      placeId: $placeId
      title: $title
      text: $text
      type: $type
      rating: $rating
    ) {
      id
    }
  }
`);

export default function Form({ placeId }: { placeId: string }) {
  const router = useRouter();
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
      const variables: VariablesOf<typeof CreateMediaMutation> = {
        placeId,
        title: e.target.title.value,
        text: e.target.text.value,
        type: e.target.type.value,
        rating: parseFloat(e.target.rating.value),
      };
      await createMedia({ variables });
    } catch (error) {
      console.error('Create media error:', error);
    }
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
              defaultValue={'text'}
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
        <div className="relative mt-2 rounded-md">
          <label htmlFor="text" className="mb-2 block pl-2 text-sm font-medium">
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
