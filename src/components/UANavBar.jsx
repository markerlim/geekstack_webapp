import { Build, Layers, Style } from "@mui/icons-material";
import { Box, Button } from "@mui/material";
import React from "react";
import { Link } from "react-router-dom";

const UANavBar = () => {
    return (
        <Box sx={{ display: "flex", flexDirection: "row", gap: "10px", paddingTop: "10px", paddingBottom: "10px",justifyContent:"center" }}>
            <Button component={Link} to="/deckbuilder" sx={{ width: "120px", color: "#10c595", bgcolor: "#2f2f2f" }}>
                <Build /><div style={{ width: "10px" }} />Build
            </Button>
            <Button component={Link} to="/unionarena" sx={{ width: "120px", color: "#10c595", bgcolor: "#2f2f2f" }}>
                <Style /><div style={{ width: "10px" }} />Cards
            </Button>
            <Button component={Link} to="/uadecklist" sx={{ width: "120px", color: "#10c595", bgcolor: "#2f2f2f" }}>
                <Layers /><div style={{ width: "10px" }} />Decklist
            </Button>
        </Box>
    )
}

export default UANavBar