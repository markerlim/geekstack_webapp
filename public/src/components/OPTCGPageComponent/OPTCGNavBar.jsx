import { Build, Style } from "@mui/icons-material";
import { Box, Button } from "@mui/material";
import React from "react";
import { Link } from "react-router-dom";

const OPTCGNavBar = () => {
    return (
        <Box sx={{ display: "flex", flexDirection: "row", gap: "10px", paddingTop: "10px", paddingBottom: "10px" }}>
            <Button component={Link} to="/optcgbuilder" sx={{ width: "120px", color: "#10c595", bgcolor: "#2f2f2f" }}>
                <Build /><div style={{ width: "10px" }} />Build
            </Button>
            <Button component={Link} to="/onepiece" sx={{ width: "120px", color: "#10c595", bgcolor: "#2f2f2f" }}>
                <Style /><div style={{ width: "10px" }} />Cards
            </Button>
        </Box>
    )
}

export default OPTCGNavBar