import React, { useState } from "react";
import { Box, Stack } from "@mui/material"
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import BottomNav from "../components/BottomNav"
import AcardHXH from "../components/AcardHXH";

const AcardHXHpage = () => {
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
                <AcardHXH searchQuery={searchQuery} setSearchQuery={setSearchQuery}/>
              </Box>
            </Stack>
            <Box flex={2} sx={{ display: { xs: "block", sm: "block", md: "none" } }}><BottomNav /></Box>
          </Box>
        </Box>
      </div>
    );
}

export default AcardHXHpage