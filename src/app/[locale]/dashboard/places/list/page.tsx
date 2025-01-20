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
} from '@/utils/localStorage'; // Importa tus funciones

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

  // Estado local que contendrá los "filtros aplicados" de verdad
  // (combinando searchParams con localStorage en el primer render).
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

  // Este estado nos ayuda a saber si ya hicimos la lectura de localStorage.
  // De lo contrario, el primer render podría disparar la query con datos vacíos.
  const [initialized, setInitialized] = useState(false);

  // Efecto para inicializar (solo la primera vez).
  useEffect(() => {
    // 1. Obtenemos filtros del localStorage, si existen
    const stored = loadFiltersFromLocalStorage(); // { hasPhotos: string|null, cities: string[] }

    // 2. Tomamos los parámetros de la URL
    const urlQuery = searchParams?.query ?? '';
    const urlPage = searchParams?.page ?? '1';
    const urlCities = searchParams?.cities ?? '';
    const urlHasPhotos = searchParams?.hasPhotos ?? '';

    // 3. Decidimos la prioridad
    //    - Si la URL está "vacía" (ni query, ni cities, ni hasPhotos),
    //      usamos lo de localStorage.
    //    - Si la URL trae algo, lo usamos.
    const isUrlEmpty =
      !urlQuery && !urlCities && !urlHasPhotos && urlPage === '1';

    if (isUrlEmpty && stored) {
      // Preferimos lo que haya en localStorage
      setAppliedFilters({
        query: '', // Aquí decides si guardas query en localStorage o no
        page: 1,
        cities: stored.cities || [],
        hasPhotos:
          stored.hasPhotos === 'true'
            ? true
            : stored.hasPhotos === 'false'
              ? false
              : null,
      });
    } else {
      // Preferimos lo que dice la URL
      setAppliedFilters({
        query: urlQuery,
        page: Number(urlPage) || 1,
        cities: urlCities ? urlCities.split(',') : [],
        hasPhotos:
          urlHasPhotos === 'true'
            ? true
            : urlHasPhotos === 'false'
              ? false
              : null,
      });
    }

    setInitialized(true);
  }, [searchParams]);

  // Cada vez que cambien los filtros aplicados, podemos guardar en localStorage
  // (si así lo deseas).
  useEffect(() => {
    if (initialized) {
      saveFiltersToLocalStorage({
        hasPhotos:
          appliedFilters.hasPhotos === true
            ? 'true'
            : appliedFilters.hasPhotos === false
              ? 'false'
              : null,
        cities: appliedFilters.cities,
      });
    }
  }, [appliedFilters, initialized]);

  // Variables para el useQuery
  // Fíjate que usamos `appliedFilters` en vez de leer directo de searchParams.
  const variables: VariablesOf<typeof getPlaceBySearchAndPagination> = {
    textSearch: appliedFilters.query,
    cities: appliedFilters.cities,
    hasPhotos: appliedFilters.hasPhotos,
    pageNumber: appliedFilters.page,
    resultsPerPage: 9,
    language: LocaleToLanguage[locale],
  };

  // Para evitar la query con datos vacíos antes de terminar el useEffect,
  // puedes hacer skip del query si `!initialized`.
  const { data, loading, error } = useQuery(getPlaceBySearchAndPagination, {
    variables,
    skip: !initialized,
  });

  const totalPages =
    data?.getPlaceBySearchAndPagination?.pageInfo?.totalPages || 1;

  const places = data?.getPlaceBySearchAndPagination?.places?.map((place) => {
    // Convertimos a Date, etc.
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
