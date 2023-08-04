import { Layers, Style } from "@mui/icons-material";
import { Box, Button } from "@mui/material";
import React, { useEffect } from "react";

const UANavBar = () => {
    return (
        <Box sx={{ display: "flex", flexDirection: "row", gap: "10px", paddingTop: "10px", paddingBottom: "10px" }}>
            <Button href="/unionarena" sx={{ width: "120px", color: "#10c595", bgcolor: "#2f2f2f" }}>
                <Style /><div style={{ width: "10px" }} />Cards
            </Button>
            <Button href="/uadecklist" sx={{ width: "120px", color: "#10c595", bgcolor: "#2f2f2f" }}>
                <Layers /><div style={{ width: "10px" }} />Decklist
            </Button>
        </Box>
    )
}

export default UANavBar