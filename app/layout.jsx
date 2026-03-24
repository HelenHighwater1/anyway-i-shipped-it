import { Inter, Montserrat } from 'next/font/google';
import { Analytics } from '@vercel/analytics/react';
import { SITE_TITLE, SITE_TAGLINE } from '@/lib/site';
import './globals.css';

const sansFont = Inter({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-sans',
});

const bodyFont = Montserrat({
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
  variable: '--font-body',
});

const VIRGIL_WOFF2 =
  'https://cdn.jsdelivr.net/npm/@excalidraw/excalidraw@0.17.0/dist/excalidraw-assets/Virgil.woff2';

export const metadata = {
  title: SITE_TITLE,
  description: SITE_TAGLINE,
  icons: {
    icon: [{ url: '/assets/favicon.png', type: 'image/png' }],
    apple: '/assets/favicon.png',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${sansFont.variable} ${bodyFont.variable}`}>
      <head>
        <link
          href={VIRGIL_WOFF2}
          rel="preload"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
      </head>
      <body className="dotGrid">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
