export const getFromLocalStorage = key => {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  };
  
export const setToLocalStorage = (key, value) => {
    localStorage.setItem(key, JSON.stringify(value));
  };
  
  