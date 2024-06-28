'use client';
import { montserrat } from '@/app/[locale]/ui/fonts';
import requireAuth from '@/auth';
import { graphql } from '@/graphql';
import { useQuery } from '@apollo/client';
import { useTranslations } from 'next-intl';

const getUsersQuery = graphql(`
  query Query {
    users {
      email
    }
  }
`);
function Page() {
  const { data } = useQuery(getUsersQuery);
  const usersNumber = data?.users?.length;
  const t = useTranslations('Home');
  return (
    <main>
      <h1 className={`${montserrat.className} mb-4 text-xl md:text-2xl`}>
        {t('title')}
      </h1>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Card
          title={t('totalUsers')}
          value={usersNumber?.toString() || t('loading')}
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
