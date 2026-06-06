import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'Om Chaudhary Hospital & Trauma Centre | Best Hospital',
  description: 'Om Chaudhary Hospital & Trauma Centre provides world-class healthcare services with expert doctors, modern technology, and compassionate care. Emergency services available 24/7.',
  keywords: 'hospital, trauma centre, healthcare, emergency, doctors, Om Chaudhary Hospital',
  openGraph: {
    title: 'Om Chaudhary Hospital & Trauma Centre',
    description: 'World-class healthcare services with expert doctors and 24/7 emergency care.',
    type: 'website',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
