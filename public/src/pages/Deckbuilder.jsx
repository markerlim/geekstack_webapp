import React, { useEffect, useState } from "react";
import { Box, Button, Drawer, styled } from "@mui/material"
import Sidebar from "../components/Sidebar";
import DBCardRef from "../components/DBCardRef";
import BottomNav from "../components/BottomNav"
import TestRightBar from "../components/TestRightbar";
import { CardStateProvider } from "../context/useCardState";
import DeckBuilderBar from "../components/DeckBuilderBar";
import { Hidden } from "@mui/material";
import { Helmet } from "react-helmet";
import UANavBar from "../components/UANavBar";
import NavbarPrompt from "../components/NavbarPromptLogin";
import GSearchBar from "../components/ChipSearchBar";

const Deckbuilder = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [hideDeckbar, setHideDeckbar] = useState(true);
  const toggleDrawer = () => {
    if (isDrawerOpen) {
      // The drawer is currently open and will be closed
      // Save the state to sessionStorage
      const stateToSave = JSON.stringify({ filters });
      sessionStorage.setItem('drawerState', stateToSave);
    } else {
      // The drawer is currently closed and will be opened
      // Restore the state from sessionStorage
      const savedState = sessionStorage.getItem('drawerState');
      if (savedState) {
        const parsedState = JSON.parse(savedState);
        setIsButtonClicked(false);
        setFilters(parsedState.filters);
      }
    }

    // Toggle the drawer open/closed state
    setIsDrawerOpen(!isDrawerOpen);
  };
  const [changeClick, setChangeClick] = useState(false);
  const [filters, setFilters] = useState([]);
  const [isButtonClicked, setIsButtonClicked] = useState(false);
  function isIOS() {
    return /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.userAgent.includes("Mac") && "ontouchend" in document);
  }
  const ResponsiveBox = styled(Box)(({ theme }) => ({
    height: '130px', // default height for other screen sizes
    [theme.breakpoints.down('403')]: {
      height: '165px',
    },
  }));

  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "webmanifest";
    link.href = `${process.env.PUBLIC_URL}/manifest.json`; // Equivalent to %PUBLIC_URL%
    document.head.appendChild(link);

    return () => {
      document.head.removeChild(link);
    };
  }, []);
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <Helmet>
        <meta name="apple-mobile-web-app-capable" content="yes" />
      </Helmet>
      <Box bgcolor={"#121212"} color={"#f2f3f8"} sx={{ display: "flex", flexDirection: "column", flex: 1, overflow: "hidden" }}>
        <NavbarPrompt />
        <Box sx={{ display: { xs: "flex", sm: "flex", md: "none" }, flexDirection: "column" }}>
          <BottomNav />
        </Box>
        <CardStateProvider>
          <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "column", md: "row" }, flex: 1, height: '100%', overflow: 'hidden' }}>
            <Box sx={{ display: { xs: "none", sm: "none", md: "block" } }}>
              <Sidebar />
            </Box>
            <Hidden only={['md', 'lg', 'xl']}>
              <Box bgcolor={"#202023"} sx={{ overflowY: 'auto', overflowX: "hidden", height: '100%', width: '100%', }} className="hide-scrollbar">
                <DeckBuilderBar changeClick={changeClick} setChangeClick={setChangeClick} setHideDeckbar={setHideDeckbar} style={{ width: "100%", top: '64px', position: "fixed" }} />
                {hideDeckbar ? <ResponsiveBox/> : <Box sx={{height:'41px'}}></Box>}
                <TestRightBar setChangeClick={setChangeClick} />
                <div style={{ height: "120px" }}></div>
              </Box>
            </Hidden>
            <Hidden mdUp> {/* This will hide the content for screens md (medium) and up */}
              <Button onClick={toggleDrawer} sx={{
                display: { xs: "block", sm: "block", md: "none" }, width: "100%", backgroundColor: "#171614", color: "#c8a2c8", fontWeight: "900", zIndex: 80, position: "fixed", bottom: isIOS() ? "80px" : "70px", borderRadius: '0',
                '&:hover': {
                  backgroundColor: "#171614", // Change this to the desired hover background color
                  color: "#c8a2c8", // Change this to the desired hover text color if needed
                },
              }}>
                ↑ SHOW
              </Button>
              <Drawer
                anchor="bottom"
                open={isDrawerOpen}
                onClose={toggleDrawer}
                PaperProps={{
                  style: {
                    backgroundColor: '#121212', // Match with Box background
                    borderRadius: '20px 20px 0px 0px'
                  }
                }}>
                <Box sx={{
                  width: '100%',
                  maxHeight: '70vh',
                  minHeight: '500px',
                  bgcolor: '#121212',
                  borderRadius: '20px 20px 0px 0px',
                  overflowY: 'auto' // This ensures content is scrollable if it exceeds 70vh
                }}>
                  <Box sx={{
                    paddingRight: '30px',
                    paddingLeft: '30px',
                  }}>
                    <DBCardRef filters={filters} isButtonClicked={isButtonClicked} setIsButtonClicked={setIsButtonClicked} setChangeClick={setChangeClick} />
                    <br></br>
                    <br></br>
                    <br></br>
                    <br></br>
                    <br></br>
                    <br></br>
                  </Box>
                </Box>
              </Drawer>
            </Hidden>
            <Hidden smDown> {/* This will hide the content for screens sm (small) and down */}
              <Box flex={6} p={1} sx={{
                overflowY: 'auto',
                display: 'block',
                height: '100%',
                marginLeft: "100px"
              }}>
                <UANavBar />
                <DBCardRef filters={filters} isButtonClicked={isButtonClicked} setIsButtonClicked={setIsButtonClicked} setChangeClick={setChangeClick} />
                <br></br>
                <br></br>
                <br></br>
                <br></br>
                <br></br>
                <br></br>
              </Box>
            </Hidden>
            <Hidden only={['xs', 'sm']}>
              <Box flex={6} bgcolor={"#262626"} sx={{ overflowY: 'auto', overflowX: 'hidden', height: '100%' }} className="hide-scrollbar">
                <DeckBuilderBar changeClick={changeClick} setChangeClick={setChangeClick} setHideDeckbar={setHideDeckbar} style={{ width: "100%", top: 0, position: "sticky" }} />
                <TestRightBar setChangeClick={setChangeClick} />
                <br></br>
                <br></br>
                <br></br>
                <br></br>
              </Box>
            </Hidden>
            <Hidden only={['md', 'lg', 'xl']}>
              <Box>
                <br></br>
                <br></br>
                <br></br>
                <br></br>
              </Box>
            </Hidden>
          </Box>
        </CardStateProvider>
      </Box>
    </div>

  );
}

export default Deckbuilder