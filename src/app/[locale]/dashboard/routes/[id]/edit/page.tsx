'use client';
import Breadcrumbs from '@/app/[locale]/ui/shared/breadcrumbs';
import requireAuth from '@/auth';
import { VariablesOf, graphql } from '@/graphql';
import { useQuery } from '@apollo/client';
import { useTranslations } from 'next-intl';
import notFound from './not-found';
import { IRoute } from '@/shared/interfaces/IRoute';
import { Language } from '@/shared/types/Language';
import Spinner from '@/app/[locale]/ui/spinner';
import EditRouteForm from '@/app/[locale]/ui/routes/edit-form';

const getRouteFullById = graphql(`
  query RouteFull($routeFullId: ID!) {
    routeFull(id: $routeFullId) {
      id
      title {
        key
        value
      }
      description {
        key
        value
      }
      duration
      optimizedDuration
      distance
      optimizedDistance
      stops {
        place {
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
          importance
          imagesUrl
          photos {
            url
            sizes {
              small
              medium
              large
              original
            }
            order
            createdAt
            updatedAt
            id
            name
          }
          createdAt
          updatedAt
          description {
            key
            value
          }
        }
        medias {
          id
          text {
            key
            value
          }
          rating
          url {
            key
            value
          }
          voiceId {
            key
            value
          }
          duration {
            key
            value
          }
          type
          createdAt
          updatedAt
          title {
            key
            value
          }
        }
        order
        optimizedOrder
      }
      stopsCount
      cityId
      createdAt
      updatedAt
    }
  }
`);

function EditRoute({ params }: { params: { id: string } }) {
  const arrayToObjectLanguage = (array: any[]) =>
    array.reduce(
      (obj, item) => {
        obj[item.key as Language] = item.value;
        return obj;
      },
      {} as { [key in Language]: string },
    );

  const t = useTranslations('RoutesList');

  const id = params.id;

  const variables: VariablesOf<typeof getRouteFullById> = {
    routeFullId: id,
  };

  const { loading, error, data } = useQuery(getRouteFullById, {
    variables,
  });

  const routeRaw = data?.routeFull;

  const rawCreatedAt = routeRaw?.createdAt;
  const rawUpdatedAt = routeRaw?.updatedAt;
  const createdAt =
    typeof rawCreatedAt === 'string' || typeof rawCreatedAt === 'number'
      ? new Date(rawCreatedAt)
      : new Date();
  const updatedAt =
    typeof rawUpdatedAt === 'string' || typeof rawUpdatedAt === 'number'
      ? new Date(rawUpdatedAt)
      : new Date();
  const route: IRoute = {
    id: routeRaw?.id as string,
    title: routeRaw?.title && arrayToObjectLanguage(routeRaw?.title as any[]),
    description:
      routeRaw?.description &&
      arrayToObjectLanguage(routeRaw?.description as any[]),
    stops: routeRaw?.stops?.map((stop: any) => ({
      place: {
        id: stop.place.id,
        name: stop.place.name,
        nameTranslations: arrayToObjectLanguage(
          stop.place.nameTranslations as any[],
        ),
        address: {
          coordinates: {
            lat: stop.place.address.coordinates.lat,
            lng: stop.place.address.coordinates.lng,
          },
          street: arrayToObjectLanguage(stop.place.address.street as any[]),
          city: arrayToObjectLanguage(stop.place.address.city as any[]),
          postalCode: stop.place.address.postalCode,
          province: arrayToObjectLanguage(stop.place.address.province as any[]),
          country: arrayToObjectLanguage(stop.place.address.country as any[]),
        },
        importance: stop.place.importance,
        imagesUrl: stop.place.imagesUrl,
        photos: stop.place.photos.map((photo: any) => ({
          url: photo.url,
          sizes: photo.sizes,
          order: photo.order,
          createdAt: new Date(photo.createdAt),
          updatedAt: new Date(photo.updatedAt),
          id: photo.id,
          name: photo.name,
        })),
        createdAt: new Date(stop.place.createdAt),
        updatedAt: new Date(stop.place.updatedAt),
        description: arrayToObjectLanguage(stop.place.description as any[]),
      },
      medias: stop.medias.map((media: any) => ({
        id: media.id,
        text: arrayToObjectLanguage(media.text as any[]),
        rating: media.rating,
        url: arrayToObjectLanguage(media.url as any[]),
        voiceId: arrayToObjectLanguage(media.voiceId as any[]),
        duration: arrayToObjectLanguage(media.duration as any[]),
        type: media.type,
        createdAt: new Date(media.createdAt),
        updatedAt: new Date(media.updatedAt),
        title: arrayToObjectLanguage(media.title as any[]),
      })),
      order: stop.order,
      optimizedOrder: stop.optimizedOrder,
    })),
    createdAt: new Date(createdAt),
    updatedAt: new Date(updatedAt),
  };

  if (error || !route) {
    return notFound();
  }
  if (loading) {
    return <Spinner />;
  }

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: t('routes'), href: '/dashboard/routes' },
          {
            label: t('editRoute'),
            href: '/dashboard/routes',
            active: true,
          },
        ]}
      />
      <EditRouteForm route={route} />
    </main>
  );
}

export default requireAuth(EditRoute);
