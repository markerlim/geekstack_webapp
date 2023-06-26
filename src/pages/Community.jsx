import React, { useEffect } from "react";
import { Box, Button, Stack } from "@mui/material"
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import BottomNav from "../components/BottomNav"
import { Helmet } from "react-helmet";

const Community = () => {
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
                    <Box sx={{ display: { xs: "none", sm: "none", md: "block" } }}>
                        <Sidebar />
                    </Box>
                    <Box height={"100vh"} sx={{ display: "flex", flexDirection: "column", overflowY: "auto", marginLeft: { xs: "0px", sm: "0px", md: "100px" }, paddingTop: "25px", paddingLeft: "25px", paddingRight: "25px" }}>
                        <span style={{ color: "#DA9292" }}><strong>DISCLAIMER: Do note that the account creation is mainly a security feature for the Website itself (from Bots) and we will have no access to your credentials whatsoever.
                            Your account information is kept confidential and secure, and we take all necessary steps to prevent any unauthorized access to your account.</strong></span>
                        <br></br>
                        <span>The literal and graphical information presented on this site about union deck, including all data about the cards is copyright by Bandai Namco Entertainment.
                            <br></br>
                            This website is not produced by, endorsed by, supported by or affiliated with Bandai Namco Entertainment.</span>
                        <span>Also, do note that we will be implementing more features along the way so please do be patient.</span>
                        <br></br>
                        <br></br>
                        <br></br>
                        <span style={{ textAlign: "center" }}>If you like what we do and would like to support us,<br />please feel free to donate as the maintainence of website is not cheap :D</span>
                        <Box sx={{ textAlign: "center" }}>
                            <Button sx={{
                                padding: "30px", margin: "5px", display: "flex", flexDirection: "column",
                                '&:hover': {
                                    backgroundColor: "#240052", // Change this to the desired hover background color
                                    color: "#f2f3f8", // Change this to the desired hover text color if needed
                                },
                            }}
                                href="https://www.buymeacoffee.com/uniondeck">
                                <img style={{ width: "250px" }} src="images/donation.png" alt="donation" />
                                <br></br>
                                <span style={{ color: "#f2f3f8" }}>Click or scan to contribute!</span>
                            </Button>
                        </Box>
                        <br></br>
                        <br></br>
                        <br></br>
                        <br></br>
                        <br></br>
                        <br></br>
                        <br></br>
                        <br></br>
                        <br></br>
                        <br></br>
                        <br></br>
                    </Box>
                </Box>
                <Box flex={2} sx={{ display: { xs: "block", sm: "block", md: "none" } }}><BottomNav /></Box>
            </Box>
        </div>
    );
}

export default Community