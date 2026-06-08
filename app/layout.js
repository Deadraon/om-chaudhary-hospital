import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import { headers } from 'next/headers';

export const metadata = {
  title: 'Om Chaudhary Hospital & Trauma Centre | Best Hospital Mandawali Bijnor',
  description: 'Om Chaudhary Hospital & Trauma Centre provides world-class healthcare services with expert doctors, modern technology, and compassionate care. Emergency services available 24/7 in Mandawali, Bijnor, UP.',
  keywords: 'hospital, trauma centre, healthcare, emergency, doctors, Om Chaudhary Hospital, Mandawali, Bijnor, UP',
  openGraph: {
    title: 'Om Chaudhary Hospital & Trauma Centre',
    description: 'World-class healthcare services with expert doctors and 24/7 emergency care in Mandawali, Bijnor.',
    type: 'website',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Om Chaudhary Hospital & Trauma Centre',
      },
    ],
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
};

export default function RootLayout({ children }) {
  const headerList = headers();
  // x-pathname is set by middleware for ALL routes
  const pathname = headerList.get('x-pathname') || '';
  // x-user-role is only set by middleware for authenticated /dashboard/* routes
  const userRole = headerList.get('x-user-role') || '';
  const isDashboard = pathname.startsWith('/dashboard') || !!userRole;
  const isAuth = pathname === '/login' || pathname === '/register';
  const hideHeaderFooter = isDashboard || isAuth;

  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-screen flex flex-col">
        {!hideHeaderFooter && <Header />}
        <main className="flex-1">{children}</main>
        {!hideHeaderFooter && <Footer />}
        {!hideHeaderFooter && <WhatsAppButton />}
      </body>
    </html>
  );
}
