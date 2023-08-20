import React, { useEffect, useState } from "react";
import { Box, Button, Collapse, } from "@mui/material"
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import BottomNav from "../components/BottomNav"
import { Hidden } from "@mui/material";
import { Helmet } from "react-helmet";
import OPTCGNavBar from "../components/OPTCGPageComponent/OPTCGNavBar";
import OPTCGBuilderBar from "../components/OPTCGPageComponent/OPTCGBuilderBar";
import OPTCGCardlist from "../components/OPTCGPageComponent/OPTCGCardlist";

const OPTCGDeckbuilder = () => {
  const [collapseDBCardRef, setCollapseDBCardRef] = useState(false);
  const toggleCollapse = () => setCollapseDBCardRef(!collapseDBCardRef);
  const [filteredCards, setFilteredCards] = useState([]);
  const [countArray, setCountArray] = useState([]);

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
        <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "column", md: "row" }, flex: 1, height: '100%' }}>
          <Box sx={{ display: { xs: "none", sm: "none", md: "block" } }}>
            <Sidebar />
          </Box>
          <Hidden only={['md', 'lg', 'xl']}>
            <Box bgcolor={"#784C9A"} sx={{ overflowY: 'auto', overflowX: "hidden", height: collapseDBCardRef ? "100%" : "22%", width: '100%' }} className="hide-scrollbar">
              <OPTCGBuilderBar />
              <div style={{ height: "120px" }}></div>
            </Box>
            <Button onClick={toggleCollapse} sx={{
              display: { xs: "block", sm: "block", md: "none" }, width: "100%", backgroundColor: "#f2f3f8", fontWeight: "900", zIndex: 80, position: "absolute", bottom: "60px",
              '&:hover': {
                backgroundColor: "#240052", // Change this to the desired hover background color
                color: "#f2f3f8", // Change this to the desired hover text color if needed
              },
            }}>
              {collapseDBCardRef ? "↑ SHOW" : "↓ HIDE"}
            </Button>
          </Hidden>
          <Box flex={6} p={1} sx={{ overflowY: 'auto', display: { xs: collapseDBCardRef ? "none" : "block", sm: collapseDBCardRef ? "none" : "block", md: "block" }, height: '100%', marginLeft: { xs: "0px", sm: "0px", md: "100px" }, }}>
            <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}><OPTCGNavBar /></Box>
            <Collapse in={!collapseDBCardRef}>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '30px', justifyContent: 'center' }}>
                <OPTCGCardlist/>
              </Box>
              <br></br>
              <br></br>
              <br></br>
              <br></br>
              <br></br>
              <br></br>
            </Collapse>
          </Box>
          <Hidden only={['xs', 'sm']}>
            <Box flex={6} bgcolor={"#262626"} sx={{ overflowY: 'auto', height: '100%' }} className="hide-scrollbar">
              <OPTCGBuilderBar />
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
      </Box>
    </div>

  );
}

export default OPTCGDeckbuilder