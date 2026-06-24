import { useState } from 'react';

import { useAuth } from '@/hooks/AuthContext';
import dataxbiLogo from '@/assets/dataxbi-logo.svg';

export function AuthPage() {
  const { signIn, fabricAuthEnabled } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = async () => {
    setError(null);
    setIsLoading(true);

    try {
      await signIn();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to sign in.');
    } finally {
      setIsLoading(false);
    }
  };

  const buttonLabel = isLoading
    ? fabricAuthEnabled
      ? 'Opening Fabric...'
      : 'Signing in...'
    : 'Sign in with Microsoft';

  return (
    <div className="relative min-h-screen overflow-hidden bg-transparent px-4 py-8 sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.16),transparent_36%),radial-gradient(circle_at_bottom_right,rgba(59,130,246,0.14),transparent_36%)]" />

      <div className="relative mx-auto flex min-h-[calc(100vh-4rem)] max-w-6xl flex-col justify-center">
        <div className="grid gap-8 rounded-[32px] border border-white/10 bg-slate-950/70 p-8 shadow-[0_30px_80px_rgba(2,6,23,0.45)] backdrop-blur-xl lg:grid-cols-[1.1fr_0.9fr] lg:p-12">
          <div className="flex flex-col justify-center">
            <div className="mb-6 inline-flex w-fit items-center rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-sm font-medium text-cyan-200">
              Fabric data operations
            </div>
            <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">
              Manage your ETL configuration from one secure app.
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-8 text-slate-300">
              Design, monitor and govern ingestion pipelines with a modern interface built for data teams and Fabric workflows.
            </p>
            <div className="mt-8 flex items-center gap-3">
              <img src={dataxbiLogo} alt="dataXbi" className="h-10 w-auto" />
              <div className="h-8 w-px bg-slate-700" />
              <span className="text-sm font-medium uppercase tracking-[0.3em] text-slate-400">
                Fabric App
              </span>
            </div>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-white/10 p-6 shadow-inner shadow-slate-950/20">
            <div className="mb-6 text-center">
              <h2 className="text-2xl font-semibold text-white">Welcome back</h2>
              <p className="mt-2 text-sm text-slate-400">
                Sign in to access your ETL configuration workspace.
              </p>
            </div>

            <button
              type="button"
              onClick={handleSignIn}
              disabled={isLoading}
              className="flex w-full items-center justify-center rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-cyan-500/20 transition-all hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 21 21"
                className="mr-2"
              >
                <rect x="1" y="1" width="9" height="9" fill="#f25022" />
                <rect x="11" y="1" width="9" height="9" fill="#7fba00" />
                <rect x="1" y="11" width="9" height="9" fill="#00a4ef" />
                <rect x="11" y="11" width="9" height="9" fill="#ffb900" />
              </svg>
              {buttonLabel}
            </button>

            {error && (
              <p className="mt-4 text-center text-sm text-rose-300">{error}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
