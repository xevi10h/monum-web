'use client';
import Pagination from '@/app/ui/places/pagination';
import Search from '@/app/ui/search';
import PlacesTable from '@/app/ui/places/table';
import { CreatePlace } from '@/app/ui/places/buttons';
import { montserrat } from '@/app/ui/fonts';
import { Suspense, useEffect } from 'react';
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
  const query = searchParams?.query || '';
  const currentPage = Number(searchParams?.page) || 1;
  const variables: VariablesOf<typeof getPlaceBySearchAndPagination> = {
    textSearch: query,
    pageNumber: currentPage,
    resultsPerPage: 9,
  };

  const { loading, error, data, refetch } = useQuery(
    getPlaceBySearchAndPagination,
    {
      variables,
    },
  );

  const places = data?.getPlaceBySearchAndPagination?.places || [];
  const totalPages =
    data?.getPlaceBySearchAndPagination?.pageInfo?.totalPages || 1;
  let placesForTable: Array<Place> = [];
  for (const place of places) {
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
    placesForTable.push({
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
    });
  }
  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className={`${montserrat.className} text-2xl`}>Monums</h1>
      </div>
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <Search placeholder="Busca monums..." />
        <CreatePlace />
      </div>
      <div className="mt-4">
        <Suspense>
          <PlacesTable places={placesForTable} />
        </Suspense>
      </div>
      <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={totalPages} />
      </div>
    </div>
  );
}

export default requireAuth(Page);
