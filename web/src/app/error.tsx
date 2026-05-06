'use client';

import { useEffect } from 'react';
import Link from 'next/link';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function RootError({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log error to monitoring service in production
    if (process.env.NODE_ENV === 'production') {
      // TODO: Send to Sentry or other error monitoring
      // Error logged for monitoring: error.digest
    }
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-surface-subtle px-4">
      <div className="text-center">
        <div className="mb-8">
          <div className="mx-auto mb-4 h-20 w-20 rounded-full bg-red-500/10 flex items-center justify-center">
            <svg
              className="h-10 w-10 text-red-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
        </div>

        <h1 className="mb-4 text-3xl font-bold text-ink">
          Terjadi Kesalahan
        </h1>
        <p className="mb-8 max-w-md text-ink-subtle">
          Maaf, terjadi kesalahan tak terduga. Tim kami telah diberitahu.
        </p>

        <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
          <button
            onClick={reset}
            className="rounded-xl bg-accent-500 px-6 py-3 font-medium text-dark-900 hover:bg-accent-400 transition-colors"
          >
            Coba Lagi
          </button>
          <Link
            href="/"
            className="rounded-xl border border-edge-strong px-6 py-3 font-medium text-ink hover:bg-surface-raised transition-colors"
          >
            Kembali ke Beranda
          </Link>
        </div>
      </div>
    </div>
  );
}