import React, { useEffect, useState } from "react";
import { Box, Button, Drawer, } from "@mui/material"
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import BottomNav from "../components/BottomNav"
import { Hidden } from "@mui/material";
import { Helmet } from "react-helmet";
import OPTCGNavBar from "../components/OPTCGPageComponent/OPTCGNavBar";
import OPTCGBuilderBar from "../components/OPTCGPageComponent/OPTCGBuilderBar";
import OPTCGBuilderButtonList from "../components/OPTCGPageComponent/OPTCGBuilderButton";
import OPTCGRightBar from "../components/OPTCGPageComponent/OPTCGRightBar";
import { CardStateProviderOnepiece } from "../context/useCardStateOnepiece";
import GSearchBar from "../components/ChipSearchBar";

const OPTCGDeckbuilder = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
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
  const handleFiltersChange = (newFilters) => {
      setFilters(newFilters);
  };

  const clearAllFilters = () => {
    setFilters([]);
    console.log(filters);
};

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
        <Navbar />
        <Box sx={{ display: { xs: "flex", sm: "flex", md: "none" }, flexDirection: "column" }}>
          <BottomNav />
        </Box>
        <CardStateProviderOnepiece>
          <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "column", md: "row" }, flex: 1, height: '100%' }}>
            <Box sx={{ display: { xs: "none", sm: "none", md: "block" } }}>
              <Sidebar />
            </Box>
            <Hidden only={['md', 'lg', 'xl']}>
              <Box bgcolor={"#202023"} sx={{ overflowY: 'auto', overflowX: "hidden", height: '100%', width: '100%', }} className="hide-scrollbar">
                <OPTCGNavBar sx={{ backgroundColor: '#121212' }} />
                <OPTCGBuilderBar changeClick={changeClick} setChangeClick={setChangeClick} style={{ width: "100%", top: 0, position: "sticky", }} />
                <OPTCGRightBar setChangeClick={setChangeClick} />
                <div style={{ height: "120px" }}></div>
              </Box>
              <Button onClick={toggleDrawer} sx={{
                display: { xs: "block", sm: "block", md: "none" }, width: "100%", backgroundColor: "#171614", color: "#c8a2c8", fontWeight: "900", zIndex: 80, position: "absolute", bottom: isIOS() ? "80px":"70px", borderRadius: '0',
                '&:hover': {
                  backgroundColor: "#171614", // Change this to the desired hover background color
                  color: "#c8a2c8", // Change this to the desired hover text color if needed
                },
              }}>
                ↑ SHOW
              </Button>
            </Hidden>
            <Hidden mdUp> {/* This will hide the content for screens md (medium) and up */}
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
                  bgcolor: '#121212',
                  borderRadius: '20px 20px 0px 0px',
                  paddingTop:'10px',
                  paddingBottom:'30px',
                  overflowY: 'auto' // This ensures content is scrollable if it exceeds 70vh
                }}>
                  {!isButtonClicked && (
                  <Box sx={{ display: 'flex', justifyContent: 'center',paddingBottom:'10px' }}>
                    <GSearchBar onFiltersChange={handleFiltersChange} clearAllFilters={clearAllFilters}/>
                  </Box>)}
                  <OPTCGBuilderButtonList filters={filters} isButtonClicked={isButtonClicked} setIsButtonClicked={setIsButtonClicked} setChangeClick={setChangeClick} />
                </Box>
              </Drawer>
            </Hidden>
            <Hidden smDown> {/* This will hide the content for screens sm (small) and down */}
              <Box flex={6} sx={{
                overflowY: 'auto',
                display: 'block',
                height: '100%',
                marginLeft: "100px"
              }}>
                <OPTCGNavBar />
                {!isButtonClicked && (
                  <Box sx={{ display: 'flex', justifyContent: 'center',paddingBottom:'10px' }}>
                    <GSearchBar onFiltersChange={handleFiltersChange} clearAllFilters={clearAllFilters}/>
                  </Box>)}
                <OPTCGBuilderButtonList filters={filters} isButtonClicked={isButtonClicked} setIsButtonClicked={setIsButtonClicked} setChangeClick={setChangeClick}  />
                <br />
                <br />
                <br />
                <br />
                <br />
              </Box>
            </Hidden>
            <Hidden only={['xs', 'sm']}>
              <Box flex={6} bgcolor={"#262626"} sx={{ overflowY: 'auto',overflowX:'hidden', height: '100%' }} className="hide-scrollbar">
                <OPTCGBuilderBar changeClick={changeClick} setChangeClick={setChangeClick}/>
                <OPTCGRightBar setChangeClick={setChangeClick} />
                <br></br>
                <br></br>
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
        </CardStateProviderOnepiece>
      </Box>
    </div>

  );
}

export default OPTCGDeckbuilder