import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'High Spirits Cafe | Best Bar & Live Music in Koregaon Park, Pune',
  description: 'Pune\'s favourite nightlife destination. Live music, signature cocktails, great food, and unforgettable vibes. Happy hour 12–6 PM daily.',
  keywords: 'High Spirits Cafe, Pune, Koregaon Park, bar, live music, cocktails, nightlife',
  openGraph: {
    title: 'High Spirits Cafe | Best Bar & Live Music in Pune',
    description: 'Pune\'s favourite nightlife destination. Live music, signature cocktails, great food.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen flex flex-col">
        {children}
      </body>
    </html>
  );
}
