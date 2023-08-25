import { onAuthStateChanged } from "firebase/auth";
import { createContext, useEffect, useState, useContext } from "react";
import { auth } from "../Firebase";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setIsLoading(false);
      console.log(user);
    });
    return () => {
      unsub();
    };
  }, []);

  const useAuth = () => {
    return { currentUser };
  };

  return (
    <AuthContext.Provider value={{ currentUser, useAuth, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const { useAuth } = useContext(AuthContext);
  return useAuth();
};