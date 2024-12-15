// src/context/CurrencyContext.jsx
import React, { createContext, useState, useContext } from 'react';

// CurrencyContext yaratish
const CurrencyContext = createContext();

// Context provayder yaratish
export const CurrencyProvider = ({ children }) => {
  const [currency, setCurrency] = useState('USD'); // default qiymat

  const changeCurrency = (newCurrency) => {
    setCurrency(newCurrency);
  };

  return (
    <CurrencyContext.Provider value={{ currency, changeCurrency }}>
      {children}
    </CurrencyContext.Provider>
  );
};

// useCurrency xookini eksport qilish
export const useCurrency = () => useContext(CurrencyContext);
