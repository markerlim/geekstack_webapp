import React, { useEffect } from "react";
import { Box, Button } from "@mui/material"
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
            <Box color={"#f2f3f8"}>
                <Navbar />
                <Box>
                    <Box sx={{ display: { xs: "none", sm: "none", md: "block" } }}>
                        <Sidebar />
                    </Box>
                    <Box height={"100vh"} sx={{ display: "flex", flexDirection: "column", overflowY: "auto", marginLeft: { xs: "0px", sm: "0px", md: "100px" }, paddingTop: "25px", paddingLeft: "25px", paddingRight: "25px" }}>
                        <Box sx={{ textAlign: "left", paddingLeft: { sm: "10vw", md: "15vw" }, paddingRight: { sm: "10vw", md: "15vw" } }}>
                            <strong>Introducing UnionDeck: Your Gateway to Hobbies and Beyond!</strong>
                            <br />
                            <br />
                            UnionDeck represents a passionate commitment by hobbyists to enrich the enjoyment of hobbies for everyone. Our journey began with the inspiration of UnionArena, and our vision extends to encompass a diverse array of hobbies, including other TCGs and keyboards in the near future.
                            <br />
                            <br />
                            Currently, UnionDeck stands as a dedicated platform for hobbyists, specializing in deckbuilding and offering valuable translations for the Bandai TCG Games. We take immense pride in providing this service completely free of charge. However, behind the scenes, there are several costs involved, such as time spent on translations, hosting, design, and ongoing service expansion. These expenses necessitate financial support to sustain and grow UnionDeck.
                            <br />
                            <br />
                            This is where you can make a significant impact! By contributing the price of a small coffee every month, you can become a crucial part of our mission to create the ultimate resource and platform for hobbyists around the globe.
                            <br />
                            <br />
                            Rest assured, every penny raised through this endeavor will be reinvested back into UnionDeck, covering various costs and ensuring continuous expansion. Together, we can forge a vibrant community and nurture a haven for all hobby enthusiasts.
                            <br />
                            <br />
                            We invite you to embark on this exciting journey with us. Your support will fuel our drive to achieve greatness, as we evolve and enrich the hobby landscape together. Let's unite our passion and pave the way for an exceptional experience.
                            <br />
                            <br />
                            Join us at UnionDeck, and together, we shall reach new heights!
                            <br />
                            <br />
                            To support UnionDeck, you can donate via buymeacoffee! Click or scan the QR code to be redirected
                        </Box>
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
                        <Box sx={{ paddingLeft: { sm: "10vw", md: "15vw" }, paddingRight: { sm: "10vw", md: "15vw" } }}>
                            <br></br>
                            <span>The literal and graphical information presented on this site about Union Arena,Digimon and Onepiece including all data about the cards is copyright by Bandai Namco Entertainment.
                                <br></br>
                                This website is not produced by, endorsed by, supported by or affiliated with Bandai Namco Entertainment. Please support the official card game by Bandai Namco Entertainment.</span>
                            <span>
                                <br></br>
                                Also, do note that we will be implementing more features along the way so please do be patient.</span>
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
                </Box>
                <Box flex={2} sx={{ display: { xs: "block", sm: "block", md: "none" } }}><BottomNav /></Box>
            </Box>
        </div>
    );
}

export default Community