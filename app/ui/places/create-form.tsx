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
        console.log('Failed creating place', data);
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
              lat: parseFloat(e.target.lat.value),
              lng: parseFloat(e.target.lng.value),
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
          <label htmlFor="amount" className="text-m mb-2 block font-medium">
            Informació bàsica
          </label>
          <div className="flex gap-4">
            <div className="flex-1" style={{ flexBasis: '80%' }}>
              <label htmlFor="name" className="font-small mb-2 block text-sm">
                Nom
              </label>
              <input
                id="name"
                name="name"
                type="string"
                placeholder="Nom"
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-3 text-sm outline-2 placeholder:text-gray-500"
              />
            </div>
            <div className="flex-1" style={{ flexBasis: '20%' }}>
              <label
                htmlFor="importance"
                className="font-small mb-2 block text-sm"
              >
                Importància
              </label>
              <input
                id="importance"
                name="importance"
                type="number"
                min={1}
                max={3}
                step={1}
                placeholder="Importància"
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-3 text-sm outline-2 placeholder:text-gray-500"
              />
            </div>
          </div>
          <div className="relative mt-2 rounded-md">
            <label
              htmlFor="description"
              className="font-small mb-2 block text-sm"
            >
              Descripció
            </label>
            <textarea
              id="description"
              name="description"
              placeholder="Descripció"
              className="peer block w-full rounded-md border border-gray-200 py-2 pl-3 text-sm outline-2 placeholder:text-gray-500"
              aria-describedby="name-error"
              style={{ minHeight: '4em' }} // Ajuste de altura mínima para visualizar al menos dos líneas
            />
          </div>
        </div>

        <div className="mb-4">
          <label htmlFor="amount" className="text-m mb-2 block font-medium">
            Adreça
          </label>
          <div className="flex gap-4">
            <div className="flex-1" style={{ flexBasis: '75%' }}>
              <label htmlFor="street" className="font-small mb-2 block text-sm">
                Adreça completa
              </label>
              <input
                id="street"
                name="street"
                type="string"
                placeholder="Adreça completa"
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-3 text-sm outline-2 placeholder:text-gray-500"
              />
            </div>
            <div className="flex-1" style={{ flexBasis: '25%' }}>
              <label
                htmlFor="postalCode"
                className="font-small mb-2 block text-sm"
              >
                Codi Postal
              </label>
              <input
                id="postalCode"
                name="postalCode"
                type="string"
                placeholder="Codi Postal"
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-3 text-sm outline-2 placeholder:text-gray-500"
              />
            </div>
          </div>
          <div className="mt-2 flex gap-4">
            <div className="flex-1" style={{ flexBasis: '25%' }}>
              <label htmlFor="city" className="font-small mb-2 block text-sm">
                Ciutat
              </label>
              <input
                id="city"
                name="city"
                type="string"
                placeholder="Ciutat"
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-3 text-sm outline-2 placeholder:text-gray-500"
              />
            </div>
            <div className="flex-1" style={{ flexBasis: '25%' }}>
              <label
                htmlFor="province"
                className="font-small mb-2 block text-sm"
              >
                Província
              </label>
              <input
                id="province"
                name="province"
                type="string"
                placeholder="Província"
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-3 text-sm outline-2 placeholder:text-gray-500"
              />
            </div>
            <div className="flex-1" style={{ flexBasis: '25%' }}>
              <label
                htmlFor="country"
                className="font-small mb-2 block text-sm"
              >
                País
              </label>
              <input
                id="country"
                name="country"
                type="string"
                placeholder="País"
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-3 text-sm outline-2 placeholder:text-gray-500"
              />
            </div>
            <div className="flex-1" style={{ flexBasis: '12.5%' }}>
              <label htmlFor="lat" className="font-small mb-2 block text-sm">
                Latitud
              </label>
              <input
                id="lat"
                name="lat"
                type="number"
                min={-90}
                max={90}
                step={0.000000001}
                placeholder="Latitud"
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-3 text-sm outline-2 placeholder:text-gray-500"
              />
            </div>
            <div className="flex-1" style={{ flexBasis: '12.5%' }}>
              <label htmlFor="lng" className="font-small mb-2 block text-sm">
                Longitud
              </label>
              <input
                id="lng"
                name="lng"
                type="number"
                min={-90}
                max={90}
                step={0.000000001}
                placeholder="Longitud"
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
          Cancel·lar
        </Link>
        <Button disabled={loading} aria-disabled={loading}>
          Afegir Monum
        </Button>
      </div>
    </form>
  );
}
