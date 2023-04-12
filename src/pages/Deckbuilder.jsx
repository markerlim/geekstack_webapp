import React, { useState } from "react";
import { Box, Stack, ThemeProvider, createTheme } from "@mui/material"
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import DBCardRef from "../components/DBCardRef";
import Add from "../components/Add";
import RightBar from "../components/Rightbar";
import TestRightBar from "../components/TestRightbar";
import { CardStateProvider } from "../context/useCardState";

const Deckbuilder = () => {
  const [mode, setMode] = useState("light")
  const darkTheme = createTheme({
    palette: {
      mode: mode
    }
  })
  return (
    <div>
      <ThemeProvider theme={darkTheme}>
        <Box bgcolor={"background.default"} color={"text.primary"}>
          <Navbar />
          <CardStateProvider>
            <Stack direction="row" spacing={2} justifyContent={"space-between"}>
              <Sidebar setMode={setMode} mode={mode} />
              <Box flex={8} p={2}><DBCardRef /></Box>
              <Box flex={8} p={2} bgcolor={"purple"}><TestRightBar /></Box>
            </Stack>
          </CardStateProvider>
          <Add />
        </Box>
      </ThemeProvider>
    </div>
  );
}

export default Deckbuilder