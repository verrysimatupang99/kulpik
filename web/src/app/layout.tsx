import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "KulPik — Rekomendasi Laptop untuk Mahasiswa Indonesia",
  description:
    "Temukan laptop terbaik untuk jurusan kuliah kamu. Filter berdasarkan budget, kebutuhan jurusan, dan dapatkan rekomendasi AI.",
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
