import type { Metadata } from 'next';
import { getMessages } from 'next-intl/server';
import { NextIntlClientProvider } from 'next-intl';
import './globals.css';

export const metadata: Metadata = {
  title: 'IP Success – Lasting Relief from Piles | Ayurvedic Piles Medicine',
  description: 'Get lasting relief from piles in 14 days. IP Success is a 100% Ayurvedic, GMP Certified treatment. Trusted by thousands of patients. Non-surgical piles care.',
  keywords: 'piles treatment, bawaseer ka ilaj, hemorrhoids treatment, ayurvedic piles medicine, no surgery piles, IP Success pilescare, best piles medicine india',
  authors: [{ name: 'IP Success' }],
  creator: 'IP Success Ayurvedic Healthcare',
  publisher: 'IP Success',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: 'https://ipsuccess.in',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    title: 'IP Success – Ayurvedic Piles Care & Treatment',
    description: 'Relief from piles in 14 days without surgery. 100% Ayurvedic, GMP Certified.',
    url: 'https://ipsuccess.in',
    siteName: 'IP Success',
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'IP Success – Lasting Relief from Piles',
    description: 'Get lasting relief from piles in 14 days with our 100% Ayurvedic combo. Trusted by thousands.',
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const messages = await getMessages();

  return (
    <html lang="en">
      <body>
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
