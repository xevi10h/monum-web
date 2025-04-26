'use client';
import { Locale } from '@/shared/types/Locale';
import { useLocale, useTranslations } from 'next-intl';
import { LocaleToDateTimeFormat } from '@/shared/types/DateTimeFormat';
import { IRouteTranslated } from '@/shared/interfaces/IRoute';
import { DeleteRoute, UpdateRoute, ViewRouteInMap } from './buttons';

export default function RoutesTable({
  routes,
}: {
  routes: Array<IRouteTranslated>;
}) {
  const locale = useLocale() as Locale;
  const t = useTranslations('RoutesList');
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
                  {t('title')}
                </th>
                <th
                  scope="col"
                  className="px-3 py-5 text-center font-medium"
                  style={{ width: '30%' }}
                >
                  {t('description')}
                </th>
                <th
                  scope="col"
                  className="px-3 py-5 text-center font-medium"
                  style={{ width: '15%' }}
                >
                  {t('stopsCount')}
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
              {routes?.map((route) => (
                <tr
                  key={route?.id}
                  className="border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                >
                  <td className="px-3 py-3 text-center">{route?.title}</td>
                  <td className="px-3 py-3 text-center">
                    {route?.description}
                  </td>
                  <td className="px-3 py-3 text-center">{route?.stopsCount}</td>
                  <td className="px-3 py-3 text-center">
                    {dateFormater.format(route?.createdAt)}
                  </td>
                  <td className="px-3 py-3 text-center">
                    {dateFormater.format(route?.updatedAt)}
                  </td>
                  <td className="py-3 pl-6 pr-3">
                    <div className="flex justify-center gap-3">
                      <ViewRouteInMap id={route?.id} />
                      <UpdateRoute id={route?.id} />
                      <DeleteRoute id={route?.id} />
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
