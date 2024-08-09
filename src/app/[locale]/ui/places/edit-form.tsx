'use client';

import { Link } from '@/navigation';
import { Button } from '@/app/[locale]/ui/button';
import { VariablesOf, graphql } from '@/graphql';
import { useMutation } from '@apollo/client';
import { useRouter } from '@/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { useGlobalStore } from '@/zustand/GlobalStore';
import { useEffect, useState } from 'react';
import { Language } from '@/shared/types/Language';
import { IPlace } from '@/shared/interfaces/IPlace';
import { translatePlaces } from '../../dashboard/places/translations';
import { IAddress } from '@/shared/interfaces/IAddress';
import { Locale, LocaleToLanguage } from '@/shared/types/Locale';

const UpdatePlaceMutation = graphql(`
  mutation UpdatePlaceFull(
    $updatePlaceFullId: ID!
    $placeUpdate: UpdatePlaceFullInput!
  ) {
    updatePlaceFull(id: $updatePlaceFullId, placeUpdate: $placeUpdate) {
      id
    }
  }
`);

export default function EditPlaceForm({ place }: { place: IPlace }) {
  const setIsLoading = useGlobalStore((state) => state.setIsLoading);
  const languages = useTranslations('Languages');
  const router = useRouter();
  const locale = useLocale() as Locale;
  const [selectedLanguage, setSelectedLanguage] = useState(
    LocaleToLanguage[locale],
  );
  const [placeUpdate, setPlaceUpdate] = useState<IPlace>(place);
  const [addressUpdate, setAddressUpdate] = useState<IAddress>(place.address);
  useEffect(() => {
    setPlaceUpdate(place);
    setAddressUpdate(place.address);
  }, [place]);
  const [updatePlace, { loading, error }] = useMutation(UpdatePlaceMutation, {
    onError: (error) => console.error('Update place error', error),
    onCompleted: (data) => {
      if (data.updatePlaceFull?.id) {
        const redirect = '/dashboard/places/list';
        router.push(redirect);
      } else {
        console.log('Failed updating place', data);
      }
    },
    update: (cache) => {
      cache.evict({
        id: cache.identify({ __typename: 'PlaceFull', id: place.id }),
      });
      cache.evict({ fieldName: 'getPlaceBySearchAndPagination' });
      cache.gc();
    },
  });

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
      setAddressUpdate({
        ...addressUpdate,
        [key]: {
          ...(addressUpdate[key as keyof IAddress] as any),
          [language]: value,
        },
      });
    } else {
      setPlaceUpdate({
        ...placeUpdate,
        [key]: {
          ...(placeUpdate[key as keyof IPlace] as any),
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
      const variables: VariablesOf<typeof UpdatePlaceMutation> = {
        updatePlaceFullId: place.id,
        placeUpdate: {
          nameTranslations: objectEntriesToArrays(placeUpdate.nameTranslations),
          address: {
            coordinates: {
              lat: parseFloat(e.target.lat.value),
              lng: parseFloat(e.target.lng.value),
            },
            street: addressUpdate.street
              ? objectEntriesToArrays(addressUpdate.street)
              : [],
            city: objectEntriesToArrays(addressUpdate.city),
            postalCode: e.target.postalCode.value,
            province: addressUpdate.province
              ? objectEntriesToArrays(addressUpdate.province)
              : [],
            country: objectEntriesToArrays(addressUpdate.country),
          },
          description: objectEntriesToArrays(placeUpdate.description),
          importance: Number(e.target.importance.value),
        },
      };
      await updatePlace({ variables });
    } catch (error) {
      console.error('Update place error', error);
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
                {translatePlaces('name', selectedLanguage)}
              </label>
              <input
                id={`nameTranslations-${selectedLanguage}`}
                name={`nameTranslations-${selectedLanguage}`}
                type="string"
                value={placeUpdate?.nameTranslations?.[selectedLanguage] || ''}
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
                id="importance"
                name="importance"
                type="number"
                min={1}
                max={3}
                step={1}
                placeholder={translatePlaces('importance', selectedLanguage)}
                defaultValue={placeUpdate?.importance}
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
              value={placeUpdate?.description?.[selectedLanguage] || ''}
              onChange={handleInputChange}
              className="peer block w-full rounded-md border border-gray-200 py-2 pl-3 text-sm outline-2 placeholder:text-gray-500"
              aria-describedby="name-error"
              style={{ minHeight: '4em' }} // Ajuste de altura mínima para visualizar al menos dos líneas
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
                value={addressUpdate?.street?.[selectedLanguage] || ''}
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
                defaultValue={addressUpdate.postalCode}
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
                value={addressUpdate?.city?.[selectedLanguage] || ''}
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
                value={addressUpdate?.province?.[selectedLanguage] || ''}
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
                value={addressUpdate?.country?.[selectedLanguage] || ''}
                onChange={handleInputChange}
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-3 text-sm outline-2 placeholder:text-gray-500"
              />
            </div>
            <div className="flex-1" style={{ flexBasis: '12.5%' }}>
              <label htmlFor="lat" className="font-small mb-2 block text-sm">
                {translatePlaces('latitude', selectedLanguage)}
              </label>
              <input
                id="lat"
                name="lat"
                type="number"
                min={-90}
                max={90}
                step={0.000000000000000000001}
                placeholder={translatePlaces('latitude', selectedLanguage)}
                onChange={handleInputChange}
                defaultValue={addressUpdate?.coordinates?.lat}
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-3 text-sm outline-2 placeholder:text-gray-500"
              />
            </div>
            <div className="flex-1" style={{ flexBasis: '12.5%' }}>
              <label htmlFor="lng" className="font-small mb-2 block text-sm">
                {translatePlaces('longitude', selectedLanguage)}
              </label>
              <input
                id="lng"
                name="lng"
                type="number"
                min={-90}
                max={90}
                step={0.000000000000000000001}
                placeholder={translatePlaces('longitude', selectedLanguage)}
                onChange={handleInputChange}
                defaultValue={addressUpdate?.coordinates?.lng}
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-3 text-sm outline-2 placeholder:text-gray-500"
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
          {translatePlaces('cancel', selectedLanguage)}
        </Link>
        <Button disabled={loading} aria-disabled={loading}>
          {translatePlaces('save', selectedLanguage)}
        </Button>
      </div>
    </form>
  );
}
