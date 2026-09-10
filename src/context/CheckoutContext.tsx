import React, { createContext, useContext, useState, useEffect } from 'react';

// =================================================================
// TYPE DEFINITIONS
// =================================================================
export interface ShippingInfo {
  fullName: string;
  email: string;
  mobileNumber: string;
  street: string;
  barangay: string;
  city: string;
  region: string;
  zipCode: string;
  landmark: string;
  country: string;
}

interface CheckoutContextType {
  shippingInfo: ShippingInfo;
  updateShippingInfo: (info: Partial<ShippingInfo>) => void;
  checkoutStep: number;
  setCheckoutStep: (step: number) => void;
  resetCheckout: () => void;
}

const defaultShipping: ShippingInfo = {
  fullName: '',
  email: '',
  mobileNumber: '',
  street: '',
  barangay: '',
  city: '',
  region: '',
  zipCode: '',
  landmark: '',
  country: 'Philippines',
};

const CheckoutContext = createContext<CheckoutContextType | undefined>(undefined);

// =================================================================
// GLOBAL PROVIDER
// =================================================================
export const CheckoutProvider: React.FC<{ children: React.ReactNode; userId?: string | null }> = ({ children, userId }) => {
  
  // 🚀 Dynamic storage key tied to the user
  const storageKey = userId ? `cc_checkout_shipping_${userId}` : 'cc_checkout_shipping_guest';

  const [shippingInfo, setShippingInfo] = useState<ShippingInfo>(() => {
    const savedInfo = localStorage.getItem(storageKey);
    return savedInfo ? JSON.parse(savedInfo) : defaultShipping;
  });
  
  const [checkoutStep, setCheckoutStep] = useState<number>(1);

  // 🚀 Switch shipping info when user logs in or out
  useEffect(() => {
    const savedInfo = localStorage.getItem(storageKey);
    setShippingInfo(savedInfo ? JSON.parse(savedInfo) : defaultShipping);
    setCheckoutStep(1); // Reset to step 1 on user switch
  }, [storageKey]);

  // Auto-save shipping info to the user-specific key
  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(shippingInfo));
  }, [shippingInfo, storageKey]);

  const updateShippingInfo = (info: Partial<ShippingInfo>) => {
    setShippingInfo((prev) => ({ ...prev, ...info }));
  };

  const resetCheckout = () => {
    setShippingInfo(defaultShipping);
    setCheckoutStep(1);
    localStorage.removeItem(storageKey); 
  };

  return (
    <CheckoutContext.Provider 
      value={{ 
        shippingInfo, 
        updateShippingInfo, 
        checkoutStep, 
        setCheckoutStep, 
        resetCheckout 
      }}
    >
      {children}
    </CheckoutContext.Provider>
  );
};

// =================================================================
// CUSTOM HOOK
// =================================================================
export const useCheckout = () => {
  const context = useContext(CheckoutContext);
  if (context === undefined) {
    throw new Error('useCheckout must be used within a CheckoutProvider');
  }
  return context;
};
