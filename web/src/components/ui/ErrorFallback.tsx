"use client";

import { useRouter } from "next/navigation";
import ErrorState from "./ErrorState";

interface ErrorFallbackProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  showHomeLink?: boolean;
  showBackLink?: boolean;
}

export default function ErrorFallback({
  title = "Terjadi Kesalahan",
  message = "Silakan coba lagi nanti atau hubungi dukungan jika masalah berlanjut.",
  onRetry,
  showHomeLink = true,
  showBackLink = false,
}: ErrorFallbackProps) {
  const router = useRouter();

  const handleHome = () => {
    router.push("/");
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <div className="flex flex-col items-center justify-center px-4 py-16 text-center">
      <span className="mb-4 text-5xl" aria-hidden="true">😕</span>
      <h3 className="mb-2 text-lg font-semibold text-white">{title}</h3>
      <p className="mb-6 max-w-md text-sm text-dark-300">{message}</p>
      <div className="flex flex-wrap gap-3 justify-center">
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="rounded-xl bg-primary-600 px-6 py-2.5 text-sm font-medium text-white transition-all hover:bg-primary-700 hover:shadow-lg hover:shadow-primary-600/25"
          >
            Coba Lagi
          </button>
        )}
        {showBackLink && (
          <button
            type="button"
            onClick={handleBack}
            className="rounded-xl border border-dark-600 px-6 py-2.5 text-sm font-medium text-white transition-all hover:bg-dark-800"
          >
            Kembali
          </button>
        )}
        {showHomeLink && (
          <button
            type="button"
            onClick={handleHome}
            className="rounded-xl border border-dark-600 px-6 py-2.5 text-sm font-medium text-white transition-all hover:bg-dark-800"
          >
            Ke Beranda
          </button>
        )}
      </div>
    </div>
  );
}
