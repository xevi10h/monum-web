'use client';

import { Cog6ToothIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import { Link, usePathname } from '@/navigation';
import MonumMap from '../monum-map';
import MonumRoutes from '../monum-routes';
import { useTranslations } from 'next-intl';

// Map of links to display in the side navigation.
// Depending on the size of the application, this would be stored in a database.
const links = [
  {
    name: 'monums',
    href: '/dashboard/places/list',
    path: '/dashboard/places',
    icon: MonumMap,
  },
  {
    name: 'routes',
    href: '/dashboard/routes',
    path: '/dashboard/routes',
    icon: MonumRoutes,
  },
  {
    name: 'settings',
    href: '/dashboard/settings',
    path: '/dashboard/settings',
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
              'flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-normal hover:bg-monum-green-light md:flex-none md:justify-start md:p-2 md:px-3',
              {
                'border-r-8 border-monum-green-default font-semibold text-monum-green-default':
                  pathName.includes(link.path),
              },
            )}
          >
            <LinkIcon className="mr-2 w-6" />
            <p className="hidden md:block">{t(link.name)}</p>
          </Link>
        );
      })}
    </>
  );
}
