import React, { useEffect, useState, } from "react";
import { Box, } from "@mui/material"
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import BottomNav from "../components/BottomNav";
import { Helmet } from "react-helmet";
import "../style.scss";
import GSearchBar from "../components/ChipSearchBar";
import OPTCGNavBar from "../components/OPTCGPageComponent/OPTCGNavBar";
import OPTCGButtonList from "../components/OPTCGPageComponent/OPTCGBoosterButton";

const OnepiecePage = () => {

    const [filters, setFilters] = useState([]);

    const handleFiltersChange = (newFilters) => {
        setFilters(newFilters);
    };

    const clearAllFilters = () => {
        setFilters([]);
        console.log(filters);
    };

    return (
        <div>
            <Helmet>
                <meta name="apple-mobile-web-app-capable" content="yes" />
            </Helmet>
            <Box color={"#f2f3f8"}>
                <Navbar />
                <Box>
                    <Box sx={{ display: { xs: "none", sm: "none", md: "block" } }}><Sidebar /></Box>
                    <Box sx={{ marginLeft: { xs: "0px", sm: "0px", md: "100px" }, paddingLeft: "15px", paddingRight: "15px", display: "flex", flexDirection: "column",alignItems: "center", }} overflowY={"auto"} height={"100vh"}>
                        <OPTCGNavBar />
                        <Box sx={{display:'none'}}><GSearchBar onFiltersChange={handleFiltersChange} clearAllFilters={clearAllFilters} /></Box>
                        <Box sx={{ display: "flex", flexDirection: "row", flexWrap: "wrap", gap: "30px", paddingBottom: "150px",paddingTop:'30px', justifyContent: "center" }}>
                            <OPTCGButtonList filters={filters} />
                        </Box>
                    </Box>
                </Box>
                <Box sx={{ display: { sm: "block", md: "none" } }}><BottomNav /></Box>
            </Box>
        </div>
    );
}

export default OnepiecePage