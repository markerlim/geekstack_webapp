import React, { useEffect, useRef, useState } from "react";
import { Box } from "@mui/material";
import BottomNav from "../components/BottomNav";
import { Helmet } from "react-helmet";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import PWAPrompt from 'react-ios-pwa-prompt';
import CardStackFlood from "../components/StacksPageComponent/CardStackFlood";

const StacksPage = () => {
    useEffect(() => {
        const link = document.createElement("link");
        link.rel = "webmanifest";
        link.href = `${process.env.PUBLIC_URL}/manifest.json`; // Equivalent to %PUBLIC_URL%
        document.head.appendChild(link);

        return () => {
            document.head.removeChild(link);
        };
    }, []);

    const filtertags = ['Union Arena', 'HTR', 'JJK', 'CGH', 'KMY', 'IMS', 'TOA', 'TSK', 'BLC', 'BTR', 'MHA', 'BLK', 'TKN', 'DST', 'One Piece'];
    const [selectedFiltertag, setSelectedFiltertag] = useState(null);
    const scrollContainerRef = useRef(null);

    const handleFiltertagClick = (tag) => {
        setSelectedFiltertag(tag);

        // Scroll the selected filter into view
        if (scrollContainerRef.current) {
            const selectedFilterElement = scrollContainerRef.current.querySelector(`[data-filter="${tag}"]`);

            if (selectedFilterElement) {
                const containerRect = scrollContainerRef.current.getBoundingClientRect();
                const elementRect = selectedFilterElement.getBoundingClientRect();

                const offset = elementRect.left - containerRect.left - (containerRect.width - elementRect.width) / 2;
                scrollContainerRef.current.scrollLeft += offset;
            }
        }
    };

    return (
        <div>
            <Helmet>
                <meta name="apple-mobile-web-app-capable" content="yes" />
            </Helmet>
            <PWAPrompt promptOnVisit={1} timesToShow={1} copyClosePrompt="Close" permanentlyHideOnDismiss={false} />
            <Box color={"#f2f3f8"}>
                <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", }} overflowY={"auto"} height={"95vh"}>
                    <Box sx={{ height: '34px', marginTop: '-54px', display: 'flex', justifyContent: 'center' }}>
                        <img style={{ width: "auto", height: "30px" }} alt="uniondeck" src="/icons/geekstackicon.svg" />
                    </Box>
                    <Box
                        ref={scrollContainerRef}
                        sx={{
                            display: 'flex',
                            overflowX: 'auto', // Enable horizontal scrolling
                            gap: '10px',
                            justifyContent: 'left',
                            paddingLeft: '10px',
                            paddingRight: '10px',
                            marginBottom: '-10px',
                            paddingTop:'5px',
                            transition: '1s linear',
                            scrollBehavior: 'smooth', 
                            width: 'calc(100vw - 20px)',
                            scrollbarWidth: 'none', // Firefox
                            msOverflowStyle: 'none', // IE
                            '&::-webkit-scrollbar': {
                                width: 0, // Hide scrollbar in Webkit browsers
                            },
                        }}
                    >
                        {filtertags.map((tag, index) => (
                            <Box
                                sx={{
                                    flex: '0 0 auto',
                                    cursor: 'pointer',
                                    fontSize: '14px',
                                    color: selectedFiltertag === tag ? '#ffffff' : '#435364',
                                    transition: '0.3s linear'
                                }}
                                key={index}
                                onClick={() => handleFiltertagClick(tag)}
                                data-filter={tag}
                            >
                                {tag}
                            </Box>
                        ))}
                    </Box>
                    <CardStackFlood selectedFiltertag={selectedFiltertag} />
                </Box>
                <Box sx={{ display: { sm: "block", md: "none" } }}><BottomNav /></Box>
            </Box>
        </div>
    );
}

export default StacksPage;
