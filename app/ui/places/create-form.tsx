'use client';
import Link from 'next/link';
import { Button } from '@/app/ui/button';
import { HashtagIcon } from '@heroicons/react/24/outline';
import { useMutation } from '@apollo/client';
import { VariablesOf, graphql } from '@/graphql';
import { useRouter } from 'next/navigation';

const CreatePlaceMutation = graphql(`
  mutation Mutation($place: CreatePlaceInput!) {
    createPlace(place: $place) {
      id
    }
  }
`);

export default function Form() {
  const router = useRouter();
  const [createPlace, { loading, error }] = useMutation(CreatePlaceMutation, {
    onError: (error) => console.error('Create place error:', error),
    onCompleted: (data) => {
      if (data.createPlace?.id) {
        const redirect = '/dashboard/places';
        router.push(redirect);
      } else {
        console.log('Failed creating place!', data);
      }
    },
  });
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      const variables: VariablesOf<typeof CreatePlaceMutation> = {
        place: {
          name: e.target.name.value,
          description: e.target.description.value,
          importance: parseInt(e.target.importance.value),
          address: {
            coordinates: {
              lat: parseFloat(e.target.latitude.value),
              lng: parseFloat(e.target.longitude.value),
            },
            street: e.target.street.value,
            city: e.target.city.value,
            country: e.target.country.value,
            postalCode: e.target.postalCode.value,
            province: e.target.province.value,
          },
        },
      };
      await createPlace({ variables });
    } catch (error) {
      console.error('Create place error:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        <div className="mb-4">
          <label htmlFor="name" className="mb-2 block text-sm font-medium">
            Informació bàsica
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="name"
                name="name"
                type="string"
                placeholder="Nom"
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-3 text-sm outline-2 placeholder:text-gray-500"
                aria-describedby="name-error"
              />
            </div>
          </div>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <textarea
                id="description"
                name="description"
                placeholder="Descripció"
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-3 text-sm outline-2 placeholder:text-gray-500"
                aria-describedby="name-error"
              />
            </div>
          </div>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="importance"
                name="importance"
                type="number"
                min={1}
                max={10}
                step={1}
                placeholder="Importància"
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-8 text-sm outline-2 placeholder:text-gray-500"
                aria-describedby="name-error"
              />
            </div>
            <HashtagIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
          </div>
        </div>
        <div className="mb-4">
          <label htmlFor="name" className="mb-2 block text-sm font-medium">
            Adreça
          </label>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="latitude"
                name="latitude"
                type="number"
                min={-90}
                max={90}
                step={0.000000001}
                placeholder="Latitud"
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-3 text-sm outline-2 placeholder:text-gray-500"
              />
            </div>
          </div>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="longitude"
                name="longitude"
                type="number"
                min={-90}
                max={90}
                step={0.000000001}
                placeholder="Longitud"
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-3 text-sm outline-2 placeholder:text-gray-500"
              />
            </div>
          </div>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="street"
                name="street"
                type="string"
                placeholder="Carrer"
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-3 text-sm outline-2 placeholder:text-gray-500"
              />
            </div>
          </div>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="city"
                name="city"
                type="string"
                placeholder="Ciutat"
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-3 text-sm outline-2 placeholder:text-gray-500"
              />
            </div>
          </div>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="country"
                name="country"
                type="string"
                placeholder="País"
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-3 text-sm outline-2 placeholder:text-gray-500"
              />
            </div>
          </div>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="postalCode"
                name="postalCode"
                type="string"
                placeholder="Codi Postal"
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-3 text-sm outline-2 placeholder:text-gray-500"
              />
            </div>
          </div>
          <div className="relative mt-2 rounded-md">
            <div className="relative">
              <input
                id="province"
                name="province"
                type="string"
                placeholder="Província"
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-3 text-sm outline-2 placeholder:text-gray-500"
              />
            </div>
          </div>
        </div>
      </div>
      <div className="mt-6 flex justify-end gap-4">
        <Link
          href="/dashboard/places"
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          Cancel
        </Link>
        <Button disabled={loading} aria-disabled={loading}>
          Afegir Lloc
        </Button>
      </div>
    </form>
  );
}
