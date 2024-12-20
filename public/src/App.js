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
import ProfilePage from "./pages/ProfilePage.jsx";
import TestPage from "./pages/TestPage";
import UnionArenaPage from "./pages/UnionArenaPage";
import UADecklistSharingPage from "./pages/UADecklistSharingPage";
import AccountDetails from "./pages/AccountDetailsPage";
import { Box, styled } from "@mui/material";
import OnepiecePage from "./pages/OnepiecePage";
import OPTCGBTpage from "./pages/OPTCGBTpage";
import OPTCGDeckbuilder from "./pages/OPTCGDeckbuilder";
import Listofcards from "./pages/Listofcards";
import FAQPage from "./pages/FAQPage";
import AcardFormatpage from "./pages/AcardFormatpage.jsx";
import StacksPage from "./pages/StacksPage.jsx";
import DBZFWPage from "./pages/DBZFWPage.jsx";
import DBZFWBTPage from "./pages/DBZFWBTpage.jsx";
import DBZFWDeckbuilder from "./pages/DBZFWDeckbuilder.jsx";
import PTCGPage from "./pages/PTCGPage.jsx";
import PTCGBTPage from "./pages/PTCGBTpage.jsx";
import PTCGDeckbuilder from "./pages/PTCGDeckbuilder.jsx";
import Deckdiary from "./pages/DeckDiary.jsx";
import NotificationsPage from "./pages/Notifications.jsx";
import CRBTCGPage from "./pages/CRBTCGPage.jsx";
import CRBTCGBTpage from "./pages/CRBTCGBTpage.jsx";
import CRBTCGDeckbuilder from "./pages/CRBTCGDeckbuilder.jsx";

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
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', width: '100%' }}><Box sx={{ width: { xs: '20%', sm: '20%', md: '100px' } }}><img width="100%" src="/icons/geekstackicon.svg" alt='loading' /></Box></div>;
  }

  const ProtectedRoute = ({ children, path }) => {

    if (path === '/unionarena') {
      return children;
    }

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
            <Route index element={<Home />} />
            <Route path="account" element={<AccountDetails />} />
            <Route path="/profile/:uid" element={<ProfilePage />} />
            <Route path="stacks" element={<StacksPage />} />
            <Route path="/stacks/:id" element={<StacksPage />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="credits" element={<Community />} />
            <Route path="deckbuilder" element={<Deckbuilder />} />
            <Route path="deckviewer" element={<Deckviewer />} />
            <Route path="list" element={<Listofcards />} />
            <Route path="noti" element={<NotificationsPage />} />
            <Route path="faq" element={<FAQPage />} />
            <Route path="thisistestsite" element={<TestPage />} />
            <Route path="matchlog" element={<Deckdiary/>}/>
            <Route path="/deck/:deckId" element={<DeckCardLoader />} />
            <Route path="unionarena" element={<UnionArenaPage />}/>
            <Route path="unionarena/:animecode" element={<AcardFormatpage />} />
            <Route path="uadecklist" element={<UADecklistSharingPage />} />
            <Route path="dragonballz" element={<DBZFWPage />} />
            <Route path="dbzfwbuilder" element={<DBZFWDeckbuilder/>}/>
            <Route path="/dragonballz/:booster" element={<DBZFWBTPage />} />
            <Route path="onepiece" element={<OnepiecePage />} />
            <Route path="optcgbuilder" element={<OPTCGDeckbuilder />} />
            <Route path="/onepiece/:booster" element={<OPTCGBTpage />} />
            <Route path="/pokemon" element ={<PTCGPage/>}/>
            <Route path="/pokemon/:booster" element ={<PTCGBTPage/>}/>
            <Route path="ptcgbuilder" element={<PTCGDeckbuilder/>}/>
            <Route path="cookierunbraverse" element={<CRBTCGPage />} />
            <Route path="/cookierunbraverse/:booster" element={<CRBTCGBTpage />} />
            <Route path="/cookierunbuilder" element={<CRBTCGDeckbuilder />} />
            <Route path="/test" element={<TestPage />} />
          </Routes>
        </BrowserRouter>
      </GlobalContentStyle>
    </div>
  );
}

export default App;
