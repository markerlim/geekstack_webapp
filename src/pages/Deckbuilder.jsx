import React, { useState } from "react";
import { Box, Stack, ThemeProvider, createTheme } from "@mui/material"
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import DBCardRef from "../components/DBCardRef";
import Add from "../components/Add";
import TestRightBar from "../components/TestRightbar";
import { CardStateProvider } from "../context/useCardState";
import DeckBuilderBar from "../components/DeckBuilderBar";

const Deckbuilder = () => {
  const [mode, setMode] = useState("light")
  const darkTheme = createTheme({
    palette: {
      mode: mode
    }
  })
  return (
    <div style={{ width: "100%", height: "100vh", overflow: "auto" }}>
      <ThemeProvider theme={darkTheme}>
        <Box bgcolor={"background.default"} color={"text.primary"}>
          <Navbar />
          <CardStateProvider>
            <Stack direction="row" spacing={2} justifyContent={"space-between"}>
              <Box flex={1}><Sidebar setMode={setMode} mode={mode} /></Box>
              <Box flex={8} p={2}><DBCardRef /></Box>
              <Box flex={8} bgcolor={"purple"}>
                <DeckBuilderBar style={{ width: "100%"}} />
                <TestRightBar/>
              </Box>
            </Stack>
          </CardStateProvider>
          <Add />
        </Box>
      </ThemeProvider>
    </div>
  );
}

export default Deckbuilder