'use client';
import Form from '@/app/[locale]/ui/places/create-form';
import Breadcrumbs from '@/app/[locale]/ui/shared/breadcrumbs';
import requireAuth from '@/auth';
import { useTranslations } from 'next-intl';

async function Page() {
  const t = useTranslations('MonumsList');
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Monums', href: '/dashboard/places/list' },
          {
            label: t('saveNew'),
            href: '/dashboard/places/create',
            active: true,
          },
        ]}
      />
      <Form />
    </main>
  );
}

export default requireAuth(Page);
