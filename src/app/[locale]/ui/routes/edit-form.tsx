'use client';
import { Button } from '@/app/[locale]/ui/button';
import { useMutation } from '@apollo/client';
import { VariablesOf, graphql } from '@/graphql';
import { Link, useRouter } from '@/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { Language } from '@/shared/types/Language';
import { translateRoutes } from '../../dashboard/routes/translations';
import { IRoute } from '@/shared/interfaces/IRoute';
import PlacePicker from './components/PlacePicker';
import { IStop } from '@/shared/interfaces/IStop';
import { useGlobalStore } from '@/zustand/GlobalStore';
import { Locale, LocaleToLanguage } from '@/shared/types/Locale';

const UpdateRouteMutation = graphql(`
  mutation Mutation(
    $updateRouteFullId: ID!
    $routeUpdateFull: UpdateRouteFullInput!
  ) {
    updateRouteFull(id: $updateRouteFullId, routeUpdateFull: $routeUpdateFull) {
      id
    }
  }
`);

export default function EditRouteForm({ route }: { route: IRoute }) {
  const setIsLoading = useGlobalStore((state) => state.setIsLoading);
  const languages = useTranslations('Languages');
  const locale = useLocale() as Locale;
  const [selectedLanguage, setSelectedLanguage] = useState(
    LocaleToLanguage[locale],
  );
  const router = useRouter();
  const [titles, setTitles] = useState<{ [key in Language]: string }>(
    route.title,
  );
  const [descriptions, setDescriptions] = useState<{
    [key in Language]: string;
  }>(route.description);

  const [stops, setStops] = useState<IStop[]>(route.stops || []);

  const [updateRoute, { loading, error }] = useMutation(UpdateRouteMutation, {
    onError: (error) => console.error('Create route error:', error),
    onCompleted: (data) => {
      if (data?.updateRouteFull?.id) {
        const redirect = '/dashboard/routes';
        router.push(redirect);
      } else {
        console.log('Failed creating route', data);
      }
    },
    update: (cache) => {
      cache.evict({
        id: cache.identify({ __typename: 'RouteFull', id: route.id }),
      });
      cache.evict({ fieldName: 'routesPaginated' });
      cache.gc();
    },
  });

  setIsLoading(loading);

  useEffect(() => {
    setTitles(route.title);
    setDescriptions(route.description);
    setStops(route.stops || []);
  }, [route]);

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedLanguage(e.target.value as Language);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    if (name === 'title') {
      setTitles((prev) => ({ ...prev, [selectedLanguage]: value }));
    } else if (name === 'description') {
      setDescriptions((prev) => ({ ...prev, [selectedLanguage]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const objectEntriesToArrays = (obj: { [key: string]: string }) =>
      Object.entries(obj).map(([key, value]) => ({ key, value }));

    try {
      const variables: VariablesOf<typeof UpdateRouteMutation> = {
        updateRouteFullId: route.id,
        routeUpdateFull: {
          title: objectEntriesToArrays(titles),
          description: objectEntriesToArrays(descriptions),
          stops: stops.map((stop, index) => ({
            placeId: stop.place.id,
            mediasIds: stop.medias.map((media) => media && media.id),
            order: index,
            optimizedOrder: index,
          })),
        },
      };
      await updateRoute({ variables });
    } catch (error) {
      console.error('Create route error:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        <div className="mb-4">
          <div className="flex flex-row justify-between">
            <label
              htmlFor="basicInfo"
              className="text-m mb-2 block font-medium"
            >
              {translateRoutes('basicInfo', selectedLanguage)}
            </label>
            <div className="flex flex-row items-center gap-4">
              <label
                htmlFor="title"
                className="font-small block text-sm font-medium"
              >
                {translateRoutes('language', selectedLanguage)}:
              </label>
              <select
                id="language"
                name="language"
                className="rounded-md border border-gray-200 py-2 pl-3 text-sm text-gray-700"
                value={selectedLanguage}
                onChange={handleLanguageChange}
              >
                <option value="ca_ES">{languages('ca_ES')}</option>
                <option value="es_ES">{languages('es_ES')}</option>
                <option value="en_US">{languages('en_US')}</option>
                <option value="fr_FR">{languages('fr_FR')}</option>
              </select>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex-1" style={{ flexBasis: '100%' }}>
              <label htmlFor="title" className="font-small mb-2 block text-sm">
                {translateRoutes('title', selectedLanguage)}
              </label>
              <input
                id="title"
                name="title"
                type="string"
                placeholder={translateRoutes('title', selectedLanguage)}
                value={titles?.[selectedLanguage] || ''}
                onChange={handleInputChange}
                className="peer block w-full rounded-md border border-gray-200 py-2 pl-3 text-sm outline-2 placeholder:text-gray-500"
              />
            </div>
          </div>
          <div className="relative mt-2 rounded-md">
            <label
              htmlFor="description"
              className="font-small mb-2 block text-sm"
            >
              {translateRoutes('description', selectedLanguage)}
            </label>
            <textarea
              id="description"
              name="description"
              placeholder={translateRoutes('description', selectedLanguage)}
              value={descriptions?.[selectedLanguage] || ''}
              onChange={handleInputChange}
              className="peer block w-full rounded-md border border-gray-200 py-2 pl-3 text-sm outline-2 placeholder:text-gray-500"
              aria-describedby="name-error"
              style={{ minHeight: '4em' }} // Ajuste de altura mínima para visualizar al menos dos líneas
            />
          </div>
        </div>
        <PlacePicker
          stops={stops}
          setStops={setStops}
          language={selectedLanguage}
        />
      </div>
      <div className="mt-6 flex justify-center gap-4">
        <Link
          href="#"
          onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
            e.preventDefault();
            router.back();
          }}
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          {translateRoutes('cancel', selectedLanguage)}
        </Link>
        <Button disabled={loading} aria-disabled={loading}>
          {translateRoutes('save', selectedLanguage)}
        </Button>
      </div>
    </form>
  );
}
