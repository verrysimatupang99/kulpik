'use client';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function JurusanError({ error, reset }: ErrorProps) {
  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center px-4">
      <div className="text-center">
        <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-red-500/10 flex items-center justify-center">
          <svg className="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 4.477 9.246 4 7.5 4S4.168 4.477 3 5.753v13C4.168 18.477 5.754 18 7.5 18s3.168.477 4.5 1.253m0-13C13.168 4.477 14.754 4 16.5 4c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        </div>
        <h2 className="mb-2 text-xl font-semibold text-ink">Gagal Memuat Jurusan</h2>
        <p className="mb-6 text-ink-subtle">Terjadi kesalahan saat memuat data jurusan.</p>
        <button onClick={reset} className="rounded-xl bg-accent-500 px-5 py-2.5 font-medium text-dark-900 hover:bg-accent-400 transition-colors">
          Coba Lagi
        </button>
      </div>
    </div>
  );
}