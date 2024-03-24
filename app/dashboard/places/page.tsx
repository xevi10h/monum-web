'use client';
import Pagination from '@/app/ui/places/pagination';
import Search from '@/app/ui/search';
import PlacesTable from '@/app/ui/places/table';
import { CreatePlace } from '@/app/ui/places/buttons';
import { montserrat } from '@/app/ui/fonts';
import { Suspense } from 'react';
import requireAuth from '@/atuh';
import { VariablesOf, graphql } from '@/graphql';
import { useQuery } from '@apollo/client';

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
        }
        importance
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
  const query = searchParams?.query || '';
  const currentPage = Number(searchParams?.page) || 1;
  const variables: VariablesOf<typeof getPlaceBySearchAndPagination> = {
    textSearch: query,
    pageNumber: currentPage,
    resultsPerPage: 10,
  };

  const { loading, error, data } = useQuery(getPlaceBySearchAndPagination, {
    variables,
  });
  const places = data?.getPlaceBySearchAndPagination?.places || [];
  const totalPages =
    data?.getPlaceBySearchAndPagination?.pageInfo?.totalPages || 1;
  let placesForTable: Array<Place> = [];
  for (let i = 0; i < places.length; i++) {
    if (places[i]) {
      const id: string = places[i]?.id as string;
      const name: string = places[i]?.name as string;
      const street: string = places[i]?.address?.street as string;
      const city: string = places[i]?.address?.city as string;
      const country: string = places[i]?.address?.country as string;
      const postalCode: string = places[i]?.address?.postalCode as string;
      const province: string = places[i]?.address?.province as string;
      const importance: number = places[i]?.importance as number;
      placesForTable.push({
        id: id,
        name: name,
        address: {
          street: street,
          city: city,
          country: country,
          postalCode: postalCode,
          province: province,
        },
        importance: importance,
      });
    }
  }
  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className={`${montserrat.className} text-2xl`}>Llocs</h1>
      </div>
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <Search placeholder="Busca llocs..." />
        <CreatePlace />
      </div>
      <Suspense>
        <PlacesTable places={placesForTable} />
      </Suspense>
      <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={totalPages} />
      </div>
    </div>
  );
}

export default requireAuth(Page);
