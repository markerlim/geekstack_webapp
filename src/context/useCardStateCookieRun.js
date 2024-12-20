import React, { createContext, useContext, useState } from 'react';

// Create the context
const CardStateContextCookieRun = createContext();

// Custom hook to use CardState
export const useCRBCardState = () => {
  const context = useContext(CardStateContextCookieRun);
  if (!context) {
    throw new Error('useCRBCardState must be used within a CardStateProvider');
  }
  return context;
};

// CardStateProvider component
export const CardStateProviderCookieRun = ({ children }) => {
  const [filteredCards, setFilteredCards] = useState([]);

  const value = {
    filteredCards,
    setFilteredCards,
  };

  return (
    <CardStateContextCookieRun.Provider value={value}>
      {children}
    </CardStateContextCookieRun.Provider>
  );
};
