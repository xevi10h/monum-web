'use client';

import Link from 'next/link';
import NavLinks from '@/app/ui/dashboard/nav-links';
import MonumLetters from '@/app/ui/monum-letters';
import { PowerIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';

export default function SideNav() {
  const router = useRouter();
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    localStorage.removeItem('monum_token');
    router.push('/login');
  };
  return (
    <div className="flex h-full flex-col px-3 py-4 md:px-2">
      <Link
        className="bg-monum-green-600 mb-2 flex h-20 items-end justify-start rounded-md p-4 md:h-40"
        href="/"
      >
        <div className="w-32 text-white md:w-40">
          <MonumLetters />
        </div>
      </Link>
      <div className="flex grow flex-row justify-between space-x-2 md:flex-col md:space-x-0 md:space-y-2">
        <NavLinks />
        <div className="hidden h-auto w-full grow rounded-md bg-gray-50 md:block"></div>
        <form onSubmit={handleSubmit}>
          <button className="hover:bg-monum-green-200 hover:text-monum-green-600 flex h-[48px] w-full grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium md:flex-none md:justify-start md:p-2 md:px-3">
            <PowerIcon className="w-6" />
            <div className="hidden md:block">Sortir</div>
          </button>
        </form>
      </div>
    </div>
  );
}
