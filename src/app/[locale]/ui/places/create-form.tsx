'use client';
import { Button } from '@/app/[locale]/ui/button';
import { useMutation } from '@apollo/client';
import { VariablesOf, graphql } from '@/graphql';
import { useSearchParams } from 'next/navigation';
import { useRouter } from '@/navigation';
import { useTranslations } from 'next-intl';
import { Link } from '@/navigation';
import { MouseEventHandler, useState } from 'react';
import { useGlobalStore } from '@/zustand/GlobalStore';
import { useUserStore } from '@/zustand/UserStore';
import { Language } from '@/shared/types/Language';
import { IAddress } from '@/shared/interfaces/IAddress';
import { IPlace } from '@/shared/interfaces/IPlace';
import { translatePlaces } from '../../dashboard/places/translations';

const CreatePlaceFullMutation = graphql(`
  mutation CreatePlaceFull($place: CreatePlaceFullInput!) {
    createPlaceFull(place: $place) {
      id
    }
  }
`);

export default function Form() {
  const setIsLoading = useGlobalStore((state) => state.setIsLoading);
  const t = useTranslations('MonumDetail');
  const languages = useTranslations('Languages');
  const router = useRouter();
  const searchParams = useSearchParams();
  const defaultLat = searchParams.get('defaultLat');
  const defaultLng = searchParams.get('defaultLng');
  const user = useUserStore((state) => state.user);
  const [selectedLanguage, setSelectedLanguage] = useState(user.language);
  const [placeCreate, setPlaceCreate] = useState<Partial<IPlace>>({});
  const [addressCreate, setAddressCreate] = useState<Partial<IAddress>>({});

  const [createPlace, { loading, error }] = useMutation(
    CreatePlaceFullMutation,
    {
      onError: (error) => console.error('Create place error:', error),
      onCompleted: (data) => {
        if (data.createPlaceFull?.id) {
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
    },
  );

  setIsLoading(loading);

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedLanguage(e.target.value as Language);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    let [key, language] = name.split('-');

    if (
      key === 'street' ||
      key === 'city' ||
      key === 'province' ||
      key === 'country'
    ) {
      setAddressCreate({
        ...addressCreate,
        [key]: {
          ...(addressCreate[key as keyof IAddress] as any),
          [language]: value,
        },
      });
    } else {
      setPlaceCreate({
        ...placeCreate,
        [key]: {
          ...(placeCreate[key as keyof IPlace] as any),
          [language]: value,
        },
      });
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const objectEntriesToArrays = (obj: { [key: string]: string }) =>
      Object.entries(obj).map(([key, value]) => ({ key, value }));
    try {
      const variables: VariablesOf<typeof CreatePlaceFullMutation> = {
        place: {
          name: placeCreate?.nameTranslations
            ? Object.values(placeCreate?.nameTranslations)[0]
            : '',
          nameTranslations: placeCreate?.nameTranslations
            ? objectEntriesToArrays(placeCreate.nameTranslations)
            : [],
          description: placeCreate?.description
            ? objectEntriesToArrays(placeCreate.description)
            : [],
          importance: parseInt(e.target.importance.value),
          address: {
            coordinates: {
              lat: parseFloat(e.target.lat.value),
              lng: parseFloat(e.target.lng.value),
            },
            street: addressCreate?.street
              ? objectEntriesToArrays(addressCreate.street)
              : [],
            city: addressCreate?.city
              ? objectEntriesToArrays(addressCreate.city)
              : [],
            country: addressCreate?.country
              ? objectEntriesToArrays(addressCreate.country)
              : [],
            postalCode: e.target.postalCode.value,
            province: addressCreate?.province
              ? objectEntriesToArrays(addressCreate.province)
              : [],
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
          <div className="mb-4 flex flex-row justify-between">
            <label
              htmlFor="basicInfo"
              className="text-m mb-2 block font-medium"
            >
              {translatePlaces('basicInfo', selectedLanguage)}
            </label>
            <div className="flex flex-row items-center gap-4">
              <label
                htmlFor="title"
                className="font-small block text-sm font-medium"
              >
                {translatePlaces('language', selectedLanguage)}:
              </label>
              <select
                id="language"
                name="language"
                className="rounded-md border border-gray-200 py-2 pl-3 text-sm text-gray-700"
                defaultValue={user.language}
                value={selectedLanguage}
                onChange={handleLanguageChange}
              >
                <option value="ca_ES">{languages('ca_ES')}</option>
                <option value="es_ES">{languages('es_ES')}</option>
                <option value="en_US">{languages('en_US')}</option>
                <option value="fr_FR">{languages('fr_FR')}</option>
              </select>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex-1" style={{ flexBasis: '80%' }}>
              <label htmlFor="name" className="font-small mb-2 block text-sm">
                {t('name')}
              </label>
              <input
                required={true}
                id={`nameTranslations-${selectedLanguage}`}
                name={`nameTranslations-${selectedLanguage}`}
                type="string"
                value={placeCreate?.nameTranslations?.[selectedLanguage] || ''}
                onChange={handleInputChange}
                placeholder={translatePlaces('name', selectedLanguage)}
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-3 text-sm outline-2 placeholder:text-gray-500"
              />
            </div>
            <div className="flex-1" style={{ flexBasis: '20%' }}>
              <label
                htmlFor="importance"
                className="font-small mb-2 block text-sm"
              >
                {translatePlaces('importance', selectedLanguage)}
              </label>
              <input
                required={true}
                id="importance"
                name="importance"
                type="number"
                min={1}
                max={3}
                step={1}
                placeholder={translatePlaces('importance', selectedLanguage)}
                defaultValue={placeCreate?.importance}
                onChange={handleInputChange}
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-3 text-sm outline-2 placeholder:text-gray-500"
              />
            </div>
          </div>
          <div className="relative mt-2 rounded-md">
            <label
              htmlFor="description"
              className="font-small mb-2 block text-sm"
            >
              {translatePlaces('description', selectedLanguage)}
            </label>
            <textarea
              id={`description-${selectedLanguage}`}
              name={`description-${selectedLanguage}`}
              placeholder={translatePlaces('description', selectedLanguage)}
              value={placeCreate?.description?.[selectedLanguage] || ''}
              onChange={handleInputChange}
              className="peer block w-full rounded-md border border-gray-200 py-2 pl-3 text-sm outline-2 placeholder:text-gray-500"
              aria-describedby="name-error"
              style={{ minHeight: '4em' }}
            />
          </div>
        </div>

        <div className="mb-4">
          <label htmlFor="amount" className="text-m mb-2 block font-medium">
            {translatePlaces('address', selectedLanguage)}
          </label>
          <div className="flex gap-4">
            <div className="flex-1" style={{ flexBasis: '75%' }}>
              <label htmlFor="street" className="font-small mb-2 block text-sm">
                {translatePlaces('completeAddress', selectedLanguage)}
              </label>
              <input
                id={`street-${selectedLanguage}`}
                name={`street-${selectedLanguage}`}
                type="string"
                placeholder={translatePlaces(
                  'completeAddress',
                  selectedLanguage,
                )}
                value={addressCreate?.street?.[selectedLanguage] || ''}
                onChange={handleInputChange}
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-3 text-sm outline-2 placeholder:text-gray-500"
              />
            </div>
            <div className="flex-1" style={{ flexBasis: '25%' }}>
              <label
                htmlFor="postalCode"
                className="font-small mb-2 block text-sm"
              >
                {translatePlaces('postalCode', selectedLanguage)}
              </label>
              <input
                id="postalCode"
                name="postalCode"
                type="string"
                placeholder={translatePlaces('postalCode', selectedLanguage)}
                onChange={handleInputChange}
                defaultValue={addressCreate.postalCode}
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-3 text-sm outline-2 placeholder:text-gray-500"
              />
            </div>
          </div>
          <div className="mt-2 flex gap-4">
            <div className="flex-1" style={{ flexBasis: '25%' }}>
              <label htmlFor="city" className="font-small mb-2 block text-sm">
                {translatePlaces('city', selectedLanguage)}
              </label>
              <input
                id={`city-${selectedLanguage}`}
                name={`city-${selectedLanguage}`}
                type="string"
                placeholder={translatePlaces('city', selectedLanguage)}
                value={addressCreate?.city?.[selectedLanguage] || ''}
                onChange={handleInputChange}
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-3 text-sm outline-2 placeholder:text-gray-500"
              />
            </div>
            <div className="flex-1" style={{ flexBasis: '25%' }}>
              <label
                htmlFor="province"
                className="font-small mb-2 block text-sm"
              >
                {translatePlaces('province', selectedLanguage)}
              </label>
              <input
                id={`province-${selectedLanguage}`}
                name={`province-${selectedLanguage}`}
                type="string"
                placeholder={translatePlaces('province', selectedLanguage)}
                value={addressCreate?.province?.[selectedLanguage] || ''}
                onChange={handleInputChange}
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-3 text-sm outline-2 placeholder:text-gray-500"
              />
            </div>
            <div className="flex-1" style={{ flexBasis: '25%' }}>
              <label
                htmlFor="country"
                className="font-small mb-2 block text-sm"
              >
                {translatePlaces('country', selectedLanguage)}
              </label>
              <input
                id={`country-${selectedLanguage}`}
                name={`country-${selectedLanguage}`}
                type="string"
                placeholder={translatePlaces('country', selectedLanguage)}
                value={addressCreate?.country?.[selectedLanguage] || ''}
                onChange={handleInputChange}
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-3 text-sm outline-2 placeholder:text-gray-500"
              />
            </div>
            <div className="flex-1" style={{ flexBasis: '12.5%' }}>
              <label htmlFor="lat" className="font-small mb-2 block text-sm">
                {translatePlaces('latitude', selectedLanguage)}
              </label>
              <input
                required={true}
                id="lat"
                name="lat"
                type="number"
                min={-90}
                max={90}
                step={0.000000000000000000001}
                placeholder={translatePlaces('latitude', selectedLanguage)}
                onChange={handleInputChange}
                defaultValue={
                  defaultLat
                    ? Number(defaultLat)
                    : addressCreate?.coordinates?.lat
                }
                className={`${defaultLat ? 'bg-gray-100' : ''} peer block w-full rounded-md border border-gray-200  py-2 pl-3 text-sm outline-2 placeholder:text-gray-500`}
              />
            </div>
            <div className="flex-1" style={{ flexBasis: '12.5%' }}>
              <label htmlFor="lng" className="font-small mb-2 block text-sm">
                {translatePlaces('longitude', selectedLanguage)}
              </label>
              <input
                required={true}
                id="lng"
                name="lng"
                type="number"
                min={-90}
                max={90}
                step={0.000000000000000000001}
                placeholder={translatePlaces('longitude', selectedLanguage)}
                onChange={handleInputChange}
                defaultValue={
                  defaultLng
                    ? Number(defaultLng)
                    : addressCreate?.coordinates?.lng
                }
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
