'use client';
import { Button } from '@/app/[locale]/ui/button';
import { useMutation } from '@apollo/client';
import { VariablesOf, graphql } from '@/graphql';
import { useSearchParams } from 'next/navigation';
import { useRouter } from '@/navigation';
import { useTranslations } from 'next-intl';
import { Link } from '@/navigation';
import { MouseEventHandler } from 'react';

const CreatePlaceMutation = graphql(`
  mutation Mutation($place: CreatePlaceInput!) {
    createPlace(place: $place) {
      id
    }
  }
`);

export default function Form() {
  const t = useTranslations('MonumDetail');
  const router = useRouter();
  const searchParams = useSearchParams();
  const defaultLat = searchParams.get('defaultLat');
  const defaultLng = searchParams.get('defaultLng');
  const [createPlace, { loading, error }] = useMutation(CreatePlaceMutation, {
    onError: (error) => console.error('Create place error:', error),
    onCompleted: (data) => {
      if (data.createPlace?.id) {
        const redirect = '/dashboard/places/list';
        router.push(redirect);
      } else {
        console.log('Failed creating place', data);
      }
    },
    update: (cache) => {
      cache.evict({ fieldName: 'getPlaceBySearchAndPagination' });
      cache.gc();
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
            {t('basicInfo')}
          </label>
          <div className="flex gap-4">
            <div className="flex-1" style={{ flexBasis: '80%' }}>
              <label htmlFor="name" className="font-small mb-2 block text-sm">
                {t('name')}
              </label>
              <input
                id="name"
                name="name"
                type="string"
                placeholder={t('name')}
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-3 text-sm outline-2 placeholder:text-gray-500"
              />
            </div>
            <div className="flex-1" style={{ flexBasis: '20%' }}>
              <label
                htmlFor="importance"
                className="font-small mb-2 block text-sm"
              >
                {t('importance')}
              </label>
              <input
                id="importance"
                name="importance"
                type="number"
                min={1}
                max={3}
                step={1}
                placeholder={t('importance')}
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-3 text-sm outline-2 placeholder:text-gray-500"
              />
            </div>
          </div>
          <div className="relative mt-2 rounded-md">
            <label
              htmlFor="description"
              className="font-small mb-2 block text-sm"
            >
              {t('description')}
            </label>
            <textarea
              id="description"
              name="description"
              placeholder={t('description')}
              className="peer block w-full rounded-md border border-gray-200 py-2 pl-3 text-sm outline-2 placeholder:text-gray-500"
              aria-describedby="name-error"
              style={{ minHeight: '4em' }}
            />
          </div>
        </div>

        <div className="mb-4">
          <label htmlFor="amount" className="text-m mb-2 block font-medium">
            {t('address')}
          </label>
          <div className="flex gap-4">
            <div className="flex-1" style={{ flexBasis: '75%' }}>
              <label htmlFor="street" className="font-small mb-2 block text-sm">
                {t('completeAddress')}
              </label>
              <input
                id="street"
                name="street"
                type="string"
                placeholder={t('completeAddress')}
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-3 text-sm outline-2 placeholder:text-gray-500"
              />
            </div>
            <div className="flex-1" style={{ flexBasis: '25%' }}>
              <label
                htmlFor="postalCode"
                className="font-small mb-2 block text-sm"
              >
                {t('postalCode')}
              </label>
              <input
                id="postalCode"
                name="postalCode"
                type="string"
                placeholder={t('postalCode')}
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-3 text-sm outline-2 placeholder:text-gray-500"
              />
            </div>
          </div>
          <div className="mt-2 flex gap-4">
            <div className="flex-1" style={{ flexBasis: '25%' }}>
              <label htmlFor="city" className="font-small mb-2 block text-sm">
                {t('city')}
              </label>
              <input
                id="city"
                name="city"
                type="string"
                placeholder={t('city')}
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-3 text-sm outline-2 placeholder:text-gray-500"
              />
            </div>
            <div className="flex-1" style={{ flexBasis: '25%' }}>
              <label
                htmlFor="province"
                className="font-small mb-2 block text-sm"
              >
                {t('province')}
              </label>
              <input
                id="province"
                name="province"
                type="string"
                placeholder={t('province')}
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-3 text-sm outline-2 placeholder:text-gray-500"
              />
            </div>
            <div className="flex-1" style={{ flexBasis: '25%' }}>
              <label
                htmlFor="country"
                className="font-small mb-2 block text-sm"
              >
                {t('country')}
              </label>
              <input
                id="country"
                name="country"
                type="string"
                placeholder={t('country')}
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-3 text-sm outline-2 placeholder:text-gray-500"
              />
            </div>
            <div className="flex-1" style={{ flexBasis: '12.5%' }}>
              <label htmlFor="lat" className="font-small mb-2 block text-sm">
                {t('latitude')}
              </label>
              <input
                id="lat"
                name="lat"
                type="number"
                min={-90}
                max={90}
                step={0.000000001}
                defaultValue={defaultLat ? Number(defaultLat) : undefined}
                disabled={Boolean(defaultLat)}
                placeholder={t('latitude')}
                className={`${defaultLat ? 'bg-gray-100' : ''} peer block w-full rounded-md border border-gray-200  py-2 pl-3 text-sm outline-2 placeholder:text-gray-500`}
              />
            </div>
            <div className="flex-1" style={{ flexBasis: '12.5%' }}>
              <label htmlFor="lng" className="font-small mb-2 block text-sm">
                {t('longitude')}
              </label>
              <input
                id="lng"
                name="lng"
                type="number"
                min={-90}
                max={90}
                defaultValue={defaultLng ? Number(defaultLng) : undefined}
                disabled={Boolean(defaultLng)}
                step={0.000000001}
                placeholder={t('longitude')}
                className={`${defaultLng ? 'bg-gray-100' : ''} peer block w-full rounded-md border border-gray-200  py-2 pl-3 text-sm outline-2 placeholder:text-gray-500`}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="mt-6 flex justify-center gap-4">
        <Link
          href="#"
          onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
            e.preventDefault();
            router.back();
          }}
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          {t('cancel')}
        </Link>
        <Button disabled={loading} aria-disabled={loading}>
          {t('saveNew')}
        </Button>
      </div>
    </form>
  );
}
