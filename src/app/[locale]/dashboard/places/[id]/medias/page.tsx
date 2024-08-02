'use client';
import Breadcrumbs from '@/app/[locale]/ui/shared/breadcrumbs';
import { notFound } from 'next/navigation';
import requireAuth from '@/auth';
import { VariablesOf, graphql } from '@/graphql';
import { useQuery } from '@apollo/client';
import MediasTable from '@/app/[locale]/ui/places/medias/table';
import { CreateMedia } from '@/app/[locale]/ui/places/medias/buttons';
import { useEffect } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { useGlobalStore } from '@/zustand/GlobalStore';
import { Locale, LocaleToLanguage } from '@/shared/types/Locale';

const getPlaceById = graphql(`
  query Query($placeId: ID!) {
    place(id: $placeId) {
      id
      name
    }
  }
`);

const getMediasOfPlace = graphql(`
  query Query($placeId: ID, $language: Language) {
    medias(placeId: $placeId, language: $language) {
      id
      title
      type
      url
      text
      createdAt
      updatedAt
    }
  }
`);

function Page({ params }: { params: { id: string } }) {
  const locale = useLocale() as Locale;
  const t = useTranslations('MediaList');
  const setIsLoading = useGlobalStore((state) => state.setIsLoading);
  const id = params.id;

  const variablesPlaces: VariablesOf<typeof getPlaceById> = {
    placeId: id,
  };

  const variablesMediaQuery: VariablesOf<typeof getMediasOfPlace> = {
    placeId: id,
    language: LocaleToLanguage[locale],
  };

  const {
    loading: placeLoading,
    error: placeError,
    data: placeData,
  } = useQuery(getPlaceById, {
    variables: variablesPlaces,
  });

  const {
    loading: mediasLoading,
    error: mediasError,
    data: mediasData,
    refetch: mediasRefetch,
  } = useQuery(getMediasOfPlace, {
    variables: variablesMediaQuery,
  });

  useEffect(() => {
    mediasRefetch();
  });

  const place = placeData?.place;
  const medias = mediasData?.medias;

  setIsLoading(placeLoading || mediasLoading);

  if (placeError || mediasError) {
    notFound();
  }
  const mediasArray: Media[] = [];
  if (!medias) {
    console.log('No medias');
  } else {
    for (const media of medias) {
      const rawCreatedAt = media?.createdAt;
      const rawUpdatedAt = media?.updatedAt;
      const createdAt =
        typeof rawCreatedAt === 'string' || typeof rawCreatedAt === 'number'
          ? new Date(rawCreatedAt)
          : new Date();
      const updatedAt =
        typeof rawUpdatedAt === 'string' || typeof rawUpdatedAt === 'number'
          ? new Date(rawUpdatedAt)
          : new Date();
      mediasArray.push({
        id: media?.id ? media.id.toString() : '',
        title: media?.title ? media.title.toString() : '',
        type: media?.type ? media.type.toString() : '',
        url: media?.url ? media.url.toString() : '',
        text: media?.text ? media.text.toString() : '',
        createdAt: createdAt,
        updatedAt: updatedAt,
      });
    }
  }

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Monums', href: '/dashboard/places/list' },
          {
            label: t('medias'),
            href: `/dashboard/places/${id}/medias`,
            active: true,
          },
        ]}
      />
      <h1 className="font text-3xl font-medium text-monum-green-default">
        {place?.name}
      </h1>
      <CreateMedia placeId={id} />
      <MediasTable medias={mediasArray} placeId={id} />
    </main>
  );
}

export default requireAuth(Page);
