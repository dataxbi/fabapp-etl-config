import { createRoot } from 'react-dom/client';

import App from '@/App';
import { LoadingScreen } from '@/components/LoadingScreen';
import { AuthProvider } from '@/hooks/AuthContext';
import { bootstrapAuth } from '@/services/bootstrap';

import './main.css';

const root = createRoot(document.getElementById('root')!);

root.render(<LoadingScreen label="Preparing authentication..." />);

void bootstrapAuth()
  .then((authService) => {
    root.render(
      <AuthProvider authService={authService}>
        <App />
      </AuthProvider>
    );
  })
  .catch((error) => {
    console.error(error);
    root.render(<div className="flex min-h-screen items-center justify-center bg-slate-950 p-4 text-sm text-rose-300">Failed to initialize authentication.</div>);
  });
