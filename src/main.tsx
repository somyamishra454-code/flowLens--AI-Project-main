import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RestaurantProvider } from './context/RestaurantContext';
import './index.css';
import App from './App.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RestaurantProvider>
      <App />
    </RestaurantProvider>
  </StrictMode>,
);
