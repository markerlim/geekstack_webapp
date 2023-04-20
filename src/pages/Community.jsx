import React from "react";
import { Box, Stack } from "@mui/material"
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import BottomNav from "../components/BottomNav"

const Community = () => {
    return (
        <div>
            <Box bgcolor={"#121212"} color={"#f2f3f8"}>
                <Navbar />
                <Stack direction="row" spacing={2} justifyContent={"space-between"}>
                    <Box flex={2} sx={{ display: { xs: "none", sm: "block" } }}><Sidebar /></Box>
                    <Box flex={8} p={2} height={"100vh"}>We are currently working on this to bring to you guys the best content there is.</Box>
                </Stack>
                <Box flex={2} sx={{ display: { xs: "block", sm: "none" } }}><BottomNav /></Box>
            </Box>
        </div>
    );
}

export default Community