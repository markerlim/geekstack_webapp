import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import Add from "./components/Add";
import CardRef from "./components/CardRef";
import { Box, Stack, ThemeProvider, createTheme } from "@mui/material"
import { useState } from "react";

const Home = () => {
  const [mode, setMode] = useState("light")
  // Add the searchQuery state here
  const [searchQuery, setSearchQuery] = useState("");
  const darkTheme = createTheme({
    palette: {
      mode: mode
    }
  })

  // Add the handleSearchInputChange function here
  const handleSearchInputChange = (event) => {
    setSearchQuery(event.target.value);
  };

  return (
    <div>
      <ThemeProvider theme={darkTheme}>
        <Box bgcolor={"background.default"} color={"text.primary"}>
          <Navbar handleSearchInputChange={handleSearchInputChange} />
          <Stack direction="row" spacing={2} justifyContent={"space-between"}>
            <Box flex={2} p={2}><Sidebar setMode={setMode} mode={mode} /></Box>
            <Box flex={17} p={2}><CardRef searchQuery={searchQuery} /></Box>
          </Stack>
          <Add />
        </Box>
      </ThemeProvider>
    </div>
  );
}

export default Home