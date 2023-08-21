import { Build, Style } from "@mui/icons-material";
import { Box, Button } from "@mui/material";
import React from "react";
import { Link } from "react-router-dom";

const OPTCGNavBar = () => {
    return (
        <Box sx={{ display: "flex", flexDirection: "row", gap: "10px", paddingTop: "10px", paddingBottom: "10px",justifyContent:"center",bgcolor:'#121212' }}>
            <Button component={Link} to="/optcgbuilder" sx={{ width: "120px", color: "#c8a2c8", bgcolor: "#171614",fontSize:"13px" }}>
                <Build sx={{fontSize:"13px"}} /><div style={{ width: "10px" }} />Build
            </Button>
            <Button component={Link} to="/onepiece" sx={{ width: "120px", color: "#c8a2c8", bgcolor: "#171614",fontSize:"13px" }}>
                <Style sx={{fontSize:"13px"}}/><div style={{ width: "10px" }} />Cards
            </Button>
        </Box>
    )
}

export default OPTCGNavBar