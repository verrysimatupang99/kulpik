import { Metadata } from "next";

export const DEFAULT_METADATA: Metadata = {
  title: {
    default: "KulPik - Laptop Recommendation for Indonesian Students",
    template: "%s | KulPik",
  },
  description: "Platform rekomendasi laptop untuk mahasiswa Indonesia. AI-powered laptop recommendations berdasarkan jurusan, budget, dan kebutuhan akademik.",
  keywords: [
    "rekomendasi laptop mahasiswa",
    "laptop untuk mahasiswa Indonesia",
    "laptop jurusan",
    "laptop teknik informatika",
    "laptop DKV",
    "laptop murah untuk kuliah",
    "laptop gaming mahasiswa",
    "laptop ringan mahasiswa",
    "AI laptop recommendation",
    "rekomendasi laptop berdasarkan jurusan",
  ],
  authors: [{ name: "KulPik Team" }],
  creator: "KulPik",
  publisher: "KulPik",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || "https://kulpik.vercel.app"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "id_ID",
    siteName: "KulPik",
    title: "KulPik - Laptop Recommendation for Indonesian Students",
    description: "Platform rekomendasi laptop untuk mahasiswa Indonesia. AI-powered laptop recommendations berdasarkan jurusan, budget, dan kebutuhan akademik.",
    url: "/",
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "KulPik - Laptop Recommendation for Indonesian Students",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "KulPik - Laptop Recommendation for Indonesian Students",
    description: "Platform rekomendasi laptop untuk mahasiswa Indonesia. AI-powered laptop recommendations berdasarkan jurusan, budget, dan kebutuhan akademik.",
    images: ["/images/og-image.jpg"],
    creator: "@kulpik",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: process.env.GOOGLE_VERIFICATION,
    yandex: process.env.YANDEX_VERIFICATION,
  },
};

interface SeoMetadataProps {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  url?: string;
}

export function SeoMetadata({
  title,
  description,
  keywords,
  image,
  url,
}: SeoMetadataProps): Metadata {
  const metadata = { ...DEFAULT_METADATA };

  if (title) {
    metadata.title = {
      default: `${title} | KulPik`,
      template: "%s | KulPik",
    };
  }

  if (description) {
    metadata.description = description;
  }

  if (keywords && keywords.length > 0) {
    const defaultKeywords = DEFAULT_METADATA.keywords || [];
    metadata.keywords = [...defaultKeywords, ...keywords];
  }

  if (image) {
    metadata.openGraph = {
      ...metadata.openGraph,
      images: [{ url: image, alt: title || "KulPik" }],
    };
    metadata.twitter = {
      ...metadata.twitter,
      images: [image],
    };
  }

  if (url) {
    metadata.alternates = {
      ...metadata.alternates,
      canonical: url,
    };
  }

  return metadata;
}

export default SeoMetadata;
