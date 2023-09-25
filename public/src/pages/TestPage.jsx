import React, { useEffect, useState } from "react";
import { Box, ButtonBase, MenuItem, Select } from "@mui/material"
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import BottomNav from "../components/BottomNav";
import HomepageDashboard from "../components/HomepageDashboard";
import { Helmet } from "react-helmet";
import FullCalendar from "@fullcalendar/react";
import listPlugin from "@fullcalendar/list";

const TestPage = () => {
    const launchdates = [
        {
            title: "UABT11 Gintama",
            start: "2023-07-28",
            end: "2023-07-28",
            backgroundColor: "#bb0504",
            id: "ruipoUA",
        },
        {
            title: "Digimon EX05 - Animal Colosseum",
            start: "2023-08-25",
            end: "2023-08-25",
            backgroundColor: "#41aeeb",
            id: "ruipoDCG",
        },
        {
            title: "Digimon BT15",
            start: "2023-09-29",
            end: "2023-09-29",
            backgroundColor: "#41aeeb",
            id: "ruipoDCG",
        },
        {
            title: "UABT12 Bluelock",
            start: "2023-09-29",
            end: "2023-09-29",
            backgroundColor: "#bb0504",
            id: "ruipoUA",
        },
        {
            title: "UABT08 Bleach",
            start: "2023-09-29",
            end: "2023-09-29",
            backgroundColor: "#bb0504",
            id: "ruipoUA",
        },
        {
            title: "UABT13 Tekken7",
            start: "2023-10-27",
            end: "2023-10-27",
            backgroundColor: "#bb0504",
            id: "ruipoUA",
        },
        {
            title: "Jujutsu Kaisen New Card Selection",
            start: "2023-10-27",
            end: "2023-10-27",
            backgroundColor: "#bb0504",
            id: "ruipoUA",
        },
        {
            title: "Demon Slayer New Card Selection",
            start: "2023-10-27",
            end: "2023-10-27",
            backgroundColor: "#bb0504",
            id: "ruipoUA",
        },
        {
            title: "Hunter X Hunter EX01",
            start: "2023-10-27",
            end: "2023-10-27",
            backgroundColor: "#bb0504",
            id: "ruipoUA",
        },
        {
            title: "Code Geass EX02",
            start: "2023-11-24",
            end: "2023-11-24",
            backgroundColor: "#bb0504",
            id: "ruipoUA",
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
            <Box bgcolor={"#121212"} color={"#f2f3f8"}>
                <Navbar />
                <Box>
                    <Box sx={{ display: { xs: "none", sm: "none", md: "block" } }}><Sidebar /></Box>
                    <Box sx={{ marginLeft: { xs: "0px", sm: "0px", md: "100px" }, paddingLeft: "15px", paddingRight: "15px", display: "flex", flexDirection: "column", gap: "30px", alignItems: "center", }} overflowY={"auto"} height={"95vh"}>
                        <div style={{ height: "1px" }}></div>
                        <HomepageDashboard />
                        <Box width={"80vw"} position={"relative"}>
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
                        <Box sx={{ display: "flex", flexDirection: "row", flexWrap:'wrap', gap:{ xs: "20px", sm:"50px" },justifyContent:"center" }}>
                            <ButtonBase sx={{padding:"1px", display: "flex", flexDirection: "column",
                                '&:hover': {
                                    backgroundColor: "#240052", // Change this to the desired hover background color
                                    color: "#f2f3f8", // Change this to the desired hover text color if needed
                                },
                            }}
                                href="https://www.buymeacoffee.com/uniondeck">
                                <img style={{ width: "200px", borderRadius: "10px" }} src="images/donation.png" alt="donation" />

                                <span style={{ color: "#f2f3f8" }}>Click or scan to contribute!</span>
                            </ButtonBase>
                            <Box sx={{flexWrap:"wrap",width:{ xs: "80vw", sm: "40vw" },textJustify:"inter-word",textAlign:"justify"}}>
                                I hope that the experience on this website is enjoyable for you and would kindly appreciate any form of donation and contribution.
                                All money from this website will be used to run and make this website better
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

export default TestPage