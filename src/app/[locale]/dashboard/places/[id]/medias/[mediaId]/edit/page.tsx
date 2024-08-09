'use client';
import Form from '@/app/[locale]/ui/places/medias/edit-form';
import Breadcrumbs from '@/app/[locale]/ui/shared/breadcrumbs';
import requireAuth from '@/auth';
import { VariablesOf, graphql } from '@/graphql';
import { IMedia } from '@/shared/interfaces/IMedia';
import { Language } from '@/shared/types/Language';
import { MediaType } from '@/shared/types/MediaType';
import { useGlobalStore } from '@/zustand/GlobalStore';
import { useQuery } from '@apollo/client';
import { useTranslations } from 'next-intl';

const getMediaFullById = graphql(`
  query MediaFull($mediaFullId: ID!) {
    mediaFull(id: $mediaFullId) {
      placeId
      createdAt
      duration {
        key
        value
      }
      id
      text {
        key
        value
      }
      title {
        key
        value
      }
      url {
        key
        value
      }
      voiceId {
        key
        value
      }
      type
      updatedAt
    }
  }
`);

function Page({ params }: { params: { id: string; mediaId: string } }) {
  const setIsLoading = useGlobalStore((state) => state.setIsLoading);
  const t = useTranslations('MediaList');
  const arrayToObjectLanguage = (array: any[]) =>
    array.reduce(
      (obj, item) => {
        obj[item.key as Language] = item.value;
        return obj;
      },
      {} as { [key in Language]: string },
    );
  const { id: placeId, mediaId } = params;

  const variables: VariablesOf<typeof getMediaFullById> = {
    mediaFullId: mediaId,
  };
  const { loading, error, data } = useQuery(getMediaFullById, {
    variables,
  });
  const media = data?.mediaFull;

  if (!media) {
    return null;
  }

  setIsLoading(loading);

  const mediaObject: IMedia = {
    id: media?.id as string,
    placeId: media?.placeId as string,
    title: media?.title && arrayToObjectLanguage(media?.title as any[]),
    text: media.text ? arrayToObjectLanguage(media?.text as any[]) : [],
    url: media.url ? arrayToObjectLanguage(media?.url as any[]) : [],
    voiceId: media.voiceId
      ? arrayToObjectLanguage(media?.voiceId as any[])
      : [],
    duration: media.duration
      ? arrayToObjectLanguage(media?.duration as any[])
      : [],
    type: media?.type as MediaType,
    createdAt: new Date(media?.createdAt || 0),
    updatedAt: new Date(media?.updatedAt || 0),
  };
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Monums', href: '/dashboard/places/list' },
          {
            label: t('medias'),
            href: `/dashboard/places/${placeId}/medias/`,
          },
          {
            label: t('editMedia'),
            href: `/dashboard/places/${placeId}/medias/edit/${mediaId}`,
            active: true,
          },
        ]}
      />
      <Form placeId={placeId} media={mediaObject} />
    </main>
  );
}

export default requireAuth(Page);
