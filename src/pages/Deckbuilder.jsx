import React, { useState } from "react";
import { Box, Button, Collapse} from "@mui/material"
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import DBCardRef from "../components/DBCardRef";
import BottomNav from "../components/BottomNav"
import TestRightBar from "../components/TestRightbar";
import { CardStateProvider } from "../context/useCardState";
import DeckBuilderBar from "../components/DeckBuilderBar";
import { Hidden } from "@mui/material";


const Deckbuilder = () => {
  const [collapseDBCardRef, setCollapseDBCardRef] = useState(false);
  const toggleCollapse = () => setCollapseDBCardRef(!collapseDBCardRef);

  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (searchValue) => {
      setSearchQuery(searchValue);
  };
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <Box bgcolor={"#121212"} color={"#f2f3f8"} sx={{ display: "flex", flexDirection: "column", flex: 1, overflow: "hidden" }}>
        <Navbar onSearch={handleSearch}/>
        <Box sx={{ display: { xs: "block", sm: "block", md: "none" } }}><BottomNav /></Box>
        <CardStateProvider>
          <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "column", md: "row" }, flex: 1, height: '100%' }}>
            <Box flex={1} sx={{ display: { xs: "none", sm: "none", md: "block" } }}><Sidebar /></Box>
            <Hidden only={['md', 'lg', 'xl']}>
              <Box flex={6} bgcolor={"#784C9A"} sx={{ overflowY: 'auto', height: collapseDBCardRef ? "100%" : "50%", width: '100%' }} className="hide-scrollbar">
                <DeckBuilderBar style={{ width: "100%", top: 0, position: "sticky" }} />
                <TestRightBar />
                <br></br>
                <br></br>
              </Box>
            </Hidden>
            <Button onClick={toggleCollapse} sx={{
              display: { xs: "block", sm: "block", md: "none" }, width: "100%", backgroundColor: "#f2f3f8",
              '&:hover': {
                backgroundColor: "#240052", // Change this to the desired hover background color
                color: "#f2f3f8", // Change this to the desired hover text color if needed
              },
            }}>
              {collapseDBCardRef ? "Show Cards" : "Hide Cards"}
            </Button>
            <Box flex={6} p={2} sx={{ overflowY: 'auto', display: { xs: collapseDBCardRef ? "none" : "block", sm: collapseDBCardRef ? "none" : "block", md: "block" }, height: '100%' }} className="hide-scrollbar">
              <Collapse in={!collapseDBCardRef}>
                <DBCardRef searchQuery={searchQuery}/>
                <br></br>
                <br></br>
                <br></br>
                <br></br>
                <br></br>
                <br></br>
              </Collapse>
            </Box>
            <Hidden only={['xs', 'sm']}>
              <Box flex={6} bgcolor={"#784C9A"} sx={{ overflowY: 'auto', height: '100%' }} className="hide-scrollbar">
                <DeckBuilderBar style={{ width: "100%", top: 0, position: "sticky" }} />
                <TestRightBar />
                <br></br>
                <br></br>
                <br></br>
                <br></br>
              </Box>
            </Hidden>
            <Hidden only={['md', 'lg', 'xl']}>
              <Box>
                <br></br>
                <br></br>
                <br></br>
                <br></br>
              </Box>
            </Hidden>
          </Box>
        </CardStateProvider>
      </Box>
    </div>

  );
}

export default Deckbuilder