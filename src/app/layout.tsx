import type { Metadata } from 'next';
import './globals.css';
import { DiagnosticErrorBoundary } from '@/components/DiagnosticErrorBoundary';
import { BusinessProvider } from '@/lib/business-config';
import { AppProvider } from '@/lib/app-context';

export const metadata: Metadata = {
  title: 'High Spirits Cafe | Best Bar & Live Music in Koregaon Park, Pune',
  description: "Pune's favourite nightlife destination. Live music, signature cocktails, great food, and unforgettable vibes. Happy hour 12–6 PM daily.",
  keywords: 'High Spirits Cafe, Pune, Koregaon Park, bar, live music, cocktails, nightlife',
  openGraph: {
    title: 'High Spirits Cafe | Best Bar & Live Music in Pune',
    description: "Pune's favourite nightlife destination. Live music, signature cocktails, great food.",
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
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased min-h-screen flex flex-col">
        <DiagnosticErrorBoundary>
          <BusinessProvider>
            <AppProvider>
              {children}
            </AppProvider>
          </BusinessProvider>
        </DiagnosticErrorBoundary>
      </body>
    </html>
  );
}
