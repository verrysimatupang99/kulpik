'use client';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function CompareError({ error, reset }: ErrorProps) {
  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center px-4">
      <div className="text-center">
        <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-red-500/10 flex items-center justify-center">
          <svg className="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </div>
        <h2 className="mb-2 text-xl font-semibold text-ink">Gagal Memuat Perbandingan</h2>
        <p className="mb-6 text-ink-subtle">Terjadi kesalahan saat membandingkan laptop.</p>
        <button onClick={reset} className="rounded-xl bg-accent-500 px-5 py-2.5 font-medium text-dark-900 hover:bg-accent-400 transition-colors">
          Coba Lagi
        </button>
      </div>
    </div>
  );
}