import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'sonner';
import { ErrorBoundary } from './components/error-boundary/error-boundary.tsx';
import { ReactQueryProvider } from '@/tools/react-query-provider';
import AppProvider from '@/contexts/app-provider';
import { TokenInterceptorProvider } from '@/contexts/token-interceptor-provider';

import '@/i18n';
import './index.css';
import App from './App.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <ReactQueryProvider>
        <AppProvider>
          <TokenInterceptorProvider />
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </AppProvider>
      </ReactQueryProvider>
    </ErrorBoundary>
    <Toaster position="top-right" richColors closeButton />
  </StrictMode>,
);
