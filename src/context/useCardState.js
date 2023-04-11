import { createContext, useContext, useEffect, useState } from 'react';
import { getFromLocalStorage } from '../components/LocalStorage/localStorageHelper';

const CardStateContext = createContext();

export const CardStateProvider = ({ children }) => {
  const [filteredCards, setFilteredCards] = useState([]);
  const [countArray, setCountArray] = useState([]);

  useEffect(() => {
    const localDocuments = getFromLocalStorage("documents");
    if (localDocuments) {
      setCountArray(new Array(localDocuments.length).fill(0));
    }
  }, []);

  return (
    <CardStateContext.Provider value={{ filteredCards, setFilteredCards, countArray, setCountArray }}>
      {children}
    </CardStateContext.Provider>
  );
};

export const useCardState = () => {
  const context = useContext(CardStateContext);
  if (context === undefined) {
    throw new Error('useCardState must be used within a CardStateProvider');
  }
  return context;
};
