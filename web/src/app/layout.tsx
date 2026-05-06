import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: {
    default: 'KulPik — Rekomendasi Laptop untuk Mahasiswa Indonesia',
    template: '%s | KulPik',
  },
  description:
    'Temukan laptop terbaik untuk kuliah berdasarkan jurusan, budget, spesifikasi, dan harga marketplace Indonesia. KulPik membantu calon mahasiswa, mahasiswa, dan orang tua memilih laptop yang tepat dengan rekomendasi berbasis data dan AI.',
  keywords: [
    'rekomendasi laptop mahasiswa',
    'laptop untuk mahasiswa Indonesia',
    'laptop jurusan',
    'laptop teknik informatika',
    'laptop DKV',
    'laptop murah untuk kuliah',
    'laptop gaming mahasiswa',
    'laptop ringan mahasiswa',
    'AI laptop recommendation',
    'rekomendasi laptop berdasarkan jurusan',
    'laptop untuk coding',
    'laptop untuk desain grafis',
    'laptop untuk arsitektur',
    'laptop 5 jutaan mahasiswa',
    'laptop 7 jutaan mahasiswa',
    'compare laptop Indonesia',
    'harga laptop Indonesia',
  ],
  authors: [{ name: 'KulPik Team' }],
  creator: 'KulPik',
  publisher: 'KulPik',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://kulpik.com'),
  openGraph: {
    type: 'website',
    locale: 'id_ID',
    url: 'https://kulpik.com',
    siteName: 'KulPik',
    title: 'KulPik — Rekomendasi Laptop untuk Mahasiswa Indonesia',
    description:
      'Temukan laptop terbaik untuk kuliah berdasarkan jurusan, budget, spesifikasi, dan harga marketplace Indonesia.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'KulPik — Rekomendasi Laptop untuk Mahasiswa Indonesia',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'KulPik — Rekomendasi Laptop untuk Mahasiswa Indonesia',
    description:
      'Temukan laptop terbaik untuk kuliah berdasarkan jurusan, budget, spesifikasi, dan harga marketplace Indonesia.',
    images: ['/og-image.png'],
    creator: '@kulpik',
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
  alternates: {
    canonical: 'https://kulpik.com',
  },
  category: 'education',
  classification: 'Laptop recommendation platform for Indonesian students',
};

const structuredData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebSite',
      '@id': 'https://kulpik.com/#website',
      url: 'https://kulpik.com',
      name: 'KulPik',
      alternateName: 'Kuliah Pilih Laptop',
      description:
        'Platform rekomendasi laptop berbasis data dan AI untuk mahasiswa Indonesia.',
      inLanguage: 'id-ID',
      potentialAction: {
        '@type': 'SearchAction',
        target: 'https://kulpik.com/search?q={search_term_string}',
        'query-input': 'required name=search_term_string',
      },
    },
    {
      '@type': 'Organization',
      '@id': 'https://kulpik.com/#organization',
      name: 'KulPik',
      url: 'https://kulpik.com',
      logo: 'https://kulpik.com/logo.png',
      sameAs: ['https://github.com/verrysimatupang99/kulpik'],
    },
    {
      '@type': 'SoftwareApplication',
      '@id': 'https://kulpik.com/#app',
      name: 'KulPik',
      applicationCategory: 'EducationalApplication',
      operatingSystem: 'Web',
      url: 'https://kulpik.com',
      description:
        'Aplikasi rekomendasi laptop untuk mahasiswa Indonesia berdasarkan jurusan, budget, spesifikasi, dan harga marketplace.',
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'IDR',
      },
      audience: {
        '@type': 'Audience',
        audienceType:
          'Calon mahasiswa, mahasiswa Indonesia, dan orang tua yang mencari laptop untuk kuliah',
      },
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <head>
        <script src="https://js.puter.com/v2/" async></script>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      <body className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
