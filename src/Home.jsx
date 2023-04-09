import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import Add from "./components/Add";
import CardRef from "./components/CardRef";
import { Box, Stack, ThemeProvider, createTheme } from "@mui/material"
import { useState } from "react";

const Home = () => {
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
                    <Box flex={8} p={2}><CardRef/></Box>
                </Stack>
                <Add/>
            </Box>
        </ThemeProvider>
    </div>
  );
}

export default Home