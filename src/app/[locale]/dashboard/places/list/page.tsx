'use client';

import { useEffect, useState } from 'react';
import Pagination from '@/app/[locale]/ui/places/pagination';
import Search from '@/app/[locale]/ui/search';
import PlacesTable from '@/app/[locale]/ui/places/table';
import { CreatePlace, TogglePlaceView } from '@/app/[locale]/ui/places/buttons';
import { montserrat } from '@/app/[locale]/ui/fonts';
import requireAuth from '@/auth';
import { VariablesOf, graphql } from '@/graphql';
import { useQuery } from '@apollo/client';
import { Place } from '../interfaces';
import { useLocale, useTranslations } from 'next-intl';
import { Locale, LocaleToLanguage } from '@/shared/types/Locale';
import Filters from '@/app/[locale]/ui/filters';
import {
  loadFiltersFromLocalStorage,
  saveFiltersToLocalStorage,
} from '@/utils/localStorage';

const getPlaceBySearchAndPagination = graphql(`
  query Query(
    $textSearch: String!
    $cities: [String!]
    $hasPhotos: Boolean
    $pageNumber: Int!
    $resultsPerPage: Int!
    $language: Language
  ) {
    getPlaceBySearchAndPagination(
      textSearch: $textSearch
      pageNumber: $pageNumber
      resultsPerPage: $resultsPerPage
      language: $language
      cities: $cities
      hasPhotos: $hasPhotos
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

type SearchParams = {
  query?: string;
  page?: string;
  cities?: string;
  hasPhotos?: string;
};

function Page({ searchParams }: { searchParams?: SearchParams }) {
  const t = useTranslations('MonumsList');
  const locale = useLocale() as Locale;

  // Estado que contendrá los filtros aplicados (combinando URL y/o localStorage)
  const [appliedFilters, setAppliedFilters] = useState<{
    query: string;
    page: number;
    cities: string[];
    hasPhotos: boolean | null;
  }>({
    query: '',
    page: 1,
    cities: [],
    hasPhotos: null,
  });

  // Estado para controlar que ya se haya leído la información (URL o localStorage)
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    // Primero se revisa la URL
    const urlHasPhotos = searchParams?.hasPhotos;
    const urlCities = searchParams?.cities;
    const hasUrlFilter =
      urlHasPhotos === 'true' || urlHasPhotos === 'false' || urlCities;
    const urlQuery = searchParams?.query ?? '';
    const urlPage = searchParams?.page ?? '1';

    if (hasUrlFilter) {
      const citiesArray = urlCities ? urlCities.split(',') : [];
      setAppliedFilters({
        query: urlQuery,
        page: Number(urlPage) || 1,
        cities: citiesArray,
        hasPhotos:
          urlHasPhotos === 'true'
            ? true
            : urlHasPhotos === 'false'
              ? false
              : null,
      });
      saveFiltersToLocalStorage({
        query: urlQuery,
        page: Number(urlPage) || 1,
        hasPhotos:
          urlHasPhotos === 'true' || urlHasPhotos === 'false'
            ? urlHasPhotos
            : null,
        cities: citiesArray,
      });
    } else {
      // Si no hay filtros en la URL, se mira el localStorage
      const stored = loadFiltersFromLocalStorage();
      if (stored) {
        setAppliedFilters({
          query: stored.query || urlQuery || '',
          page: stored.page || 1,
          cities: stored.cities || [],
          hasPhotos:
            stored.hasPhotos === 'true'
              ? true
              : stored.hasPhotos === 'false'
                ? false
                : null,
        });
      }
    }
    setInitialized(true);
  }, [searchParams]);

  // Variables para la query (usando los filtros aplicados)
  const variables: VariablesOf<typeof getPlaceBySearchAndPagination> = {
    textSearch: appliedFilters.query,
    cities: appliedFilters.cities,
    hasPhotos: appliedFilters.hasPhotos,
    pageNumber: appliedFilters.page,
    resultsPerPage: 9,
    language: LocaleToLanguage[locale],
  };

  // Para evitar lanzar la query antes de inicializar
  const { data, loading, error } = useQuery(getPlaceBySearchAndPagination, {
    variables,
    skip: !initialized,
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
      createdAt,
      updatedAt,
    };
  }) as Array<Place>;

  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className={`${montserrat.className} text-2xl`}>Monums</h1>
      </div>
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <Search placeholder={t('searchMonums')} />
        <Filters />
        <TogglePlaceView view="list" />
        <CreatePlace />
      </div>

      <div>
        <div className="mt-4">
          {loading ? (
            <p>Cargando...</p>
          ) : error ? (
            <p>Error al cargar datos</p>
          ) : (
            <PlacesTable places={places} />
          )}
        </div>
        <div className="mt-5 flex w-full justify-center">
          <Pagination totalPages={totalPages} />
        </div>
      </div>
    </div>
  );
}

export default requireAuth(Page);
