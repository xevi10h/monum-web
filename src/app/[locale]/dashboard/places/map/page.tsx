'use client';
import Search from '@/app/[locale]/ui/search';
import { CreatePlace, TogglePlaceView } from '@/app/[locale]/ui/places/buttons';
import { montserrat } from '@/app/[locale]/ui/fonts';
import requireAuth from '@/auth';
import { VariablesOf, graphql } from '@/graphql';
import { useQuery } from '@apollo/client';
import MapboxMap from '@/app/[locale]/ui/places/map/MapboxMap';
import { useTranslations } from 'next-intl';
import { useGlobalStore } from '@/zustand/GlobalStore';
import { IPlaceMap } from '@/shared/interfaces/IPlace';

const getAllMapPlaces = graphql(`
  query Places($textSearch: String, $centerCoordinates: [Float]) {
    places(textSearch: $textSearch, centerCoordinates: $centerCoordinates) {
      id
      name
      address {
        coordinates {
          lat
          lng
        }
      }
      importance
    }
  }
`);

function Page({
  searchParams,
}: {
  searchParams?: {
    query?: string;
  };
}) {
  const setIsLoading = useGlobalStore((state) => state.setIsLoading);
  const t = useTranslations('MonumsMap');
  const query = searchParams?.query;
  const variables: VariablesOf<typeof getAllMapPlaces> = {
    textSearch: query,
  };

  const { loading, error, data, refetch } = useQuery(getAllMapPlaces, {
    variables,
  });

  setIsLoading(loading);

  const places: {
    id: string;
    name: string;
    address: {
      coordinates: {
        lat: number;
        lng: number;
      };
    };
    importance: number;
  }[] = (data?.places || []) as IPlaceMap[];

  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className={`${montserrat.className} text-2xl`}>Monums</h1>
      </div>
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <Search placeholder={t('searchMonums')} />∫
        <TogglePlaceView view="map" />
        <CreatePlace />
      </div>
      <div className="h-[80vh] w-full">
        <MapboxMap places={places} />
      </div>
    </div>
  );
}

export default requireAuth(Page);
