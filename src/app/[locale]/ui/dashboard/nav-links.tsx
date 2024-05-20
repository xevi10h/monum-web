'use client';

import { HomeIcon, Cog6ToothIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import { Link, usePathname } from '@/navigation';
import MonumMap from '../monum-map';
import { useTranslations } from 'next-intl';

// Map of links to display in the side navigation.
// Depending on the size of the application, this would be stored in a database.
const links = [
  { name: 'home', href: '/dashboard', icon: HomeIcon },
  {
    name: 'monums',
    href: '/dashboard/places/list',
    href2: '/dashboard/places/map',
    icon: MonumMap,
  },
  {
    name: 'settings',
    href: '/dashboard/settings',
    icon: Cog6ToothIcon,
  },
];

export default function NavLinks() {
  const pathName = usePathname();
  const t = useTranslations('Sidenav');
  return (
    <>
      {links.map((link) => {
        const LinkIcon = link.icon;
        return (
          <Link
            key={link.name}
            href={link.href}
            className={clsx(
              'flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-monum-green-hover hover:text-monum-green-default md:flex-none md:justify-start md:p-2 md:px-3',
              {
                'bg-monum-green-selected text-monum-green-default':
                  pathName === link.href || pathName === link.href2,
              },
            )}
          >
            <LinkIcon className="w-6" />
            <p className="hidden md:block">{t(link.name)}</p>
          </Link>
        );
      })}
    </>
  );
}
