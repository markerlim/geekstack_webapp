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
import AcardGNTpage from "./pages/AcardGNTpage";
import Articleviewer from "./pages/Articleviewer";
import DigimonPage from "./pages/DigimonPage";
import ProfilePage from "./pages/ProfilePage.jsx";
import Geekhub from "./pages/Geekhub";
import ArticleUI from "./pages/ArticleUI";
import TestPage from "./pages/TestPage";
import DTCGBTpage from "./pages/DTCGBTpage";
import UnionArenaPage from "./pages/UnionArenaPage";
import UADecklistSharingPage from "./pages/UADecklistSharingPage";
import AccountDetails from "./pages/AccountDetailsPage";
import { Box, styled } from "@mui/material";
import OnepiecePage from "./pages/OnepiecePage";
import OPTCGBTpage from "./pages/OPTCGBTpage";
import DTCGDeckbuilder from "./pages/DTCGDeckbuilder";
import OPTCGDeckbuilder from "./pages/OPTCGDeckbuilder";

smoothscroll.polyfill();

function App() {
  const { currentUser, isLoading } = useContext(AuthContext);

  useEffect(() => {
    window.addEventListener("beforeunload", () => {
      setToLocalStorage("filteredCards", []);
    });

    return () => {
      window.removeEventListener("beforeunload", () => {
        setToLocalStorage("filteredCards", []);
      });
    };
  }, [currentUser]);

  // If loading, render a loading component or placeholder
  if (isLoading) {
    return <div style={{display:'flex',justifyContent:'center',alignItems:'center',height:'100vh',width:'100%'}}><Box sx={{width:{xs:'20%',sm:'20%',md:'100px'}}}><img width="100%" src="/icons/geekstackicon.svg" alt='loading'/></Box></div>;
  }

  const ProtectedRoute = ({ children }) => {
    if (!currentUser) {
      return <Navigate to="/login" />;
    }

    return children;
  };

  const GlobalContentStyle = styled(Box)({
    paddingTop: '64px', // or the height of your AppBar
  });

  return (
    <div id="app-container">
      <GlobalContentStyle>
        <BrowserRouter>
          <Routes>
            <Route path="/" />
            <Route index element={<ProtectedRoute><Home /></ProtectedRoute>} />
            <Route path="account" element={<AccountDetails />} />
            <Route path="/profile/:uid" element={<ProfilePage />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="credits" element={<Community />} />
            <Route path="articles" element={<Articleviewer />} />
            <Route path="geekhub" element={<Geekhub />} />
            <Route path="deckbuilder" element={<Deckbuilder />} />
            <Route path="deckviewer" element={<Deckviewer />} />
            <Route path="test" element={<TestPage />} />
            <Route path="/deck/:deckId" element={<DeckCardLoader />} />
            <Route path="/unionarena/cgh" element={<AcardCGHpage />} />
            <Route path="/unionarena/hxh" element={<AcardHXHpage />} />
            <Route path="/unionarena/ims" element={<AcardIMSpage />} />
            <Route path="/unionarena/jjk" element={<AcardJJKpage />} />
            <Route path="/unionarena/kmy" element={<AcardKMYpage />} />
            <Route path="/unionarena/toa" element={<AcardTOApage />} />
            <Route path="/unionarena/tsk" element={<AcardTSKpage />} />
            <Route path="/unionarena/btr" element={<AcardBTRpage />} />
            <Route path="/unionarena/mha" element={<AcardMHApage />} />
            <Route path="/unionarena/gnt" element={<AcardGNTpage />} />
            <Route path="unionarena" element={<UnionArenaPage />} />
            <Route path="uadecklist" element={<UADecklistSharingPage />} />
            <Route path="digimon" element={<DigimonPage />} />
            <Route path="/digimon/:booster" element={<DTCGBTpage />} />
            <Route path="dtcgbuilder" element={<DTCGDeckbuilder />} />
            <Route path="onepiece" element={<OnepiecePage />} />
            <Route path="optcgbuilder" element={<OPTCGDeckbuilder />} />
            <Route path="/onepiece/:booster" element={<OPTCGBTpage />} />
            <Route path="/article01" element={<ArticleUI />} />
          </Routes>
        </BrowserRouter>
      </GlobalContentStyle>
    </div>
  );
}

export default App;
