'use client';
import Form from '@/app/ui/places/create-form';
import Breadcrumbs from '@/app/ui/shared/breadcrumbs';
import requireAuth from '@/atuh';
import { Suspense } from 'react';

async function Page() {
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Monums', href: '/dashboard/places/list' },
          {
            label: 'Afegir Monum',
            href: '/dashboard/places/create',
            active: true,
          },
        ]}
      />
      <Suspense fallback={null}>
        {' '}
        <Form />
      </Suspense>
    </main>
  );
}

export default requireAuth(Page);
