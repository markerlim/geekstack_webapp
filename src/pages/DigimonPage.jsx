import React, { useEffect, } from "react";
import { Box,} from "@mui/material"
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import BottomNav from "../components/BottomNav";
import { Helmet } from "react-helmet";
import DTCGButtonList from "../components/DTCGBoosterButton";

const DigimonPage = () => {

    useEffect(() => {
        const link = document.createElement("link");
        link.rel = "webmanifest";
        link.href = `${process.env.PUBLIC_URL}/manifest.json`; // Equivalent to %PUBLIC_URL%
        document.head.appendChild(link);

        return () => {
            document.head.removeChild(link);
        };
    }, []);

    return (
        <div>
            <Helmet>
                <meta name="apple-mobile-web-app-capable" content="yes" />
            </Helmet>
            <Box bgcolor={"#121212"} color={"#f2f3f8"}>
                <Navbar />
                <Box>
                    <Box sx={{ display: { xs: "none", sm: "none", md: "block" } }}><Sidebar /></Box>
                    <Box sx={{ marginLeft: { xs: "0px", sm: "0px", md: "100px" }, paddingLeft: "15px", paddingRight: "15px", display: "flex", flexDirection: "column", gap: "30px", alignItems: "center", }} overflowY={"auto"} height={"90vh"}>
                        <div style={{ height: "1px" }}></div>
                        <Box sx={{display:"flex",flexDirection:"row",flexWrap:"wrap",gap:"30px",justifyContent:"center"}}>
                            <DTCGButtonList />
                        </Box>
                    </Box>
                </Box>
                <Box sx={{ display: { sm: "block", md: "none" } }}><BottomNav /></Box>
            </Box>
        </div>
    );
}

export default DigimonPage