import Form from '@/app/ui/places/create-form';
import Breadcrumbs from '@/app/ui/places/breadcrumbs';
import { Metadata } from 'next';
import { requireAuth } from '@/atuh';

export const metadata: Metadata = {
  title: 'Nou Lloc',
};

async function Page() {
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Places', href: '/dashboard/places' },
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
