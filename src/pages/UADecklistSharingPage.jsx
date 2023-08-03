import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import BottomNav from "../components/BottomNav"
import { Box } from "@mui/material"
import { useState } from "react";
import UANavBar from "../components/UANavBar";
import UADecklistCardButton from "../components/UADecklistCardButton";
import UADeckSearchBar from "../components/UADecklistChipBar";

const UADecklistSharingPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState([]);
  const [dateFilter, setDateFilter] = useState([null, null]);

  const handleSearch = (searchValue) => {
    setSearchQuery(searchValue);
  };

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleSelectedCardClick = (selectedCardId) => {
    if (!filters.includes(selectedCardId)) {
      setFilters([...filters, selectedCardId]);
    }
  };

  const handleDateChange = (newDateRange) => {
    setDateFilter(newDateRange);
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
              <UADeckSearchBar filters={filters} onFiltersChange={handleFiltersChange} dateFilter={dateFilter} onDateChange={handleDateChange}/>
              <Box sx={{ display: "flex", flexDirection: "row", paddingBottom: "150px",marginTop:"10px",justifyContent: "center" }}>
                <UADecklistCardButton filters={filters} dateFilter={dateFilter} onSelectedCardClick={handleSelectedCardClick}/>
              </Box>
            </Box>
          </Box>
          <Box sx={{ display: { xs: "block", sm: "block", md: "none" } }}><BottomNav /></Box>
        </Box>
      </Box>
    </div>
  );
}

export default UADecklistSharingPage
