'use client';
import Form from '@/app/[locale]/ui/places/medias/create-form';
import Breadcrumbs from '@/app/[locale]/ui/shared/breadcrumbs';
import requireAuth from '@/auth';
import { useTranslations } from 'next-intl';

function Page({ params }: { params: { id: string } }) {
  const t = useTranslations('MediaList');
  const id = params.id;
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Monums', href: '/dashboard/places/list' },
          {
            label: t('medias'),
            href: `/dashboard/places/${id}/medias/`,
          },
          {
            label: t('addNewMedia'),
            href: `/dashboard/places/${id}/medias/create`,
            active: true,
          },
        ]}
      />
      <Form placeId={id} />
    </main>
  );
}

export default requireAuth(Page);
