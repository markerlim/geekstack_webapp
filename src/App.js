import React, { useContext } from "react";
import "./style.scss"
import Home from "./Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import{BrowserRouter, Routes, Route, Navigate} from "react-router-dom"
import { AuthContext } from "./context/AuthContext";
import Deckbuilder from "./pages/Deckbuilder";
import Community from "./pages/Community";

function App() {
  const{currentUser} = useContext(AuthContext)
  
  const ProtectedRoute=({children}) => {
    if(!currentUser){
      return <Navigate to="/login"/>
    }

    return children
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"/>
        <Route index element={<ProtectedRoute><Home/></ProtectedRoute>}/>
        <Route path="login" element={<Login/>}/>
        <Route path="register" element={<Register/>}/>
        <Route path="community" element={<Community/>}/>
        <Route path="deckbuilder" element={<Deckbuilder/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
