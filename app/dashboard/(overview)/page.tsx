'use client';
import { montserrat } from '@/app/ui/fonts';
import requireAuth from '@/atuh';
import { graphql } from '@/graphql';
import { useQuery } from '@apollo/client';

const getUsersQuery = graphql(`
  query Query {
    users {
      email
    }
  }
`);
async function Page() {
  const { data } = await useQuery(getUsersQuery);
  const usersNumber = data?.users?.length;
  return (
    <main>
      <h1 className={`${montserrat.className} mb-4 text-xl md:text-2xl`}>
        Panell d&apos;Administració
      </h1>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Card
          title="# Total d'Usuaris"
          value={usersNumber?.toString() || 'Carregant...'}
        />
      </div>
    </main>
  );
}

function Card({ title, value }: { title: string; value: number | string }) {
  return (
    <div className="rounded-xl bg-gray-50 p-2 shadow-sm">
      <div className="flex p-4">
        <h3 className="ml-2 text-sm font-medium">{title}</h3>
      </div>
      <p
        className={`${montserrat.className}
          truncate rounded-xl bg-white px-4 py-8 text-center text-2xl`}
      >
        {value}
      </p>
    </div>
  );
}

export default requireAuth(Page);
