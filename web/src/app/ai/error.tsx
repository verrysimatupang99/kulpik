'use client';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function AIError({ error, reset }: ErrorProps) {
  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center px-4">
      <div className="text-center">
        <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-red-500/10 flex items-center justify-center">
          <svg className="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
        <h2 className="mb-2 text-xl font-semibold text-ink">AI Tidak Tersedia</h2>
        <p className="mb-6 text-ink-subtle">Terjadi kesalahan saat menghubungi AI.</p>
        <button onClick={reset} className="rounded-xl bg-accent-500 px-5 py-2.5 font-medium text-dark-900 hover:bg-accent-400 transition-colors">
          Coba Lagi
        </button>
      </div>
    </div>
  );
}