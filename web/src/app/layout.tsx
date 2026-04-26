import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: {
    default: "KulPik - Laptop Recommendation for Indonesian Students",
    template: "%s | KulPik",
  },
  description:
    "Platform rekomendasi laptop untuk mahasiswa Indonesia. AI-powered laptop recommendations berdasarkan jurusan, budget, dan kebutuhan akademik.",
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
  metadataBase: new URL("https://kulpik.com"),
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: "https://kulpik.com",
    siteName: "KulPik",
    title: "KulPik - Laptop Recommendation for Indonesian Students",
    description:
      "Platform rekomendasi laptop untuk mahasiswa Indonesia. AI-powered laptop recommendations berdasarkan jurusan, budget, dan kebutuhan akademik.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "KulPik - Laptop Recommendations for Indonesian Students",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "KulPik - Laptop Recommendation for Indonesian Students",
    description:
      "Platform rekomendasi laptop untuk mahasiswa Indonesia. AI-powered laptop recommendations berdasarkan jurusan, budget, dan kebutuhan akademik.",
    images: ["/og-image.png"],
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
      </head>
      <body className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
