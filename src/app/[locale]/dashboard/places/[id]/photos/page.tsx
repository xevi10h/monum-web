'use client';
import Breadcrumbs from '@/app/[locale]/ui/shared/breadcrumbs';
import { notFound } from 'next/navigation';
import requireAuth from '@/auth';
import { VariablesOf, graphql } from '@/graphql';
import { useQuery } from '@apollo/client';
import PhotosTable from '@/app/[locale]/ui/places/photos/table';
import { useTranslations } from 'next-intl';

const getPlaceById = graphql(`
  query Query($placeId: ID!) {
    place(id: $placeId) {
      id
      name
      photos {
        url
        sizes {
          small
          medium
          large
          original
        }
        createdBy {
          username
        }
        order
        createdAt
        updatedAt
        id
        name
      }
    }
  }
`);

function Page({ params }: { params: { id: string } }) {
  const generic = useTranslations('Generic');
  const id = params.id;

  const variablesPlaces: VariablesOf<typeof getPlaceById> = {
    placeId: id,
  };

  const {
    loading: placeLoading,
    error: placeError,
    data: placeData,
  } = useQuery(getPlaceById, {
    variables: variablesPlaces,
  });

  const place = placeData?.place;

  if (placeLoading) {
    return <p>{generic('loading')}</p>;
  }
  if (
    placeError ||
    !place ||
    !place.name ||
    !place?.photos ||
    place?.photos === null
  ) {
    notFound();
  }
  const placePhotos = Array.isArray(place?.photos)
    ? place.photos.map((photo) => ({
        id: photo.id,
        url: photo.url,
        sizes: photo.sizes,
        createdAt: new Date(photo.createdAt || 0),
        updatedAt: new Date(photo.updatedAt || 0),
        order: photo.order,
        name: photo?.name || undefined,
        createdBy: {
          username: photo.createdBy?.username || null,
        },
      }))
    : [];

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Monums', href: '/dashboard/places/list' },
          {
            label: `Fotos`,
            href: `/dashboard/places/${place.id}/photos`,
            active: true,
          },
        ]}
      />
      <h1 className="font text-3xl font-medium text-monum-green-default">
        {place?.name}
      </h1>

      <PhotosTable photos={placePhotos} placeId={id} />
    </main>
  );
}

export default requireAuth(Page);
