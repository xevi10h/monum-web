export const saveFiltersToLocalStorage = (filters: {
  hasPhotos: string | null;
  cities: string[];
}) => {
  try {
    const serializedFilters = JSON.stringify(filters);
    localStorage.setItem('filters', serializedFilters);
  } catch (error) {
    console.error('Error al guardar filtros en localStorage', error);
  }
};

export const loadFiltersFromLocalStorage = (): {
  hasPhotos: string | null;
  cities: string[];
} | null => {
  try {
    const serializedFilters = localStorage.getItem('filters');
    if (serializedFilters === null) return null;
    return JSON.parse(serializedFilters);
  } catch (error) {
    console.error('Error al cargar filtros desde localStorage', error);
    return null;
  }
};
