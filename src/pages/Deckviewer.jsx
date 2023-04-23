import React from "react";
import { Box, Stack } from "@mui/material"
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import BottomNav from "../components/BottomNav"
import DeckLoader from "../components/DeckLoader";

const Deckviewer = () => {
    return (
        <div>
            <Box bgcolor={"#121212"} color={"#f2f3f8"}>
                <Navbar />
                <Stack direction="row" spacing={2} justifyContent={"space-between"}>
                    <Box flex={1} sx={{ display: {xs:"none", sm: "none", md: "block" } }}><Sidebar /></Box>
                    <Box flex={8} p={2} height={"86vh"}><DeckLoader />
                    </Box>
                </Stack>
                <Box sx={{ display: { sm: "block", md: "none"}}}><BottomNav /></Box>
            </Box>
        </div>
    );
}

export default Deckviewer