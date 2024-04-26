import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { StateProvider } from 'app/providers/state-provider';
import { ViewportProvider } from 'app/providers/viewport-context';
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';
import './styles/styles.scss';
import './i18n/i18n';
import { router } from './router';

window.Pusher = Pusher;

window.Echo = new Echo({
  broadcaster: 'reverb',
  key: import.meta.env.VITE_REVERB_APP_KEY,
  wsHost: import.meta.env.VITE_REVERB_HOST,
  wsPort: import.meta.env.VITE_REVERB_PORT,
  wssPort: import.meta.env.VITE_REVERB_PORT,
  forceTLS: (import.meta.env.VITE_REVERB_SCHEME ?? 'https') === 'https',
  enabledTransports: [import.meta.env.VITE_REVERB_SCHEME === 'http' && 'ws', import.meta.env.VITE_REVERB_SCHEME === 'https' && 'wss'],
});

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(
  <React.StrictMode>
    <HelmetProvider>
      <StateProvider>
        <ViewportProvider>
          <RouterProvider router={router} />
        </ViewportProvider>
      </StateProvider>
    </HelmetProvider>
  </React.StrictMode>
);
