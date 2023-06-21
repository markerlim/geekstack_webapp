import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import BottomNav from "./components/BottomNav"
import { Box } from "@mui/material"
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
          <Box>
            <Box sx={{ display: { xs: "none", sm: "none", md: "block" } }}>
              <Sidebar />
            </Box>
            <Box sx={{marginLeft: { xs: "0px", sm: "0px", md: "100px" }, paddingLeft: "18px", paddingRight: "18px", paddingTop: "18px"}}>
              <HomepageUI searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
            </Box>
          </Box>
          <Box sx={{ display: { xs: "block", sm: "block", md: "none" } }}><BottomNav /></Box>
        </Box>
      </Box>
    </div>
  );
}

export default Home