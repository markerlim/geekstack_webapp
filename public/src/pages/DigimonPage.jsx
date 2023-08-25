import React, { useEffect, useState, } from "react";
import { Box, } from "@mui/material"
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import BottomNav from "../components/BottomNav";
import { Helmet } from "react-helmet";
import "../style.scss";
import DTCGButtonList from "../components/DTCGBoosterButton";
import DTCGNavBar from "../components/DigimonPageComponent/DTCGNavBar";
import GSearchBar from "../components/ChipSearchBar";

const DigimonPage = () => {

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
                        <DTCGNavBar />
                        <Box sx={{display:'none'}}><GSearchBar onFiltersChange={handleFiltersChange} clearAllFilters={clearAllFilters} /></Box>
                        <Box sx={{ display: "flex", flexDirection: "row", flexWrap: "wrap", gap: "30px", paddingBottom: "150px",paddingTop:'30px', justifyContent: "center" }}>
                            <DTCGButtonList filters={filters} />
                        </Box>
                    </Box>
                </Box>
                <Box sx={{ display: { sm: "block", md: "none" } }}><BottomNav /></Box>
            </Box>
        </div>
    );
}

export default DigimonPage