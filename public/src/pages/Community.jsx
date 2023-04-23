import React from "react";
import { Box, Stack } from "@mui/material"
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Add from "../components/Add";

const Community = () =>{
    return (
      <div>
              <Box bgcolor={"#121212"} color={"#f2f3f8"}>
                  <Navbar/>
                  <Stack direction="row" spacing={2} justifyContent={"space-between"}>
                      <Sidebar/>
                      <Box flex={8} p={2}>We are currently working on this to bring to you guys the best content there is.</Box>
                  </Stack>
                  <Add/>
              </Box>
      </div>
    );
}

export default Community