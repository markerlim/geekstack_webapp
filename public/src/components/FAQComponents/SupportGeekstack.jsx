import { Box, Button } from "@mui/material";
import React from "react";

const FAQSupportGeekstack = () => {
    const HeaderStyle = {
        display: 'flex',
        justifyContent: 'center',
        backgroundColor: '#7C4FFF',
        borderRadius: '20px',
        overflow: 'hidden'
    };

    const DescriptionStyle = {
        display: 'flex',
        flexDirection: 'row',
        gap: '15px',
        alignItems: 'center',
        color: '#ffffff',
        fontSize: '13px'
    };

    const GuideImageStyle = {
        width: '30vw',
        borderRadius: '10px'
    };
    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '10px', textAlign: 'start', color: '#ffffff' }}>
            <Box sx={{ textAlign: "left", paddingLeft: { sm: "10vw", md: "15vw" }, paddingRight: { sm: "10vw", md: "15vw" } }}>
                <strong>Introducing Geekstack: Your Gateway to Hobbies and Beyond!</strong>
                <br />
                <br />
                Geekstack represents a passionate commitment by hobbyists to enrich the enjoyment of hobbies for everyone. Our journey began with the inspiration of UnionArena, and our vision extends to encompass a diverse array of hobbies, including other TCGs and keyboards in the near future.
                <br />
                <br />
                Currently, Geekstack stands as a dedicated platform for hobbyists, specializing in deckbuilding and offering valuable translations for the Bandai TCG Games. We take immense pride in providing this service completely free of charge. However, behind the scenes, there are several costs involved, such as time spent on translations, hosting, design, and ongoing service expansion. These expenses necessitate financial support to sustain and grow Geekstack.
                <br />
                <br />
                This is where you can make a significant impact! By contributing the price of a small coffee every month, you can become a crucial part of our mission to create the ultimate resource and platform for hobbyists around the globe.
                <br />
                <br />
                Rest assured, every penny raised through this endeavor will be reinvested back into Geekstack, covering various costs and ensuring continuous expansion. Together, we can forge a vibrant community and nurture a haven for all hobby enthusiasts.
                <br />
                <br />
                We invite you to embark on this exciting journey with us. Your support will fuel our drive to achieve greatness, as we evolve and enrich the hobby landscape together. Let's unite our passion and pave the way for an exceptional experience.
                <br />
                <br />
                Join us at Geekstack, and together, we shall reach new heights!
                <br />
                <br />
                To support Geekstack, you can donate via buymeacoffee! Click or scan the QR code to be redirected
            </Box>
            <Box sx={{ textAlign: "center" }}>
                <Button sx={{
                    padding: "30px", margin: "5px", display: "flex", flexDirection: "column",
                    '&:hover': {
                        backgroundColor: "#240052", // Change this to the desired hover background color
                        color: "#f2f3f8", // Change this to the desired hover text color if needed
                    },
                }}
                    href="https://www.buymeacoffee.com/geekstack">
                    <img style={{ width: "250px" }} src="images/donation.png" alt="donation" />
                    <br></br>
                    <span style={{ color: "#f2f3f8" }}>Click or scan to contribute!</span>
                </Button>
            </Box>
        </Box>
    )
}

export default FAQSupportGeekstack