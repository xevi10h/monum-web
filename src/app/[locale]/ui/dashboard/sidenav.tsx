'use client';

import { Link } from '@/navigation';
import NavLinks from '@/app/[locale]/ui/dashboard/nav-links';
import MonumLetters from '@/app/[locale]/ui/monum-letters';
import MonumIcon from '../monum-icon-white';

export default function SideNav() {
  return (
    <div className="flex h-full flex-col px-3 py-4 md:px-2">
      <Link
        className="mb-2 flex h-20 items-end justify-start rounded-md bg-monum-green-dark p-3 md:h-40"
        style={{
          backgroundImage: 'url(/background_monums_horizontal.png)',
          backgroundSize: 'cover',
        }}
        href="/dashboard/places/list"
      >
        <div className="px-1">
          <MonumIcon />
        </div>
        <div className="px-1">
          <MonumLetters />
        </div>
      </Link>
      <div className="flex grow flex-row justify-between space-x-2 md:flex-col md:space-x-0 md:space-y-2">
        <NavLinks />
        <div className="hidden h-auto w-full grow rounded-md bg-gray-50 md:block"></div>
      </div>
    </div>
  );
}
