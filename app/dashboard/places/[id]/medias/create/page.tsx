'use client';
import Form from '@/app/ui/medias/create-form';
import Breadcrumbs from '@/app/ui/shared/breadcrumbs';
import requireAuth from '@/atuh';

function Page({ params }: { params: { id: string } }) {
  const id = params.id;
  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Monums', href: '/dashboard/places' },
          {
            label: `Recursos`,
            href: `{/dashboard/places/${id}/medias/`,
          },
          {
            label: 'Afegir un nou recurs',
            href: `{/dashboard/places/${id}/medias/create`,
            active: true,
          },
        ]}
      />
      <Form placeId={id} />
    </main>
  );
}

export default requireAuth(Page);
