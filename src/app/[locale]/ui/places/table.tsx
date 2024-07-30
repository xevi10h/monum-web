import { Place } from '@/app/[locale]/dashboard/places/interfaces';
import {
  UpdatePlace,
  DeletePlace,
  NavigateToMedias,
  NavigateToPhotos,
} from '@/app/[locale]/ui/places/buttons';
import { Locale } from '@/shared/types/Locale';
import { useLocale, useTranslations } from 'next-intl';
import { LocaleToDateTimeFormat } from '@/shared/types/DateTimeFormat';

export default function PlacesTable({ places }: { places: Array<Place> }) {
  const locale = useLocale() as Locale;
  const t = useTranslations('MonumsList');
  const dateFormater = new Intl.DateTimeFormat(LocaleToDateTimeFormat[locale], {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
  });
  return (
    <div className="mt-6 flow-root">
      <div className="inline-block min-w-full align-middle">
        <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
          <table className="hidden w-full table-fixed text-xs text-gray-900 md:table">
            <thead className="rounded-lg text-left text-sm font-normal">
              <tr>
                <th
                  scope="col"
                  className="px-4 py-5 text-center font-medium sm:pl-6"
                  style={{ width: '20%' }}
                >
                  {t('name')}
                </th>
                <th
                  scope="col"
                  className="px-3 py-5 text-center font-medium"
                  style={{ width: '30%' }}
                >
                  {t('address')}
                </th>
                <th
                  scope="col"
                  className="px-3 py-5 text-center font-medium"
                  style={{ width: '15%' }}
                >
                  {t('importance')}
                </th>
                <th
                  scope="col"
                  className="px-4 py-5 text-center font-medium sm:pl-6"
                  style={{ width: '15%' }}
                >
                  {t('createdAt')}
                </th>
                <th
                  scope="col"
                  className="px-4 py-5 text-center font-medium sm:pl-6"
                  style={{ width: '15%' }}
                >
                  {t('updatedAt')}
                </th>
                <th
                  scope="col"
                  className="px-4 py-5 text-center font-medium sm:pl-6"
                  style={{ width: '35%' }}
                >
                  {t('actions')}
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {places?.map((place) => (
                <tr
                  key={place?.id}
                  className="border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                >
                  <td className="px-3 py-3 text-center">{place?.name}</td>
                  <td className="px-3 py-3 text-center">
                    {`${place?.address.street.includes('undefined') ? 'NO STREET' : place?.address.street}, ${place?.address.city.includes('undefined') ? 'NO CITY' : place?.address.city}, ${place?.address.postalCode.includes('undefined') ? 'NO POSTAL CODE' : place?.address.postalCode}, ${place?.address.province.includes('undefined') ? 'NO PROVINCE' : place?.address.province}, ${place?.address.country.includes('undefined') ? 'NO COUNTRY' : place?.address.country}`}
                  </td>
                  <td className="px-3 py-3 text-center">{place?.importance}</td>
                  <td className="px-3 py-3 text-center">
                    {dateFormater.format(place?.createdAt)}
                  </td>
                  <td className="px-3 py-3 text-center">
                    {dateFormater.format(place?.updatedAt)}
                  </td>
                  <td className="py-3 pl-6 pr-3">
                    <div className="flex justify-center gap-3">
                      <NavigateToPhotos id={place?.id} />
                      <NavigateToMedias id={place?.id} />
                      <UpdatePlace id={place?.id} />
                      <DeletePlace id={place?.id} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
