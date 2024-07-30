'use client';
import Form from '@/app/[locale]/ui/routes/create-form';
import Breadcrumbs from '@/app/[locale]/ui/shared/breadcrumbs';
import requireAuth from '@/auth';
import { useTranslations } from 'next-intl';

async function CreateRoute() {
  const t = useTranslations('RoutesList');
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: t('routes'), href: '/dashboard/routes' },
          {
            label: t('addOneRoute'),
            href: '/dashboard/routes',
            active: true,
          },
        ]}
      />
      <Form />
    </main>
  );
}

export default requireAuth(CreateRoute);
