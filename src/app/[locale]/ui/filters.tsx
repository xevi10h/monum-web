'use client';

import { Popover, Transition } from '@headlessui/react';
import {
  FunnelIcon,
  ChevronDownIcon,
  CheckIcon,
  PhotoIcon,
  BuildingOffice2Icon,
} from '@heroicons/react/24/outline';
import { Fragment, useEffect, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useQuery } from '@apollo/client';
import { getUniqueCities } from '@/queries/getUniqueCities';
import {
  saveFiltersToLocalStorage,
  loadFiltersFromLocalStorage,
} from '@/utils/localStorage';

// Tipos para filtros
type FilterKey = 'hasPhotos' | 'cities';
interface Filter {
  key: FilterKey;
  label: string;
  icon: JSX.Element;
  possibleValues: string[];
  multiple?: boolean;
}

export default function Filters() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { replace } = useRouter();

  // Llamada GraphQL para obtener ciudades
  const { data: citiesData, loading, error } = useQuery(getUniqueCities);

  // Lista de filtros
  const [filtersList, setFiltersList] = useState<Filter[]>([
    {
      key: 'hasPhotos',
      label: 'Tiene fotos?',
      icon: <PhotoIcon className="h-4 w-4" />,
      possibleValues: ['true', 'false'],
    },
    {
      key: 'cities',
      label: 'Ciudades',
      icon: <BuildingOffice2Icon className="h-4 w-4" />,
      multiple: true,
      possibleValues: [], // se llenará con la data del backend
    },
  ]);

  // Filtro activo
  const [activeFilterKey, setActiveFilterKey] = useState<FilterKey | null>(
    null,
  );

  // Estados temporales (hasta pulsar “Aceptar”)
  const [tempHasPhotos, setTempHasPhotos] = useState<string | null>(null);
  const [tempCities, setTempCities] = useState<string[]>([]);

  // Estados confirmados (los que sí se aplican en la URL)
  const [committedHasPhotos, setCommittedHasPhotos] = useState<string | null>(
    null,
  );
  const [committedCities, setCommittedCities] = useState<string[]>([]);

  // Cuando `citiesData` llega, rellenamos `possibleValues` de "cities"
  useEffect(() => {
    if (citiesData?.uniqueCities) {
      const uniqueCities: string[] = citiesData.uniqueCities.filter(
        (city): city is string => city !== null,
      );
      setFiltersList((prev) =>
        prev.map((f) =>
          f.key === 'cities' ? { ...f, possibleValues: uniqueCities } : f,
        ),
      );
    }
  }, [citiesData]);

  // Inicializar desde `localStorage` o URL
  useEffect(() => {
    const storedFilters = loadFiltersFromLocalStorage();
    if (storedFilters) {
      setTempHasPhotos(storedFilters.hasPhotos);
      setCommittedHasPhotos(storedFilters.hasPhotos);
      setTempCities(storedFilters.cities);
      setCommittedCities(storedFilters.cities);
    } else {
      const hasPhotosParam = searchParams.get('hasPhotos');
      if (hasPhotosParam === 'true' || hasPhotosParam === 'false') {
        setTempHasPhotos(hasPhotosParam);
        setCommittedHasPhotos(hasPhotosParam);
      }

      const citiesParam = searchParams.get('cities');
      if (citiesParam) {
        const arr = citiesParam.split(',');
        setTempCities(arr);
        setCommittedCities(arr);
      }
    }
  }, [searchParams]);

  // Guardar filtros confirmados en `localStorage` cada vez que cambian
  useEffect(() => {
    saveFiltersToLocalStorage({
      hasPhotos: committedHasPhotos,
      cities: committedCities,
    });
  }, [committedHasPhotos, committedCities]);

  // Manejo de filtro activo
  function handleFilterSelect(key: FilterKey) {
    setActiveFilterKey((prev) => (prev === key ? null : key));
  }

  // Seleccionar valor (temporal)
  function handleTempHasPhotos(value: string) {
    setTempHasPhotos((prev) => (prev === value ? null : value));
  }
  function handleTempCityToggle(city: string) {
    setTempCities((prev) => {
      if (prev.includes(city)) return prev.filter((c) => c !== city);
      return [...prev, city];
    });
  }

  // “Aplicar” => confirmamos + actualizamos URL y cerramos popover
  function handleApply(closePopover: () => void) {
    // Pasamos temporales a confirmados
    setCommittedHasPhotos(tempHasPhotos);
    setCommittedCities(tempCities);

    // Actualizamos la URL
    const params = new URLSearchParams(searchParams);
    // Reseteamos paginación
    params.set('page', '1');

    // hasPhotos
    if (tempHasPhotos) {
      params.set('hasPhotos', tempHasPhotos);
    } else {
      params.delete('hasPhotos');
    }
    // cities
    if (tempCities.length > 0) {
      params.set('cities', tempCities.join(','));
    } else {
      params.delete('cities');
    }

    replace(`${pathname}?${params.toString()}`);
    closePopover();
  }

  // “Cancelar” => deshacemos cambios y cerramos
  function handleCancel(closePopover: () => void) {
    setTempHasPhotos(committedHasPhotos);
    setTempCities(committedCities);
    closePopover();
  }

  // Render
  return (
    <Popover className="relative">
      {({ open, close }: any) => (
        <>
          <Popover.Button
            className="
              inline-flex items-center gap-2 rounded-md border border-gray-300
              bg-white px-3 py-2 text-sm font-medium text-gray-700
              hover:bg-gray-50 focus:outline-none
            "
          >
            <FunnelIcon className="h-4 w-4" />
            <span>Filtros</span>
            <ChevronDownIcon className="h-4 w-4" />
          </Popover.Button>

          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Popover.Panel
              className="
                absolute left-0 z-50 mt-2 w-[200px]
                rounded-md bg-white shadow-lg ring-1 ring-black
                ring-opacity-5
              "
            >
              {/* Columna Izquierda: filtros */}
              <div className="p-2">
                <p className="mb-2 text-sm font-semibold text-gray-500">
                  Selecciona un filtro
                </p>
                {filtersList.map((f) => {
                  const isActive = activeFilterKey === f.key;
                  return (
                    <div key={f.key} className="mb-1">
                      <button
                        type="button"
                        onClick={() => handleFilterSelect(f.key)}
                        className={`
                          flex w-full items-center gap-2 rounded px-2 py-1 text-left text-sm
                          ${
                            isActive
                              ? 'bg-gray-100 text-blue-700'
                              : 'text-gray-700 hover:bg-gray-50'
                          }
                        `}
                      >
                        {f.icon}
                        {f.label}
                      </button>
                    </div>
                  );
                })}
              </div>

              {/* Columna Derecha: opciones del filtro activo (posicionadas como sub-dropdown) */}
              {activeFilterKey && (
                <div
                  className="
                    absolute left-full top-0 mt-2 w-[200px]
                    rounded-md bg-white p-2 shadow-lg ring-1 ring-black ring-opacity-5
                  "
                >
                  {activeFilterKey === 'hasPhotos' && (
                    <div className="flex flex-col gap-1">
                      {filtersList
                        .find((x) => x.key === 'hasPhotos')
                        ?.possibleValues.map((val) => {
                          const checked = tempHasPhotos === val;
                          return (
                            <button
                              key={val}
                              type="button"
                              onClick={() => handleTempHasPhotos(val)}
                              className={`
                                flex w-full items-center justify-between rounded px-2 py-1 text-left
                                text-sm hover:bg-gray-50
                                ${
                                  checked
                                    ? 'bg-gray-100 text-blue-600'
                                    : 'text-gray-700'
                                }
                              `}
                            >
                              <span>{val === 'true' ? 'Sí' : 'No'}</span>
                              {checked && (
                                <CheckIcon className="h-4 w-4 text-blue-600" />
                              )}
                            </button>
                          );
                        })}
                    </div>
                  )}

                  {activeFilterKey === 'cities' && (
                    <div className="max-h-60 space-y-1 overflow-y-auto">
                      {filtersList
                        .find((x) => x.key === 'cities')
                        ?.possibleValues.map((city) => {
                          const checked = tempCities.includes(city);
                          return (
                            <button
                              key={city}
                              type="button"
                              onClick={() => handleTempCityToggle(city)}
                              className={`
                                flex w-full items-center justify-between rounded px-2 py-1 text-left
                                text-sm hover:bg-gray-50
                                ${
                                  checked
                                    ? 'bg-gray-100 text-blue-600'
                                    : 'text-gray-700'
                                }
                              `}
                            >
                              <span>{city}</span>
                              {checked && (
                                <CheckIcon className="h-4 w-4 text-blue-600" />
                              )}
                            </button>
                          );
                        })}
                    </div>
                  )}
                </div>
              )}

              {/* Footer: botones Aceptar/Cancelar */}
              <div className="mt-2 flex justify-end gap-2 border-t border-gray-200 px-2 py-2">
                <Popover.Button
                  as="button"
                  onClick={() => handleCancel(close)}
                  className="
                    rounded-md bg-white px-3 py-1 text-sm text-gray-700
                    ring-1 ring-gray-300 hover:bg-gray-50
                  "
                >
                  Cancelar
                </Popover.Button>
                <Popover.Button
                  as="button"
                  onClick={() => handleApply(close)}
                  className="
                    rounded-md bg-blue-600 px-3 py-1 text-sm text-white
                    hover:bg-blue-700
                  "
                >
                  Aceptar
                </Popover.Button>
              </div>
            </Popover.Panel>
          </Transition>
        </>
      )}
    </Popover>
  );
}
