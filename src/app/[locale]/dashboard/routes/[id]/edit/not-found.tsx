'use client';
import { Link } from '@/navigation';
import { FaceFrownIcon } from '@heroicons/react/24/outline';

import { useTranslations } from 'next-intl';

export default function NotFound() {
  const t = useTranslations('RouteEditNotFound');
  return (
    <main className="flex h-full flex-col items-center justify-center gap-2">
      <FaceFrownIcon className="w-10 text-gray-400" />
      <h2 className="text-xl font-semibold">{t('notFound')}</h2>
      <Link
        href="/dashboard/routes"
        className="mt-4 rounded-md bg-blue-500 px-4 py-2 text-sm text-white transition-colors hover:bg-blue-400"
      >
        {t('goBack')}
      </Link>
    </main>
  );
}
