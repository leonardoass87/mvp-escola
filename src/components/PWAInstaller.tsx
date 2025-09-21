'use client';

import { useEffect } from 'react';

const PWAInstaller: React.FC = () => {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          console.log('Service Worker registrado com sucesso:', registration);
        })
        .catch((error) => {
          console.log('Falha ao registrar Service Worker:', error);
        });
    }
  }, []);

  return null;
};

export default PWAInstaller;