'use client';
import Pagination from '@/app/[locale]/ui/places/pagination';
import Search from '@/app/[locale]/ui/search';
import PlacesTable from '@/app/[locale]/ui/places/table';
import { CreatePlace, TogglePlaceView } from '@/app/[locale]/ui/places/buttons';
import { montserrat } from '@/app/[locale]/ui/fonts';
import requireAuth from '@/auth';
import { VariablesOf, graphql } from '@/graphql';
import { useQuery } from '@apollo/client';
import { Place } from '../interfaces';
import { useTranslations } from 'next-intl';

const getPlaceBySearchAndPagination = graphql(`
  query Query($textSearch: String!, $pageNumber: Int!, $resultsPerPage: Int!) {
    getPlaceBySearchAndPagination(
      textSearch: $textSearch
      pageNumber: $pageNumber
      resultsPerPage: $resultsPerPage
    ) {
      places {
        id
        name
        address {
          street
          city
          country
          postalCode
          province
          coordinates {
            lat
            lng
          }
        }
        importance
        createdAt
        updatedAt
      }
      pageInfo {
        totalPages
      }
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
  const t = useTranslations('MonumsList');
  const query = searchParams?.query || '';
  const currentPage = Number(searchParams?.page) || 1;

  const variables: VariablesOf<typeof getPlaceBySearchAndPagination> = {
    textSearch: query,
    pageNumber: currentPage,
    resultsPerPage: 9,
  };

  const { data } = useQuery(getPlaceBySearchAndPagination, {
    variables,
  });

  const totalPages =
    data?.getPlaceBySearchAndPagination?.pageInfo?.totalPages || 1;

  const places = data?.getPlaceBySearchAndPagination?.places?.map((place) => {
    const rawCreatedAt = place?.createdAt;
    const rawUpdatedAt = place?.updatedAt;
    const createdAt =
      typeof rawCreatedAt === 'string' || typeof rawCreatedAt === 'number'
        ? new Date(rawCreatedAt)
        : new Date();
    const updatedAt =
      typeof rawUpdatedAt === 'string' || typeof rawUpdatedAt === 'number'
        ? new Date(rawUpdatedAt)
        : new Date();
    return {
      id: place?.id || '',
      name: place?.name || '',
      address: {
        street: place?.address?.street || '',
        city: place?.address?.city || '',
        country: place?.address?.country || '',
        postalCode: place?.address?.postalCode || '',
        province: place?.address?.province || '',
        coordinates: place?.address?.coordinates || { lat: 0, lng: 0 },
      },
      importance: place?.importance || 1,
      createdAt: createdAt,
      updatedAt: updatedAt,
    };
  }) as Array<Place>;
  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className={`${montserrat.className} text-2xl`}>Monums</h1>
      </div>
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <Search placeholder={t('searchMonums')} />
        <TogglePlaceView view="list" />
        <CreatePlace />
      </div>
      <div>
        <div className="mt-4">
          <PlacesTable places={places} />
        </div>
        <div className="mt-5 flex w-full justify-center">
          <Pagination totalPages={totalPages} />
        </div>
      </div>
    </div>
  );
}

export default requireAuth(Page);
