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
                    <Box flex={2} sx={{ display: { xs: "none", sm: "none", md: "block" } }}><Sidebar /></Box>
                    <Box flex={8} p={2} height={"100vh"}>
                    <span>DISCLAIMER: Do note that the account creation is mainly a security feature for the Website itself (from Bots) and we will have no access to your credentials whatsoever. 
                        Your account information is kept confidential and secure, and we take all necessary steps to prevent any unauthorized access to your account.</span>
                    </Box>
                </Stack>
                <Box flex={2} sx={{ display: { xs: "block", sm: "block", md: "none" } }}><BottomNav /></Box>
            </Box>
        </div>
    );
}

export default Community