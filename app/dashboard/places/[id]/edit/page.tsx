'use client';
import Breadcrumbs from '@/app/ui/places/breadcrumbs';
import { notFound } from 'next/navigation';
import requireAuth from '@/atuh';
import { VariablesOf, graphql } from '@/graphql';
import { useQuery } from '@apollo/client';
import Form from '@/app/ui/places/edit-form';

const getPlaceById = graphql(`
  query Query($placeId: ID!) {
    place(id: $placeId) {
      id
      name
      description
      address {
        street
        city
        postalCode
        province
        country
        coordinates {
          lat
          lng
        }
      }
      importance
    }
  }
`);

function Page({ params }: { params: { id: string } }) {
  const id = params.id;

  const variables: VariablesOf<typeof getPlaceById> = {
    placeId: id,
  };

  const { loading, error, data } = useQuery(getPlaceById, {
    variables,
  });
  const place = data?.place;

  if (error) {
    notFound();
  }

  const placeObject: Place = {
    id: place?.id as string,
    name: place?.name as string,
    description: place?.description as string,
    address: {
      coordinates: {
        latitude: place?.address.coordinates.lat as number,
        longitude: place?.address.coordinates.lng as number,
      },
      street: place?.address.street as string,
      city: place?.address.city as string,
      postalCode: place?.address.postalCode as string,
      province: place?.address.province as string,
      country: place?.address.country as string,
    },
    importance: place?.importance as number,
  };
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Llocs', href: '/dashboard/places' },
          {
            label: 'Edita el lloc',
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
