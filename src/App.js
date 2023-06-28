import React, { useContext, useEffect } from "react";
import "./style.scss"
import "./App.scss"
import Home from "./Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { AuthContext } from "./context/AuthContext";
import Deckbuilder from "./pages/Deckbuilder";
import Community from "./pages/Community";
import { setToLocalStorage } from "./components/LocalStorage/localStorageHelper";
import Deckviewer from "./pages/Deckviewer";
import DeckCardLoader from "./pages/DeckCardLoader";
import smoothscroll from "smoothscroll-polyfill";
import AcardCGHpage from "./pages/AcardCGHpage";
import AcardHXHpage from "./pages/AcardHXHpage";
import AcardIMSpage from "./pages/AcardIMSpage";
import AcardJJKpage from "./pages/AcardJJKpage";
import AcardKMYpage from "./pages/AcardKMYpage";
import AcardTOApage from "./pages/AcardTOApage";
import AcardTSKpage from "./pages/AcardTSKpage";
import AcardBTRpage from "./pages/AcardBTRpage";
import AcardMHApage from "./pages/AcardMHApage";
import Articleviewer from "./pages/Articleviewer";
import Geekhub from "./pages/Geekhub";
import ArticleUI from "./pages/ArticleUI";

smoothscroll.polyfill();

function App() {
  const { currentUser } = useContext(AuthContext);

  useEffect(() => {
    window.addEventListener("beforeunload", () => {
      setToLocalStorage("filteredCards", []);
    });

    return () => {
      window.removeEventListener("beforeunload", () => {
        setToLocalStorage("filteredCards", []);
      });
    };
  }, []);

  const ProtectedRoute = ({ children }) => {
    if (!currentUser) {
      return <Navigate to="/login" />;
    }

    return children;
  };

  return (
    <div id="app-container">
      <BrowserRouter>
        <Routes>
          <Route path="/" />
          <Route index element={<ProtectedRoute><Home /></ProtectedRoute>} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="disclaimer" element={<Community />} />
          <Route path="articles" element={<Articleviewer/>} />
          <Route path="geekhub" element={<Geekhub/>} />
          <Route path="deckbuilder" element={<Deckbuilder />} />
          <Route path="deckviewer" element={<Deckviewer />} />
          <Route path="/deck/:deckId" element={<DeckCardLoader />} />
          <Route path="cgh" element={<AcardCGHpage/>}/>
          <Route path="hxh" element={<AcardHXHpage/>}/>
          <Route path="ims" element={<AcardIMSpage/>}/>
          <Route path="jjk" element={<AcardJJKpage/>}/>
          <Route path="kmy" element={<AcardKMYpage/>}/>
          <Route path="toa" element={<AcardTOApage/>}/>
          <Route path="tsk" element={<AcardTSKpage/>}/>
          <Route path="btr" element={<AcardBTRpage/>}/>
          <Route path="mha" element={<AcardMHApage/>}/>
          <Route path="/article01" element={<ArticleUI/>} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
