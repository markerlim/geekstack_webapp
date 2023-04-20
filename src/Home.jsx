import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import CardRef from "./components/CardRef";
import BottomNav from "./components/BottomNav"
import { Box, Hidden, Stack, ThemeProvider, createTheme } from "@mui/material"
import { useState } from "react";

const Home = () => {
  // Add the searchQuery state here
  const [searchQuery, setSearchQuery] = useState("");

  // Add the handleSearchInputChange function here
  const handleSearchInputChange = (event) => {
    setSearchQuery(event.target.value);
  };

  return (
    <div>
        <Box bgcolor={"#121212"} color={"#f2f3f8"}>
          <Navbar handleSearchInputChange={handleSearchInputChange} />
          <Stack direction="row" spacing={2} justifyContent={"space-between"}>
            <Box flex={2} sx={{display:{xs:"none",sm:"block"}}}><Sidebar /></Box>
            <Box flex={17} p={2}><CardRef searchQuery={searchQuery} /></Box>
            <Hidden only={['sm', 'md', 'lg', 'xl']}>
                <Box>
                  <br></br>
                  <br></br>
                  <br></br>
                  <br></br>
                  <br></br>
                  <br></br>
                </Box>
              </Hidden>
          </Stack>
          <Box flex={2} sx={{display:{xs:"block",sm:"none"}}}><BottomNav/></Box>
        </Box>
    </div>
  );
}

export default Home