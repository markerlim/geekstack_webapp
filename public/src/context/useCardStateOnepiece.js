import React, { createContext, useContext, useState } from 'react';

// Create the context
const CardStateContextOnepiece = createContext();

// Custom hook to use CardState
export const useCardState = () => {
  const context = useContext(CardStateContextOnepiece);
  if (!context) {
    throw new Error('useCardState must be used within a CardStateProvider');
  }
  return context;
};

// CardStateProvider component
export const CardStateProviderOnepiece = ({ children }) => {
  const [filteredCards, setFilteredCards] = useState([]);

  const value = {
    filteredCards,
    setFilteredCards,
  };

  return (
    <CardStateContextOnepiece.Provider value={value}>
      {children}
    </CardStateContextOnepiece.Provider>
  );
};
