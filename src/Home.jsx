import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import CardRef from "./components/CardRef";
import BottomNav from "./components/BottomNav"
import { Box, Hidden, Stack } from "@mui/material"
import { useState } from "react";
import HomepageUI from "./components/HomepageUI";

const Home = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (searchValue) => {
    setSearchQuery(searchValue);
  };
  return (
    <div>
      <Box bgcolor={"#121212"} color={"#f2f3f8"}>
        <Navbar onSearch={handleSearch} />
        <Box>
          <Stack direction="row" spacing={2} justifyContent={"space-between"}>
            <Box flex={2} sx={{ display: { xs: "none", sm: "none", md: "block" } }}><Sidebar /></Box>
            <Box flex={17} p={2}>
              <HomepageUI searchQuery={searchQuery} />
            </Box>
          </Stack>
          <Box flex={2} sx={{ display: { xs: "block", sm: "block", md: "none" } }}><BottomNav /></Box>
        </Box>
      </Box>
    </div>
  );
}

export default Home