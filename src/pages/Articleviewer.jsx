import React, { useEffect } from "react";
import { Box, Stack } from "@mui/material"
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import BottomNav from "../components/BottomNav"
import Article01 from "../components/Post/Article01";
import { Helmet } from "react-helmet";

const Articleviewer = () => {
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
                    <Box sx={{ marginLeft: { xs: "0px", sm: "0px", md: "100px" }, paddingLeft: "18px", paddingRight: "18px", paddingTop: "18px" }} height={"86vh"}>\
                        <Article01 />
                    </Box>
                </Box>
                <Box sx={{ display: { sm: "block", md: "none" } }}><BottomNav /></Box>
            </Box>
        </div>
    );
}

export default Articleviewer