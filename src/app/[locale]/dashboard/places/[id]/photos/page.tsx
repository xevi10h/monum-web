'use client';
import Breadcrumbs from '@/app/[locale]/ui/shared/breadcrumbs';
import requireAuth from '@/auth';
import { VariablesOf, graphql } from '@/graphql';
import { useQuery } from '@apollo/client';
import PhotosTable from '@/app/[locale]/ui/places/photos/table';
import { useGlobalStore } from '@/zustand/GlobalStore';

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
  const setIsLoading = useGlobalStore((state) => state.setIsLoading);
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

  setIsLoading(placeLoading);

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
            href: `/dashboard/places/${place?.id}/photos`,
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
