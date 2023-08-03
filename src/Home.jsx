import React, { useEffect, useState } from "react";
import { Box, ButtonBase, MenuItem, Select } from "@mui/material"
import Navbar from "./components/Navbar"
import Sidebar from "./components/Sidebar";
import BottomNav from "./components/BottomNav";
import HomepageDashboard from "./components/HomepageDashboard";
import { Helmet } from "react-helmet";
import FullCalendar from "@fullcalendar/react";
import listPlugin from "@fullcalendar/list";

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

const Home = () => {
    const launchdates = [
        {
            title: "UABT11 Gintama",
            start: "2023-07-28",
            end: "2023-07-28",
            backgroundColor: "#bb0504",
            id: "ruipoUA",
            icon:"/icons/UAtags/Gintamaicon.jpg",
        },
        {
            title: "Digimon EX05 - Animal Colosseum",
            start: "2023-08-25",
            end: "2023-08-25",
            backgroundColor: "#41aeeb",
            id: "ruipoDCG",
            icon:"/icons/UAtags/Digimonicon.jpg",
        },
        {
            title: "Digimon BT15",
            start: "2023-09-29",
            end: "2023-09-29",
            backgroundColor: "#41aeeb",
            id: "ruipoDCG",
            icon:"/icons/UAtags/Digimonicon.jpg",
        },
        {
            title: "UABT12 Bluelock",
            start: "2023-09-29",
            end: "2023-09-29",
            backgroundColor: "#bb0504",
            id: "ruipoUA",
            icon:"/icons/UAtags/Bluelockicon.jpg",
        },
        {
            title: "UABT08 Bleach",
            start: "2023-09-29",
            end: "2023-09-29",
            backgroundColor: "#bb0504",
            id: "ruipoUA",
            icon:"/icons/UAtags/Bleach1000icon.jpg",
        },
        {
            title: "UABT13 Tekken7",
            start: "2023-10-27",
            end: "2023-10-27",
            backgroundColor: "#bb0504",
            id: "ruipoUA",
            icon:"/icons/UAtags/Tekken7icon.jpg",
        },
        {
            title: "Jujutsu Kaisen New Card Selection",
            start: "2023-10-27",
            end: "2023-10-27",
            backgroundColor: "#bb0504",
            id: "ruipoUA",
            icon:"/icons/UAtags/Jujutsunokaisenicon.jpg",
        },
        {
            title: "Demon Slayer New Card Selection",
            start: "2023-10-27",
            end: "2023-10-27",
            backgroundColor: "#bb0504",
            id: "ruipoUA",
            icon:"/icons/UAtags/Demonslayericon.jpg",
        },
        {
            title: "Hunter X Hunter EX01",
            start: "2023-10-27",
            end: "2023-10-27",
            backgroundColor: "#bb0504",
            id: "ruipoUA",
            icon:"/icons/UAtags/Hunterxhuntericon.jpg",
        },
        {
            title: "Code Geass EX02",
            start: "2023-11-24",
            end: "2023-11-24",
            backgroundColor: "#bb0504",
            id: "ruipoUA",
            icon:"/icons/UAtags/Codegeassicon.jpg",
        },
    ];

    const [filteredEvents, setFilteredEvents] = useState(launchdates); // State to store filtered events
    const [selectedId, setSelectedId] = useState(""); // State to store selected ID

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
            <Box color={"#f2f3f8"}>
                <Navbar />
                <Box>
                    <Box sx={{ display: { xs: "none", sm: "none", md: "block" } }}><Sidebar /></Box>
                    <Box sx={{ marginLeft: { xs: "0px", sm: "0px", md: "100px" }, paddingLeft: "15px", paddingRight:"0px",display: "flex", flexDirection: "column", gap: "30px", alignItems: "center", }} overflowY={"auto"} height={"95vh"}>
                        <div style={{ height: "1px" }}></div>
                        <HomepageDashboard />
                        <Box width={"80vw"} position={"relative"} sx={{marginRight:"15px"}}>
                            <div>Launch Calendar</div>
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
                                sx={{ position: "absolute", top: 0, right: 0, width: "100px", backgroundColor: "#f2f3f8" }}
                                displayEmpty
                            >
                                <MenuItem value="">
                                    <em>All</em>
                                </MenuItem>
                                <MenuItem value="ruipoUA">UNIONARENA</MenuItem>
                                <MenuItem value="ruipoDCG">DIGIMON</MenuItem>
                            </Select>
                        </Box>
                        <Box width={"60vw"} sx={{display:"flex", flexDirection:"column",bgcolor:"#26252d",paddingRight:"30px",paddingLeft:"30px",paddingTop:"20px",paddingBottom:"20px",borderRadius:"20px"}}>
                            <div style={{fontSize:"20px",color:"#10c595"}}><strong>UPDATES ON WEBSITE</strong></div>
                            <br/>
                            <div><strong>Current Update:</strong>
                            <br/>Added UA11BT Gintama
                            <br/>Added Digimon Card Game up to BT14 without ST (Will take some time to update the rest)
                            <br/>Do take note that the Digimon Cards may have issue loading.
                            </div>
                            <br/>
                            <div><strong>Next Update:</strong> 
                            <br/>Addition of Digimon Card Game Deck Builder
                            <br/>Addition of Bleach and Bluelock (When effects are released)
                            </div>
                        </Box>
                        <Box sx={{ display: "flex", flexDirection: "row", flexWrap:'wrap',marginRight:"15px", gap:{ xs: "20px", sm:"50px" },justifyContent:"center" }}>
                            <ButtonBase sx={{padding:"1px", display: "flex", flexDirection: "column",}}
                                href="https://www.buymeacoffee.com/uniondeck">
                                <img style={{ width: "200px", borderRadius: "10px" }} src="images/donation.png" alt="donation" />
                                <br/>
                                <span style={{ color: "#f2f3f8" }}>Click or scan to contribute!</span>
                            </ButtonBase>
                            <Box sx={{flexWrap:"wrap",width:{ xs: "80vw", sm: "40vw" },textJustify:"inter-word",textAlign:"justify"}}>
                                I hope that the experience on this website is enjoyable for you and would kindly appreciate any form of donation and contribution.
                                All money from this website will be used to run and make this website better
                                <br/>
                                <a style={{color:"#10c5a3"}} href="/credits">Read more on how your contribution can help!</a>
                            </Box>
                        </Box>
                        <Box padding={1}>
                            <div style={{height:"100px"}}></div>
                        </Box>
                    </Box>
                </Box>
                <Box sx={{ display: { sm: "block", md: "none" } }}><BottomNav /></Box>
            </Box>
        </div>
    );
}

export default Home