import Form from '@/app/ui/places/create-form';
import Breadcrumbs from '@/app/ui/places/breadcrumbs';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Nou Lloc',
};

export default async function Page() {
  // const customers = await fetchCustomers();

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
