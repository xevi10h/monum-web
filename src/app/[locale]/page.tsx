import MonumIcon from '@/app/[locale]/ui/monum-icon-white';
import MonumLetters from '@/app/[locale]/ui/monum-letters';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import { Link } from '@/navigation';
import Image from 'next/image';
import { useTranslations } from 'next-intl';

export default function Page() {
  const t = useTranslations('Root');
  return (
    <main className="flex min-h-screen flex-col p-6">
      <div
        className="h-30 align-items-center flex shrink-0 justify-end gap-3 rounded-lg bg-monum-green-dark px-20 py-10"
        style={{
          backgroundImage: 'url(/background_monums_horizontal.png)',
          backgroundRepeat: 'repeat-x',
          backgroundSize: 'auto 100%',
          width: '100%',
          minHeight: '150px',
        }}
      >
        <MonumIcon /> <MonumLetters />
      </div>
      <div className="mt-4 flex grow flex-col gap-4 md:flex-row">
        <div className="flex flex-col justify-center gap-6 rounded-lg bg-gray-50 px-6 py-10 md:w-2/5 md:px-20">
          <p className={`text-xl text-gray-800 md:text-3xl md:leading-normal`}>
            <strong>{t('title')}</strong>
          </p>
          <p className={`text-xl text-gray-800 md:text-2xl md:leading-normal`}>
            {t('subtitle')}
          </p>
          <Link
            href={'/login'}
            className="flex items-center gap-5 self-start rounded-lg bg-monum-green-default px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-monum-green-dark md:text-base"
          >
            <span>{t('access')}</span> <ArrowRightIcon className="w-5 md:w-6" />
          </Link>
        </div>
        <div className="relative flex items-center justify-center p-6 md:w-3/5 md:px-28 md:py-12">
          <Image
            src="/login-image.png"
            alt="Screenshots of dashboard"
            className="block md:block"
            width={300}
            height={700}
          />
        </div>
      </div>
    </main>
  );
}
