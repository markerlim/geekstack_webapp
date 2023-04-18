import React from "react";
import { Box, Stack } from "@mui/material"
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import DBCardRef from "../components/DBCardRef";
import Add from "../components/Add";
import TestRightBar from "../components/TestRightbar";
import { CardStateProvider } from "../context/useCardState";
import DeckBuilderBar from "../components/DeckBuilderBar";

const Deckbuilder = () => {
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <Box bgcolor={"#121212"} color={"#f2f3f8"} sx={{ display: "flex", flexDirection: "column", flex: 1, overflow: "hidden" }}>
        <Navbar />
        <CardStateProvider>
          <Box sx={{ display: "flex", flexDirection: "row", flex: 1, height: '100%' }}>
            <Box flex={1}><Sidebar /></Box>
            <Box flex={6} p={2} sx={{ overflowY: 'auto', height: '100%' }} className="hide-scrollbar"><DBCardRef /></Box>
            <Box flex={6} bgcolor={"purple"} sx={{ height: '100%' }}>
              <DeckBuilderBar style={{ width: "100%" }} />
              <TestRightBar />
            </Box>
          </Box>
        </CardStateProvider>
        <Add />
      </Box>
    </div>

  );
}

export default Deckbuilder