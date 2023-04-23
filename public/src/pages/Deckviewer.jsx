import React from "react";
import { Box, Stack} from "@mui/material"
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Add from "../components/Add";
import DeckLoader from "../components/DeckLoader";

const Deckviewer = () =>{
    return (
      <div>
              <Box bgcolor={"#121212"} color={"#f2f3f8"}>
                  <Navbar/>
                  <Stack direction="row" spacing={2} justifyContent={"space-between"}>
                      <Sidebar/>
                      <Box flex={8} p={2}><DeckLoader/></Box>
                  </Stack>
                  <Add/>
              </Box>
      </div>
    );
}

export default Deckviewer