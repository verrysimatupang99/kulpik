import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'KulPik — Rekomendasi Laptop untuk Mahasiswa Indonesia',
    short_name: 'KulPik',
    description:
      'Platform rekomendasi laptop berbasis data dan AI untuk mahasiswa Indonesia berdasarkan jurusan, budget, dan kebutuhan akademik.',
    start_url: '/',
    scope: '/',
    display: 'standalone',
    background_color: '#09090b',
    theme_color: '#84cc16',
    orientation: 'portrait-primary',
    categories: ['education', 'shopping', 'productivity', 'utilities'],
    lang: 'id-ID',
    dir: 'ltr',
    icons: [
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icon-192-maskable.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icon-512-maskable.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
    screenshots: [
      {
        src: '/screenshots/home-mobile.png',
        sizes: '390x844',
        type: 'image/png',
        form_factor: 'narrow',
        label: 'Beranda KulPik di perangkat mobile',
      },
      {
        src: '/screenshots/search-wide.png',
        sizes: '1440x900',
        type: 'image/png',
        form_factor: 'wide',
        label: 'Halaman pencarian dan rekomendasi laptop KulPik',
      },
    ],
    shortcuts: [
      {
        name: 'Cari Laptop',
        short_name: 'Cari',
        description: 'Cari laptop berdasarkan budget, brand, dan spesifikasi.',
        url: '/search',
        icons: [
          {
            src: '/shortcut-search.png',
            sizes: '96x96',
            type: 'image/png',
          },
        ],
      },
      {
        name: 'Rekomendasi Jurusan',
        short_name: 'Jurusan',
        description: 'Temukan laptop yang cocok untuk jurusan kuliah kamu.',
        url: '/jurusan',
        icons: [
          {
            src: '/shortcut-jurusan.png',
            sizes: '96x96',
            type: 'image/png',
          },
        ],
      },
      {
        name: 'Tanya AI KulPik',
        short_name: 'AI',
        description: 'Tanya rekomendasi laptop dengan bahasa sehari-hari.',
        url: '/ai',
        icons: [
          {
            src: '/shortcut-ai.png',
            sizes: '96x96',
            type: 'image/png',
          },
        ],
      },
    ],
  };
}
