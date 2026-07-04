import type { Metadata } from 'next';
import { getMessages } from 'next-intl/server';
import { NextIntlClientProvider } from 'next-intl';
import './globals.css';

export const metadata: Metadata = {
  title: 'IP Success – Lasting Relief from Piles Without Surgery',
  description: 'Get lasting relief from piles in 14 days without surgery. 100% Ayurvedic, GMP Certified. Trusted by 10,000+ patients. Pilescare Syrup + DOUBLE-STEM Cell Powder combo.',
  keywords: 'piles treatment, bawaseer ka ilaj, hemorrhoids, ayurvedic piles medicine, no surgery piles, IP Success',
  openGraph: {
    title: 'IP Success – Ayurvedic Piles Care',
    description: 'Relief from piles in 14 days without surgery. 100% Ayurvedic.',
    type: 'website',
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
