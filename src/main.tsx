import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';

import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { ProductProvider } from './context/ProductContext';
import { CheckoutProvider } from './context/CheckoutContext';
import { OrderProvider } from './context/OrderContext';

// Legacy window injection check (Note: React hooks can only be executed inside components)
(window as any).useAuth = useAuth;

const AuthenticatedProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  
  // Safely extract ID whether backend returns `id` or MongoDB `_id`
  const userId = user?.id ?? (user as any)?._id ?? null;

  return (
    <CartProvider userId={userId}>
      <CheckoutProvider userId={userId}>
        <OrderProvider userId={userId}>
          {children}
        </OrderProvider>
      </CheckoutProvider>
    </CartProvider>
  );
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>
      <ProductProvider>
        <AuthenticatedProviders>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </AuthenticatedProviders>
      </ProductProvider>
    </AuthProvider>
  </React.StrictMode>
);
