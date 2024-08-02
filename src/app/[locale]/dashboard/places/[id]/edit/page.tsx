'use client';
import Breadcrumbs from '@/app/[locale]/ui/shared/breadcrumbs';
import { notFound } from 'next/navigation';
import requireAuth from '@/auth';
import { VariablesOf, graphql } from '@/graphql';
import { useQuery } from '@apollo/client';
import Form from '@/app/[locale]/ui/places/edit-form';
import { IPlace } from '../../interfaces';
import { useTranslations } from 'next-intl';
import { useGlobalStore } from '@/zustand/GlobalStore';
import { Language } from '@/shared/types/Language';

const getPlaceFullById = graphql(`
  query PlaceFull($placeFullId: ID!) {
    placeFull(id: $placeFullId) {
      id
      name
      nameTranslations {
        key
        value
      }
      address {
        coordinates {
          lat
          lng
        }
        street {
          key
          value
        }
        city {
          key
          value
        }
        postalCode
        province {
          key
          value
        }
        country {
          key
          value
        }
      }
      description {
        key
        value
      }
      importance
      createdAt
      updatedAt
    }
  }
`);

function Page({ params }: { params: { id: string } }) {
  const setIsLoading = useGlobalStore((state) => state.setIsLoading);
  const t = useTranslations('MonumDetail');
  const arrayToObjectLanguage = (array: any[]) =>
    array.reduce(
      (obj, item) => {
        obj[item.key as Language] = item.value;
        return obj;
      },
      {} as { [key in Language]: string },
    );
  const id = params.id;

  const variables: VariablesOf<typeof getPlaceFullById> = {
    placeFullId: id,
  };

  const { loading, error, data } = useQuery(getPlaceFullById, {
    variables,
  });
  const place = data?.placeFull;

  if (error) {
    return notFound();
  }

  setIsLoading(loading);

  const placeObject: IPlace = {
    id: place?.id as string,
    name: place?.name as string,
    nameTranslations:
      place?.nameTranslations &&
      arrayToObjectLanguage(place?.nameTranslations as any[]),
    description:
      place?.description && arrayToObjectLanguage(place?.description as any[]),
    address: {
      coordinates: {
        lat: place?.address.coordinates.lat as number,
        lng: place?.address.coordinates.lng as number,
      },
      street:
        place?.address?.street &&
        arrayToObjectLanguage(place?.address?.street as any[]),
      city:
        place?.address?.city &&
        arrayToObjectLanguage(place?.address?.city as any[]),
      postalCode: place?.address.postalCode as string,
      province:
        place?.address?.province &&
        arrayToObjectLanguage(place?.address?.province as any[]),
      country:
        place?.address?.country &&
        arrayToObjectLanguage(place?.address?.country as any[]),
    },
    importance: place?.importance as number,
    createdAt: new Date(place?.createdAt || 0),
    updatedAt: new Date(place?.updatedAt || 0),
  };
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Monums', href: '/dashboard/places/list' },
          {
            label: t('editMonum'),
            href: `/dashboard/places/${id}/edit`,
            active: true,
          },
        ]}
      />
      <Form place={placeObject} />
    </main>
  );
}

export default requireAuth(Page);
