import { montserrat } from '@/app/[locale]/ui/fonts';
import Providers from '@/provider';
import '@/app/[locale]/ui/global.css';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';

import { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    template: '%s | Monum Console',
    default: 'Monum Console',
  },
  description: "Panell d'Administració web de Monum.",
  metadataBase: new URL('https://console.monum.es'),
  openGraph: {
    images: './opengraph-image.png',
  },
};

export default async function RootLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const messages = await getMessages();
  return (
    <html lang={locale}>
      <body className={`${montserrat.className} antialiased `}>
        <NextIntlClientProvider messages={messages}>
          <Providers>{children}</Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
