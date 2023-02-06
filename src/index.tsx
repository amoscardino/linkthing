import React from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClientProvider } from '@tanstack/react-query';
import queryClient from 'utils/queryClient';
import App from 'App';
import { RecoilRoot } from 'recoil';

const container = document.getElementById('root');
const root = createRoot(container!);

root.render(
    <React.StrictMode>
        <RecoilRoot>
            <QueryClientProvider client={queryClient}>
                <App />
            </QueryClientProvider>
        </RecoilRoot>
    </React.StrictMode>
);
