import { Box } from "@mui/material";
import React from "react";
import OPTCGButtonList from "./OPTCGBoosterButton";



const OPTCGCardlist = () => {

    return (
    <Box sx={{ display: "flex", flexDirection: "row", flexWrap: "wrap", gap: "20px", justifyContent: "center" }}>
        <OPTCGButtonList />
    </Box>
    );
}

export default OPTCGCardlist;
