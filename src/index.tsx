import React from 'react';
import { Keyboard } from '@capacitor/keyboard';
import ReactDOM from 'react-dom/client';
import './index.css';
import './theme.css';
import './mobile.css';
import App from './App';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
// Ativa ajuste automático do scroll ao abrir teclado (apenas mobile)
// Só executa Keyboard.setScroll se estiver em ambiente Capacitor (mobile)
if (typeof navigator !== 'undefined' && navigator.userAgent.includes('Capacitor')) {
  Keyboard.setScroll({ isDisabled: false });
}

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
