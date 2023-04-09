import React, { useState } from "react";
import { Box, Stack, ThemeProvider, createTheme } from "@mui/material"
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import DBCardRef from "../components/DBCardRef";
import Add from "../components/Add";
import TestRightbar from "../components/TestRightbar";

const Deckbuilder = () =>{
    const [mode,setMode] = useState("light")
    const darkTheme = createTheme ({
      palette:{
        mode:mode
      }
    })
    return (
      <div>
          <ThemeProvider theme={darkTheme}>
              <Box bgcolor={"background.default"} color={"text.primary"}>
                  <Navbar/>
                  <Stack direction="row" spacing={2} justifyContent={"space-between"}>
                      <Sidebar setMode={setMode} mode={mode}/>
                      <Box flex={8} p={2}><DBCardRef/></Box>
                      <TestRightbar/>
                  </Stack>
                  <Add/>
              </Box>
          </ThemeProvider>
      </div>
    );
}

export default Deckbuilder