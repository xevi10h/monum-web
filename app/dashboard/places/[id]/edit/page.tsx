import Breadcrumbs from '@/app/ui/places/breadcrumbs';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Edit Invoice',
};

export default async function Page({ params }: { params: { id: string } }) {
  // const id = params.id;
  // const [invoice, customers] = await Promise.all([
  //   fetchInvoiceById(id),
  //   fetchCustomers(),
  // ]);

  // if (!invoice) {
  //   notFound();
  // }

  return (
    <h1>Edit page</h1>
    // <main>
    //   <Breadcrumbs
    //     breadcrumbs={[
    //       { label: 'Invoices', href: '/dashboard/invoices' },
    //       {
    //         label: 'Edit Invoice',
    //         href: `/dashboard/invoices/${id}/edit`,
    //         active: true,
    //       },
    //     ]}
    //   />
    //   <Form invoice={invoice} customers={customers} />
    // </main>
  );
}
