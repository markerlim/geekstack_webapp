import React, { createContext, useContext, useState } from 'react';

// Create the context
const CardStateContextDragonballz = createContext();

// Custom hook to use CardState
export const useDBZCardState = () => {
  const context = useContext(CardStateContextDragonballz);
  if (!context) {
    throw new Error('useOPCardState must be used within a CardStateProvider');
  }
  return context;
};

// CardStateProvider component
export const CardStateProviderDragonballz = ({ children }) => {
  const [filteredCards, setFilteredCards] = useState([]);

  const value = {
    filteredCards,
    setFilteredCards,
  };

  return (
    <CardStateContextDragonballz.Provider value={value}>
      {children}
    </CardStateContextDragonballz.Provider>
  );
};
