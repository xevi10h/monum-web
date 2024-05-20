import createMiddleware from 'next-intl/middleware';
import { localePrefix, locales } from './navigation';

export default createMiddleware({
  defaultLocale: 'ca',
  localePrefix,
  locales,
});

export const config = {
  matcher: ['/((?!api|_next|.*\\..*).*)'],
};
