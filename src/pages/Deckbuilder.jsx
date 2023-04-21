import React from "react";
import { Box, Collapse, useMediaQuery } from "@mui/material"
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import DBCardRef from "../components/DBCardRef";
import BottomNav from "../components/BottomNav"
import TestRightBar from "../components/TestRightbar";
import { CardStateProvider } from "../context/useCardState";
import DeckBuilderBar from "../components/DeckBuilderBar";
import DeckBuilderBarMobile from "../components/DeckBuilderBarMobile";
import { Hidden } from "@mui/material";


const Deckbuilder = () => {
  const isMobile = useMediaQuery(theme => theme.breakpoints.down('md'));
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <Box bgcolor={"#121212"} color={"#f2f3f8"} sx={{ display: "flex", flexDirection: "column", flex: 1, overflow: "hidden" }}>
        <Navbar />
        <Box sx={{ display: { xs: "block", sm : "block", md: "none" } }}><BottomNav /></Box>
        <CardStateProvider>
          <Box sx={{ display: "flex", flexDirection: {xs:"column", sm: "column", md: "row" }, flex: 1, height: '100%' }}>
            <Box flex={1} sx={{ display: { xs: "none", sm:"none", md: "block" } }}><Sidebar /></Box>
            <Hidden only={['md', 'lg', 'xl']}>
              <Box flex={6} bgcolor={"purple"} sx={{ overflowY: 'auto', height: '50%', width: '100%' }} className="hide-scrollbar">
                <DeckBuilderBarMobile style={{ width: "100%",marginTop:10, position: "sticky" }} />
                <TestRightBar />
                <br></br>
                <br></br>
              </Box>
            </Hidden>
            <Box flex={6} p={2} sx={{ overflowY: 'auto', height: '100%' }} className="hide-scrollbar">
              <DBCardRef />
              <br></br>
              <br></br>
              <br></br>
              <br></br>
              <br></br>
              <Hidden only={['md', 'lg', 'xl']}>
                <Box>
                  <br></br>
                  <br></br>
                  <br></br>
                  <br></br>
                </Box>
              </Hidden>
            </Box>
            <Hidden only={['xs', 'sm']}>
              <Box flex={6} bgcolor={"purple"} sx={{ overflowY: 'auto', height: '100%' }} className="hide-scrollbar">
                <DeckBuilderBar style={{ width: "100%", top: 0, position: "sticky" }} />
                <TestRightBar />
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