'use client';
import Pagination from '@/app/[locale]/ui/routes/pagination';
import Search from '@/app/[locale]/ui/search';
import { montserrat } from '@/app/[locale]/ui/fonts';
import requireAuth from '@/auth';
import { VariablesOf, graphql } from '@/graphql';
import { useQuery } from '@apollo/client';
import { useTranslations } from 'next-intl';
import { IRouteTranslated } from '@/shared/interfaces/IRoute';
import RoutesTable from '../../ui/routes/table';
import { CreateRoute } from '../../ui/routes/buttons';

const getRoutesBySearchAndPagination = graphql(`
  query RoutesPaginated($textSearch: String, $limit: Int, $offset: Int) {
    routesPaginated(textSearch: $textSearch, limit: $limit, offset: $offset) {
      routes {
        createdAt
        description
        distance
        duration
        id
        optimizedDistance
        optimizedDuration
        rating
        stopsCount
        title
        updatedAt
      }
      total
    }
  }
`);

function Page({
  searchParams,
}: {
  searchParams?: {
    query?: string;
    page?: string;
  };
}) {
  const t = useTranslations('RoutesList');
  const query = searchParams?.query || '';
  const currentPage = Number(searchParams?.page) || 1;
  const resultsPerPage = 9;

  const variables: VariablesOf<typeof getRoutesBySearchAndPagination> = {
    textSearch: query,
    limit: resultsPerPage,
    offset: (currentPage - 1) * resultsPerPage,
  };

  const { data } = useQuery(getRoutesBySearchAndPagination, {
    variables,
  });

  const totalPages = data?.routesPaginated?.total
    ? data?.routesPaginated?.total / resultsPerPage
    : 1;

  const routes = data?.routesPaginated?.routes?.map((route) => {
    const rawCreatedAt = route?.createdAt;
    const rawUpdatedAt = route?.updatedAt;
    const createdAt =
      typeof rawCreatedAt === 'string' || typeof rawCreatedAt === 'number'
        ? new Date(rawCreatedAt)
        : new Date();
    const updatedAt =
      typeof rawUpdatedAt === 'string' || typeof rawUpdatedAt === 'number'
        ? new Date(rawUpdatedAt)
        : new Date();
    return {
      id: route?.id || '',
      title: route?.title || '',
      description: route?.description || '',
      rating: route?.rating,
      stopsCount: route?.stopsCount,
      duration: route?.duration,
      optimizedDistance: route?.optimizedDistance,
      optimizedDuration: route?.optimizedDuration,
      createdAt: createdAt,
      updatedAt: updatedAt,
    };
  }) as Array<IRouteTranslated>;
  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className={`${montserrat.className} text-2xl`}>{t('routes')}</h1>
      </div>
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <Search placeholder={t('searchRoutes')} />
        <CreateRoute />
      </div>
      <div>
        <div className="mt-4">
          <RoutesTable routes={routes} />
        </div>
        <div className="mt-5 flex w-full justify-center">
          <Pagination totalPages={totalPages} />
        </div>
      </div>
    </div>
  );
}

export default requireAuth(Page);
