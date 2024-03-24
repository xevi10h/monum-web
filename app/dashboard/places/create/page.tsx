'use client';
import Form from '@/app/ui/places/create-form';
import Breadcrumbs from '@/app/ui/places/breadcrumbs';
import requireAuth from '@/atuh';

async function Page() {
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Llocs', href: '/dashboard/places' },
          {
            label: 'Afegir Lloc',
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
