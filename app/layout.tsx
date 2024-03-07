import { montserrat } from '@/app/ui/fonts';
import '@/app/ui/global.css';

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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${montserrat.className} antialiased`}>{children}</body>
    </html>
  );
}
