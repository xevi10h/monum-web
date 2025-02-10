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

  // Llamada para obtener ciudades
  const { data: citiesData } = useQuery(getUniqueCities);

  // Lista de filtros
  const [filtersList, setFiltersList] = useState<Filter[]>([
    {
      key: 'hasPhotos',
      label: '¿Tiene fotos?',
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

  // Filtro activo (para mostrar el submenú)
  const [activeFilterKey, setActiveFilterKey] = useState<FilterKey | null>(
    null,
  );

  // Estados temporales (hasta pulsar “Aceptar”)
  const [tempHasPhotos, setTempHasPhotos] = useState<string | null>(null);
  const [tempCities, setTempCities] = useState<string[]>([]);

  // Estados confirmados (los que se aplican en la URL)
  const [committedHasPhotos, setCommittedHasPhotos] = useState<string | null>(
    null,
  );
  const [committedCities, setCommittedCities] = useState<string[]>([]);

  // Cuando llega la data de ciudades, se actualiza la lista
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

  // Inicializar filtros: se prioriza la URL sobre el localStorage.
  useEffect(() => {
    const urlHasPhotos = searchParams.get('hasPhotos');
    const urlCities = searchParams.get('cities');

    if (urlHasPhotos === 'true' || urlHasPhotos === 'false' || urlCities) {
      // Si la URL trae filtros, los usamos
      const hasPhotosValue =
        urlHasPhotos === 'true' || urlHasPhotos === 'false'
          ? urlHasPhotos
          : null;
      const citiesValue = urlCities ? urlCities.split(',') : [];

      setTempHasPhotos(hasPhotosValue);
      setCommittedHasPhotos(hasPhotosValue);
      setTempCities(citiesValue);
      setCommittedCities(citiesValue);

      // Actualizamos el localStorage con lo de la URL
      saveFiltersToLocalStorage({
        hasPhotos: hasPhotosValue,
        cities: citiesValue,
      });
    } else {
      // Si la URL no trae filtros, usamos los que estén en localStorage (si existen)
      const storedFilters = loadFiltersFromLocalStorage();
      if (storedFilters) {
        setTempHasPhotos(storedFilters.hasPhotos);
        setCommittedHasPhotos(storedFilters.hasPhotos);
        setTempCities(storedFilters.cities);
        setCommittedCities(storedFilters.cities);
      }
    }
  }, [searchParams]);

  // Manejo de selección del filtro activo
  function handleFilterSelect(key: FilterKey) {
    setActiveFilterKey((prev) => (prev === key ? null : key));
  }

  // Cambiar el valor temporal de "hasPhotos"
  function handleTempHasPhotos(value: string) {
    setTempHasPhotos((prev) => (prev === value ? null : value));
  }
  // Alternar selección de ciudad
  function handleTempCityToggle(city: string) {
    setTempCities((prev) => {
      if (prev.includes(city)) return prev.filter((c) => c !== city);
      return [...prev, city];
    });
  }

  // Al pulsar "Aceptar": se actualiza la URL y el localStorage
  function handleApply(closePopover: () => void) {
    // Actualizamos los filtros confirmados
    setCommittedHasPhotos(tempHasPhotos);
    setCommittedCities(tempCities);

    // Creamos y actualizamos la URL
    const params = new URLSearchParams(searchParams);
    params.set('page', '1'); // reseteamos la paginación

    if (tempHasPhotos) {
      params.set('hasPhotos', tempHasPhotos);
    } else {
      params.delete('hasPhotos');
    }

    if (tempCities.length > 0) {
      params.set('cities', tempCities.join(','));
    } else {
      params.delete('cities');
    }

    replace(`${pathname}?${params.toString()}`);

    // Guardamos en localStorage
    saveFiltersToLocalStorage({
      hasPhotos: tempHasPhotos,
      cities: tempCities,
    });
    closePopover();
  }

  // Al pulsar "Cancelar": se deshacen los cambios temporales
  function handleCancel(closePopover: () => void) {
    setTempHasPhotos(committedHasPhotos);
    setTempCities(committedCities);
    closePopover();
  }

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
              {/* Columna izquierda: lista de filtros */}
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

              {/* Columna derecha: opciones según filtro activo */}
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

              {/* Footer con botones Aceptar y Cancelar */}
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
