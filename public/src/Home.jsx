import React, { useEffect, useState } from "react";
import { Box, Button, ButtonBase, Collapse, IconButton, MenuItem, Select, useTheme } from "@mui/material"
import Sidebar from "./components/Sidebar";
import BottomNav from "./components/BottomNav";
import HomepageDashboard from "./components/HomepageDashboard";
import { Helmet } from "react-helmet";
import FullCalendar from "@fullcalendar/react";
import listPlugin from "@fullcalendar/list";
import { ExpandMore } from "@mui/icons-material";
import { Link } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import PWAPrompt from 'react-ios-pwa-prompt'
import NavbarHome from "./components/NavbarHome";

function handleEventClick(clickInfo) {
    if (clickInfo.event.url) { // Check if the event has a URL
        window.open(clickInfo.event.url, '_blank'); // Open the URL in a new tab
        clickInfo.jsEvent.preventDefault(); // Prevent the browser from navigating to the URL in the current tab
    }
}

function renderEventContent(eventInfo) {
    return {
        html: eventInfo.event.allDay ?
            `<div style="width: 80px; height: 30px;overflow:hidden; border-radius:10px; margin-right:10px;flex: 0 0 auto;"><img src="${eventInfo.event.extendedProps.icon}" style="width:80px;height:auto;"/></div>   ${eventInfo.event.title}` :
            `${eventInfo.event.title}`
    }
}

function CustomDot({ onClick, active }) {
    return (
        <Box
            component={'span'}
            sx={{
                display: 'inline-block',
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                background: active ? 'black' : 'white',
                margin: '5px',
                cursor: 'pointer'
            }}
            onClick={onClick}
        />
    );
}

