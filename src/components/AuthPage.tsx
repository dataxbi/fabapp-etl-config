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
    ? fabricAuthEnabled ? 'Opening Fabric...' : 'Signing in...'
    : 'Sign in with Microsoft';

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <img src={dataxbiLogo} alt="dataXbi" className="h-10 w-auto mx-auto mb-6" />
          <h1 className="text-2xl font-bold text-[#333333] mb-2">ETL Config Studio</h1>
          <p className="text-sm text-[#666666]">Sign in to manage your ETL ingestion configurations.</p>
        </div>

        <div
          className="bg-white border border-[#e0e0e0] rounded-lg p-8"
          style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}
        >
          <button
            type="button"
            onClick={handleSignIn}
            disabled={isLoading}
            className="flex w-full items-center justify-center gap-2 rounded bg-[#0066cc] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#004d99] disabled:cursor-not-allowed disabled:opacity-60"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 21 21">
              <rect x="1" y="1" width="9" height="9" fill="#f25022" />
              <rect x="11" y="1" width="9" height="9" fill="#7fba00" />
              <rect x="1" y="11" width="9" height="9" fill="#00a4ef" />
              <rect x="11" y="11" width="9" height="9" fill="#ffb900" />
            </svg>
            {buttonLabel}
          </button>

          {error && (
            <p className="mt-4 text-sm text-center text-[#dc3545]">{error}</p>
          )}
        </div>
      </div>
    </div>
  );
}
