import React, { createContext, useContext, useState } from 'react';

// Create the context
const CardStateContext = createContext();

// Custom hook to use CardState
export const useCardState = () => {
  const context = useContext(CardStateContext);
  if (!context) {
    throw new Error('useCardState must be used within a CardStateProvider');
  }
  return context;
};

// CardStateProvider component
export const CardStateProvider = ({ children }) => {
  const [filteredCards, setFilteredCards] = useState([]);
  const [countArray, setCountArray] = useState({});
  const [animeFilter,setAnimeFilter] = useState("");

  const value = {
    filteredCards,
    setFilteredCards,
    countArray,
    setCountArray,
    animeFilter,
    setAnimeFilter,
  };

  return (
    <CardStateContext.Provider value={value}>
      {children}
    </CardStateContext.Provider>
  );
};
