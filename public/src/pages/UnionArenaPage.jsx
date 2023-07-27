import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import BottomNav from "../components/BottomNav"
import { Box } from "@mui/material"
import { useState } from "react";
import HomepageUI from "../components/HomepageUI";

const UnionArenaPage = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (searchValue) => {
    setSearchQuery(searchValue);
  };
  return (
    <div>
      <Box color={"#f2f3f8"}>
        <Navbar onSearch={handleSearch} />
        <Box>
          <Box>
            <Box sx={{ display: { xs: "none", sm: "none", md: "block" } }}>
              <Sidebar />
            </Box>
            <Box sx={{ marginLeft: { xs: "0px", sm: "0px", md: "100px" }, paddingLeft: "15px", paddingRight: "15px", display: "flex", flexDirection: "column", gap: "30px", alignItems: "center", }} overflowY={"auto"} height={"100vh"}>
              <div style={{ height: "1px" }}></div>
              <Box sx={{ display: "flex", flexDirection: "row", flexWrap: "wrap", gap: "30px", paddingBottom: "150px", justifyContent: "center" }}>
                <HomepageUI searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
              </Box>
            </Box>
          </Box>
          <Box sx={{ display: { xs: "block", sm: "block", md: "none" } }}><BottomNav /></Box>
        </Box>
      </Box>
    </div>
  );
}

export default UnionArenaPage