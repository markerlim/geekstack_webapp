import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import BottomNav from "../components/BottomNav"
import { Box } from "@mui/material"
import { useState } from "react";
import UANavBar from "../components/UANavBar";
import GSearchBar from "../components/ChipSearchBar";
import UACardlist from "../components/UACardlist";

const UnionArenaPage = () => {
  const [filters, setFilters] = useState([]);

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
  };

  const clearAllFilters = () => {
    setFilters([]);
    console.log(filters);
  };
  return (
    <div>
      <Box color={"#f2f3f8"}>
        <Navbar />
        <Box>
          <Box>
            <Box sx={{ display: { xs: "none", sm: "none", md: "block" } }}>
              <Sidebar />
            </Box>
            <Box sx={{ marginLeft: { xs: "0px", sm: "0px", md: "100px" }, paddingLeft: "15px", paddingRight: "15px", display: "flex", flexDirection: "column", alignItems: "center", }} overflowY={"auto"} height={"100vh"}>
              <UANavBar />
              <GSearchBar onFiltersChange={handleFiltersChange} clearAllFilters={clearAllFilters} />
              <Box sx={{ display: "flex", flexDirection: "row", flexWrap: "wrap", gap: "30px",paddingTop:'20px', paddingBottom: "150px", justifyContent: "center" }}>
                <UACardlist filters={filters} />
                <br/>
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