const Home = () => {
    const launchdates = [
        {
            title: "UABT12 Bluelock",
            start: "2023-09-29",
            end: "2023-09-29",
            backgroundColor: "#bb0504",
            id: "ruipoUA",
            icon: "/icons/UAtags/Bluelockicon.jpg",
        },
        {
            title: "UABT08 Bleach",
            start: "2023-09-29",
            end: "2023-09-29",
            backgroundColor: "#bb0504",
            id: "ruipoUA",
            icon: "/icons/UAtags/Bleach1000icon.jpg",
        },
        {
            title: "ST11 STARTER DECK -Side Uta ",
            start: "2023-10-07",
            end: "2023-10-07",
            backgroundColor: "#bb0504",
            id: "ruipoOP",
            icon: "/icons/UAtags/Onepieceicon.jpg",
        },
        {
            title: "UABT13 Tekken7",
            start: "2023-10-27",
            end: "2023-10-27",
            backgroundColor: "#bb0504",
            id: "ruipoUA",
            icon: "/icons/UAtags/Tekken7icon.jpg",
        },
        {
            title: "UABT14 Dr Stone",
            start: "2023-12-22",
            end: "2023-12-22",
            backgroundColor: "#bb0504",
            id: "ruipoUA",
            icon: "/icons/UAtags/Drstoneicon.jpg",
        },
        {
            title: "Jujutsu Kaisen New Card Selection",
            start: "2023-10-27",
            end: "2023-10-27",
            backgroundColor: "#bb0504",
            id: "ruipoUA",
            icon: "/icons/UAtags/Jujutsunokaisenicon.jpg",
        },
        {
            title: "Demon Slayer New Card Selection",
            start: "2023-10-27",
            end: "2023-10-27",
            backgroundColor: "#bb0504",
            id: "ruipoUA",
            icon: "/icons/UAtags/Demonslayericon.jpg",
        },
        {
            title: "Hunter X Hunter EX01",
            start: "2023-10-27",
            end: "2023-10-27",
            backgroundColor: "#bb0504",
            id: "ruipoUA",
            icon: "/icons/UAtags/Hunterxhuntericon.jpg",
        },
        {
            title: "Code Geass EX02",
            start: "2023-11-24",
            end: "2023-11-24",
            backgroundColor: "#bb0504",
            id: "ruipoUA",
            icon: "/icons/UAtags/Codegeassicon.jpg",
        },
    ];
    const settings = {
        customPaging: function (i) {
            return (
                <CustomDot />
            );
        },
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
    };
    const [filteredEvents, setFilteredEvents] = useState(launchdates); // State to store filtered events
    const [selectedId, setSelectedId] = useState(""); // State to store selected ID
    const [open, setOpen] = useState(false);
    const [isCalendarVisible, setIsCalendarVisible] = useState(false);
    const [isUAButtonsVisible, setIsUAButtonsVisible] = useState(false);
    const [isOPTCGButtonsVisible, setIsOPTCGButtonsVisible] = useState(false);
    const theme = useTheme();

    const imageData = [
        { src: 'latestreleasebanner/bluelocknewrelease.jpg', path: '/unionarena/blk' },
        { src: 'latestreleasebanner/bleachnewrelease.jpg', path: '/unionarena/blc' },
        { src: 'latestreleasebanner/op05newrelease.jpg', path: '/onepiece/OP05' },
        { src: 'latestreleasebanner/st11newrelease.jpg', path: '/onepiece' }
    ];

    const comingsoonData = [
        { src: 'comingsoonbanner/UABT13.webp' },
        { src: 'comingsoonbanner/UABT14.webp' },
        { src: 'comingsoonbanner/UABT15.webp' },
        { src: 'comingsoonbanner/UABT16.webp' },
        { src: 'comingsoonbanner/UABT17.webp' },
        { src: 'comingsoonbanner/UABT18.webp' },
        { src: 'comingsoonbanner/UABT19.webp' },
        { src: 'comingsoonbanner/UABT20.webp' },
    ];

    const handleFilter = (event) => {
        const id = event.target.value;
        setSelectedId(id);

        if (id === "") {
            setFilteredEvents(null);
        } else {
            const filtered = launchdates.filter((evt) => evt.id === id);
            console.log("Filtered Events:", filtered);
            setFilteredEvents(filtered);
        }
    };

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
            <PWAPrompt promptOnVisit={1} timesToShow={1} copyClosePrompt="Close" permanentlyHideOnDismiss={false} />
            <Box color={"#f2f3f8"}>
                <NavbarHome />
                <Box >
                    <Box sx={{ display: { xs: "none", sm: "none", md: "block" } }}><Sidebar /></Box>
                    <Box sx={{ marginLeft: { xs: "0px", sm: "0px", md: "100px" }, display: "flex", flexDirection: "column", gap: "30px", alignItems: "center", }} overflowY={"auto"} height={"95vh"}>
                        <div style={{ height: "1px" }}></div>
                        <HomepageDashboard />
                        <Box sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: '20px', width: { xs: "calc(70vw + 60px)", sm: "calc(60vw + 60px)" } }}>
                            <Box sx={{ display: 'flex', flex: '0 0 auto', flexWrap: 'nowrap', gap: '20px', height: { xs: '77px', sm: "165px" }, overflowX: 'auto', justifyContent: 'center', alignItems: 'center', width: '100vw' }}>
                                <Button
                                    sx={{
                                        width: { xs: 'auto', sm: "180px" }, flex: '0 0 auto', height: { xs: '70px', sm: "112.5px" }, color: "#7C4FFF", bgcolor: "#26252d", padding: 0, borderRadius: "10px", overflow: 'hidden', transition: 'all 0.2s ease-in-out', '&:hover': {
                                            transform: 'scale(1.1)',
                                            transition: 'all 0.2s ease-in-out'
                                        }
                                    }}
                                    onClick={() => {
                                        setIsUAButtonsVisible(!isUAButtonsVisible);
                                        setIsOPTCGButtonsVisible(false);
                                    }}
                                >
                                    <img style={{ height: "100%" }} alt="unionarena" src="/images/HMUAButton.jpg" />
                                </Button>
                                <Button
                                    sx={{
                                        width: { xs: 'auto', sm: "180px" }, flex: '0 0 auto', height: { xs: '70px', sm: "112.5px" }, color: "#7C4FFF", bgcolor: "#26252d", padding: 0, borderRadius: "10px", overflow: 'hidden', transition: 'all 0.2s ease-in-out', '&:hover': {
                                            transform: 'scale(1.1)',
                                            transition: 'all 0.2s ease-in-out'
                                        }
                                    }}
                                    onClick={() => {
                                        setIsOPTCGButtonsVisible(!isOPTCGButtonsVisible);
                                        setIsUAButtonsVisible(false);
                                    }}
                                >
                                    <img style={{ height: "100%" }} alt="onepiece" src="/images/HMOPTCGButton.jpg" />
                                </Button>
                            </Box>
                            <Box sx={{ position: 'relative', textAlign: 'center' }}>
                                <Collapse in={isUAButtonsVisible}>
                                    <Box sx={{ width: { xs: "calc(70vw + 60px)", sm: "calc(60vw + 60px)" }, display: "flex", flexDirection: "row", gap: '20px', justifyContent: 'center', paddingBottom: "20px", borderRadius: "20px" }}>
                                        <Button sx={{ width: "100px", color: "#74CFFF", bgcolor: "#26252d", fontSize: '12px' }} component={Link} to="/unionarena">UATCG<br />Cardlist</Button>
                                        <Button sx={{ width: "100px", color: "#74CFFF", bgcolor: "#26252d", fontSize: '12px' }} component={Link} to="/uadecklist">UATCG<br />Decklist</Button>
                                        <Button sx={{ width: "100px", color: "#74CFFF", bgcolor: "#26252d", fontSize: '12px' }} component={Link} to="/deckbuilder">UATCG<br />Builder</Button>
                                    </Box>
                                </Collapse>
                                <Collapse in={isOPTCGButtonsVisible}>
                                    <Box sx={{ width: { xs: "calc(70vw + 60px)", sm: "calc(60vw + 60px)" }, display: "flex", flexDirection: "row", gap: '20px', justifyContent: 'center', paddingBottom: "20px", borderRadius: "20px" }}>
                                        <Button sx={{ width: "100px", color: "#74CFFF", bgcolor: "#26252d", fontSize: '12px' }} component={Link} to="/onepiece">OPTCG<br />Cardlist</Button>
                                        <Button sx={{ width: "100px", color: "#74CFFF", bgcolor: "#26252d", fontSize: '12px' }} disabled component={Link} to="/">OPTCG<br />Decklist</Button>
                                        <Button sx={{ width: "100px", color: "#74CFFF", bgcolor: "#26252d", fontSize: '12px' }} component={Link} to="/optcgbuilder">OPTCG<br />Builder</Button>
                                    </Box>
                                </Collapse>
                            </Box>
                        </Box>
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px', marginTop: '-20px' }}>
                            <span style={{ fontSize: "20px", color: "#F2F3F8", display: 'flex', flexDirection: 'row', gap: '20px', alignItems: 'center', textAlign: 'center' }}>
                                <div style={{ height: '1px', width: '100px', backgroundColor: '#F2F3F8', }} />
                                <strong>LATEST RELEASE</strong>
                                <div style={{ height: '1px', width: '100px', backgroundColor: '#F2F3F8', }} />
                            </span>
                            <Box sx={{ width: { xs: "calc(70vw + 60px)", sm: "calc(60vw + 60px)" } }}>
                                <Slider {...settings}>
                                    {imageData.map((image, index) => (
                                        <Link key={index} to={image.path}>
                                            <Box component={'img'} src={image.src} sx={{ width: { xs: "calc(70vw + 60px)", sm: "calc(60vw + 60px)" }, height: 'auto', borderRadius: '15px' }} />
                                        </Link>
                                    ))}
                                </Slider>
                            </Box>
                        </Box>
                        <Box sx={{ width: { xs: "calc(70vw + 60px)", sm: "calc(60vw + 60px)" }, display: "flex", flexDirection: "column", alignItems: 'center', bgcolor: "#26252d", paddingTop: "20px", paddingBottom: "20px", borderRadius: "20px" }}>
                            <Box sx={{ paddingRight: "30px", paddingLeft: "30px", display: 'flex', alignItems: 'center', alignSelf: 'start' }}>
                                <div style={{ fontSize: "20px", color: "#74CFFF" }}><strong>LAUNCH CALENDAR</strong></div>
                                <IconButton
                                    onClick={() => setIsCalendarVisible(!isCalendarVisible)}
                                    sx={{ color: '#f2f3f8', transform: isCalendarVisible ? 'rotate(180deg)' : 'rotate(0deg)', transition: theme.transitions.create('transform', { duration: theme.transitions.duration.shortest }) }}
                                >
                                    <ExpandMore />
                                </IconButton>
                            </Box>
                            <Collapse in={isCalendarVisible}>
                                <Box width={{ xs: "calc(70vw + 60px)", sm: "calc(60vw + 60px)" }} position={"relative"}>
                                    <FullCalendar
                                        key={selectedId}
                                        plugins={[listPlugin]}
                                        initialView={"listYear"}
                                        headerToolbar={{
                                            start: "title",
                                            center: "",
                                            end: "",
                                        }}
                                        height={"40vh"}
                                        events={filteredEvents || launchdates} // Use filteredEvents if available, else use all events
                                        eventClick={handleEventClick}
                                        eventContent={renderEventContent}
                                    />
                                    <Select
                                        value={selectedId}
                                        onChange={handleFilter}
                                        sx={{ position: "absolute", top: 0, right: '30px', width: "80px", height: '40px', backgroundColor: "#f2f3f8" }}
                                        displayEmpty
                                    >
                                        <MenuItem value="">
                                            <em>All</em>
                                        </MenuItem>
                                        <MenuItem value="ruipoUA">UNIONARENA</MenuItem>
                                    </Select>
                                </Box>
                            </Collapse>
                        </Box>
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px', marginTop: '-20px' }}>
                            <span style={{ fontSize: "20px", color: "#F2F3F8", display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                                <div style={{ height: '1px', width: '100px', backgroundColor: '#F2F3F8', marginRight: '20px', }} />
                                <Box style={{display:'flex',justifyContent:'center',alignItems:'center'}}>
                                    <strong>COMING SOON IN</strong>
                                    <img src="images/UAlogo.webp" alt="unionarena" style={{ width: '100px', height: 'auto' }} />
                                </Box>
                                <div style={{ height: '1px', width: '100px', backgroundColor: '#F2F3F8', }} />
                            </span>
                            <Box sx={{ width: { xs: "calc(70vw + 60px)", sm: "calc(60vw + 60px)" } }}>
                                <Slider {...settings}>
                                    {comingsoonData.map((image, index) => (
                                        <Box component={'img'} key={index} src={image.src} sx={{ width: { xs: "calc(70vw + 60px)", sm: "calc(60vw + 60px)" }, height: 'auto', borderRadius: '15px' }} />
                                    ))}
                                </Slider>
                            </Box>
                        </Box>
                        <Box width={{ xs: "70vw", sm: "60vw" }} sx={{ display: "flex", flexDirection: "column", bgcolor: "#26252d", paddingRight: "30px", paddingLeft: "30px", paddingTop: "20px", paddingBottom: "20px", borderRadius: "20px" }}>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}><div style={{ fontSize: "20px", color: "#74CFFF" }}><strong>UPDATES ON WEBSITE</strong></div>
                                <IconButton
                                    onClick={() => setOpen(!open)}
                                    sx={{ color: '#f2f3f8', transform: open ? 'rotate(180deg)' : 'rotate(0deg)', transition: theme.transitions.create('transform', { duration: theme.transitions.duration.shortest }) }}
                                >
                                    <ExpandMore />
                                </IconButton>
                            </Box>
                            <Collapse in={open}>
                                <br />
                                <div><strong style={{ color: '#74CFFF' }}>Current Update:</strong>
                                    <br />Launched Bleach and Bluelock
                                    <br />
                                </div>
                                <br />
                                <div><strong style={{ color: '#74CFFF' }}>Next Update:</strong>
                                    <br />Addition of New Card Selection and New Extra Booster (When effects are released)
                                    <br />
                                </div>
                            </Collapse>
                        </Box>
                        <Box sx={{ display: "flex", flexDirection: "row", flexWrap: 'wrap', marginRight: "15px", gap: { xs: "20px", sm: "50px" }, justifyContent: "center" }}>
                            <ButtonBase sx={{ padding: "1px", display: "flex", flexDirection: "column", }}
                                href="https://www.buymeacoffee.com/uniondeck">
                                <img style={{ width: "200px", borderRadius: "10px" }} src="images/donation.png" alt="donation" />
                                <br />
                                <span style={{ color: "#f2f3f8" }}>Click or scan to contribute!</span>
                            </ButtonBase>
                            <Box sx={{ flexWrap: "wrap", width: { xs: "80vw", sm: "40vw" }, textJustify: "inter-word", textAlign: "justify" }}>
                                I hope that the experience on this website is enjoyable for you and would kindly appreciate any form of donation and contribution.
                                All money from this website will be used to run and make this website better
                                <br />
                                <a style={{ color: "#10c5a3" }} href="/credits">Read more on how your contribution can help!</a>
                            </Box>
                        </Box>
                        <Box padding={1}>
                            <div style={{ height: "100px" }}></div>
                        </Box>
                    </Box>
                </Box>
                <Box sx={{ display: { sm: "block", md: "none" } }}><BottomNav /></Box>
            </Box>
        </div>
    );
}

export default Home