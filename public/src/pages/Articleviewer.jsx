import React, { useEffect } from "react";
import { Box, ButtonBase } from "@mui/material"
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import BottomNav from "../components/BottomNav"
import Article01 from "../components/Post/Article01";
import { Helmet } from "react-helmet";
import { useNavigate } from "react-router-dom";

const Articleviewer = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const link = document.createElement("link");
        link.rel = "webmanifest";
        link.href = `${process.env.PUBLIC_URL}/manifest.json`; // Equivalent to %PUBLIC_URL%
        document.head.appendChild(link);

        return () => {
            document.head.removeChild(link);
        };
    }, []);

    const handleButtonClick = () => {
        navigate('/Article01');// navigate to the /article01 route
    };

    return (
        <div>
            <Helmet>
                <meta name="apple-mobile-web-app-capable" content="yes" />
            </Helmet>
            <Box color={"#f2f3f8"}>
                <Navbar />
                <Box height={"100%"}>
                    <Box sx={{ display: { xs: "none", sm: "none", md: "block" } }}><Sidebar /></Box>
                    <Box sx={{ marginLeft: { xs: "0px", sm: "0px", md: "100px" }, paddingLeft: "18px", paddingRight: "18px", overflowY: "auto", height: "100vh", justifyContent: "center" }}>
                        <ButtonBase
                            onClick={handleButtonClick}  // handle button click to navigate to a new route
                            sx={{
                                alignItems: "center",
                                backgroundColor: "#240056",
                                padding: "20px",
                                gap: "10px",
                                overflow: "hidden",
                                height: { xs: 188, sm: 200 }
                            }}>
                            <img
                                src="/UD/JJK-1-063_ALT.png"
                                alt="sukunafinger"
                                style={{ width: "130px", height: "auto" }}
                            />
                            <Box sx=
                                {{ textAlign: "left", height: "inherit", paddingTop: "40px" }}>
                                <span style={{ fontFamily: "Anton", fontSize: "20px" }}>How does the Sukuna Deck work?</span>
                                <br></br>
                                Written by DPP Channel
                            </Box>
                        </ButtonBase>
                    </Box>
                </Box>
                <Box sx={{ display: { sm: "block", md: "none" } }}><BottomNav /></Box>
            </Box>
        </div>
    );
}

export default Articleviewer