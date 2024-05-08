'use client';

import { HomeIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import MonumMap from '../monum-map';

// Map of links to display in the side navigation.
// Depending on the size of the application, this would be stored in a database.
const links = [
  { name: 'Inici', href: '/dashboard', icon: HomeIcon },
  {
    name: 'Monums',
    href: '/dashboard/places',
    icon: MonumMap,
  },
];

export default function NavLinks() {
  const pathName = usePathname();

  return (
    <>
      {links.map((link) => {
        const LinkIcon = link.icon;
        return (
          <Link
            key={link.name}
            href={link.href}
            className={clsx(
              'hover:bg-monum-green-hover flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:text-monum-green-default md:flex-none md:justify-start md:p-2 md:px-3',
              {
                'bg-monum-green-selected text-monum-green-default':
                  pathName === link.href,
              },
            )}
          >
            <LinkIcon className="w-6" />
            <p className="hidden md:block">{link.name}</p>
          </Link>
        );
      })}
    </>
  );
}
