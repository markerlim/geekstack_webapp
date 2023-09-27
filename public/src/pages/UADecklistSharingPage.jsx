import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import BottomNav from "../components/BottomNav"
import { Box, Button } from "@mui/material"
import { useState } from "react";
import UANavBar from "../components/UANavBar";
import UADecklistCardButton from "../components/UADecklistCardButton";
import UADeckSearchBar from "../components/UADecklistChipBar";

const UADecklistSharingPage = () => {
  const [filters, setFilters] = useState([]);
  const [dateFilter, setDateFilter] = useState([null, null]);

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

  const animecode = ['cgh', 'jjk', 'htr', 'ims', 'kmy', 'toa', 'tsk', 'btr', 'mha', 'gnt','blc', 'blk']

  const setFilter = (filter) => {
    setFilters([filter]);
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
              <UADeckSearchBar filters={filters} onFiltersChange={handleFiltersChange} dateFilter={dateFilter} onDateChange={handleDateChange} />
              <Box>
                <Box sx={{ display: 'flex', flexDirection: 'row',justifyContent:'center',flexWrap:'wrap'}}>
                  {animecode.map(code => (
                    <Button key={code} onClick={() => setFilter(code)} sx={{ color: '#c8a2c8', fontSize:{xs:'10px',sm:'16px'} }}>{code.toUpperCase()}</Button>
                  ))}
                </Box>
              </Box>
              <Box sx={{ display: "flex", flexDirection: "row", paddingBottom: "150px", marginTop: "10px", justifyContent: "center" }}>
                <UADecklistCardButton filters={filters} dateFilter={dateFilter} onSelectedCardClick={handleSelectedCardClick} />
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
