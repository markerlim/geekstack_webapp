import React, { useEffect, useRef, useState } from "react";
import { Box, Button, ButtonBase, Collapse, IconButton, MenuItem, Select, useTheme } from "@mui/material"
import Sidebar from "./components/Sidebar";
import BottomNav from "./components/BottomNav";
import HomepageDashboard from "./components/HomepageDashboard";
import { Helmet } from "react-helmet";
import FullCalendar from "@fullcalendar/react";
import listPlugin from "@fullcalendar/list";
import { ExpandMore, Style, ViewList } from "@mui/icons-material";
import { Link } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import PWAPrompt from 'react-ios-pwa-prompt'
import NavbarHome from "./components/NavbarHome";
import NotificationModal from "./components/HomeNotificationBanner";

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
                background: active ? '#7c4fff' : '#26262d',
                margin: '5px',
                cursor: 'pointer'
            }}
            onClick={onClick}
        />
    );
}

function SampleNextArrow(props) {
    const { className, style, onClick } = props;
    return (
        <div
            className={className}
            style={{ ...style, display: "block" }}
            onClick={onClick}
        />
    );
}

function SamplePrevArrow(props) {
    const { className, style, onClick } = props;
    return (
        <div
            className={className}
            style={{ ...style, display: "block" }}
            onClick={onClick}
        ></div>
    );
}

const Home = () => {
    const launchdates = [
        {
            title: "UA15BT Sword Art Online",
            start: "2024-01-26",
            end: "2024-01-26",
            backgroundColor: "#bb0504",
            id: "ruipoUA",
            icon: "/icons/UAtags/icon_sao.jpg",
        },
        {
            title: "UA16BT SYNDUALITY Noir",
            start: "2024-02-23",
            end: "2024-02-23",
            backgroundColor: "#bb0504",
            id: "ruipoUA",
            icon: "/icons/UAtags/icon_syn.jpg",
        },
        {
            title: "UA17BT Toriko",
            start: "2024-02-23",
            end: "2024-02-23",
            backgroundColor: "#bb0504",
            id: "ruipoUA",
            icon: "/icons/UAtags/icon_trk.jpg",
        },
        {
            title: "UA18BT Nikke",
            start: "2024-03-22",
            end: "2024-03-22",
            backgroundColor: "#bb0504",
            id: "ruipoUA",
            icon: "/icons/UAtags/icon_nkk.jpg",
        },
        {
            title: "UA19BT Haikyuu",
            start: "2024-03-22",
            end: "2024-03-22",
            backgroundColor: "#bb0504",
            id: "ruipoUA",
            icon: "/icons/UAtags/icon_hky.jpg",
        },
        {
            title: "UA20BT Black Clover",
            start: "2024-04-26",
            end: "2024-04-26",
            backgroundColor: "#bb0504",
            id: "ruipoUA",
            icon: "/icons/UAtags/icon_bcv.jpg",
        },
        {
            title: "UA21BT Yu Yu Hakusho",
            start: "2024-04-26",
            end: "2024-04-26",
            backgroundColor: "#bb0504",
            id: "ruipoUA",
            icon: "/icons/UAtags/icon_yyh.jpg",
        },
        {
            title: "UA22BT Gamera Rebirth",
            start: "2024-05-31",
            end: "2024-05-31",
            backgroundColor: "#bb0504",
            id: "ruipoUA",
            icon: "/icons/UAtags/icon_gmr.jpg",
        },
        {
            title: "EX04 Jujutsu No Kaisen",
            start: "2024-03-22",
            end: "2024-03-22",
            backgroundColor: "#bb0504",
            id: "ruipoUA",
            icon: "/icons/UAtags/icon_jjk.jpg",
        },
        {
            title: "EX05 Demon Slayer",
            start: "2024-05-31",
            end: "2024-05-31",
            backgroundColor: "#bb0504",
            id: "ruipoUA",
            icon: "/icons/UAtags/icon_kmy.jpg",
        },
        {
            title: "EX06 My Hero Academia",
            start: "2024-06-28",
            end: "2024-06-28",
            backgroundColor: "#bb0504",
            id: "ruipoUA",
            icon: "/icons/UAtags/icon_mha.jpg",
        },
    ];
    const settings = {
        customPaging: function (i) {
            return <CustomDot key={i} active={i === currentSlide} onClick={() => setCurrentSlide(i)} />;
        },
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        afterChange: (index) => {
            setCurrentSlide(index);
        },
        nextArrow: <SampleNextArrow />,
        prevArrow: <SamplePrevArrow />
    };
    const [currentSlide, setCurrentSlide] = useState(0);
    const settings1 = {
        customPaging: function (i) {
            return <CustomDot key={i} active={i === currentSlide1} onClick={() => setCurrentSlide1(i)} />;
        },
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        afterChange: (index) => {
            setCurrentSlide1(index);
        },
    };
    const [currentSlide1, setCurrentSlide1] = useState(0);
    const [filteredEvents, setFilteredEvents] = useState(launchdates); // State to store filtered events
    const [selectedId, setSelectedId] = useState(""); // State to store selected ID
    const [open, setOpen] = useState(false);
    const [isCalendarVisible, setIsCalendarVisible] = useState(false);
    const [imageData, setImageData] = useState([]);
    const [comingsoonData, setComingsoonData] = useState([]);
    const [justifyContent, setJustifyContent] = useState('flex-start');
    const boxRef = useRef(null);
    const theme = useTheme();

    const imagedataurl = "https://ap-southeast-1.aws.data.mongodb-api.com/app/data-fwguo/endpoint/getLatestRelease"
    useEffect(() => {
        fetch(imagedataurl)
            .then(response => response.json())
            .then(data => {
                const sortedData = data.sort((a, b) => a.order - b.order);
                setImageData(sortedData);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }, []);
    const comingsoonurl = "https://ap-southeast-1.aws.data.mongodb-api.com/app/data-fwguo/endpoint/getComingSoon"
    useEffect(() => {
        fetch(comingsoonurl)
            .then(response => response.json())
            .then(data => {
                const sortedData = data.sort((a, b) => a.order - b.order);
                setComingsoonData(sortedData);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }, []);

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

    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const isNotificationShown = localStorage.getItem("isNotificationShown");
        if (!isNotificationShown) {
            setIsModalOpen(true); // If the notification hasn't been shown before, set isModalOpen to true to show it
        }
    }, []);

    const handleCloseNotification = (isChecked) => {
        setIsModalOpen(false);
        if (isChecked) {
            localStorage.setItem("isNotificationShown", "true"); // Store in local storage that the notification has been shown
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

    useEffect(() => {
        const handleResize = () => {
            if (!boxRef.current) return;

            let childWidth = 0;
            for (let child of boxRef.current.children) {
                childWidth += child.getBoundingClientRect().width;
            }

            if (childWidth > boxRef.current.getBoundingClientRect().width) {
                setJustifyContent('flex-start');
            } else {
                setJustifyContent('center');
            }
        }

        handleResize();

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        }
    }, []);

    return (
        <div>
            <Helmet>
                <meta name="apple-mobile-web-app-capable" content="yes" />
            </Helmet>
            <PWAPrompt promptOnVisit={1} timesToShow={1} copyClosePrompt="Close" permanentlyHideOnDismiss={false} />
            <Box color={"#f2f3f8"}>
                <NavbarHome />
                <NotificationModal open={isModalOpen} onClose={handleCloseNotification} />
                <Box >
                    <Box sx={{ display: { xs: "none", sm: "none", md: "block" } }}><Sidebar /></Box>
                    <Box sx={{ marginLeft: { xs: "0px", sm: "0px", md: "100px" }, display: "flex", flexDirection: "column", gap: "8px", alignItems: "center", }} overflowY={"auto"} height={"95vh"}>
                        <div style={{ height: "1px" }}></div>
                        <div style={{ height: "1px" }}></div>
                        <HomepageDashboard />
                        <Box sx={{ fontSize: "20px", color: "#F2F8FC", paddingTop: '10px', paddingBottom: '5px', textAlign: 'left', width: '100%', paddingLeft: '50px' }}><strong>TCG STACK</strong></Box>
                        <Box sx={{ display: "flex", flexwrap: "nowrap", flex: "0 0 auto", flexDirection: "row", overflowX: "auto", overflowY: "hidden",gap:'20px', justifyContent: 'left', width: "100%", paddingLeft: '15px',paddingRight: '15px',height: { xs: 188, sm: 300 }, }}>
                            <Box sx={{ width: '30px' }}></Box>
                            <Link to={{ pathname: '/unionarena' }} sx={{ textDecoration: "none" }}>
                                <ButtonBase
                                    sx={{
                                        display: "flex",
                                        flexDirection: "column",
                                        alignItems: "center",
                                        bgcolor: "#121212",
                                        borderRadius: 3,
                                        boxShadow: 5,
                                        overflow: "hidden",
                                        width: { xs: 125, sm: 200 },
                                        height: { xs: 188, sm: 300 },
                                    }}
                                >
                                    <img
                                        src="/images/homeUAbtn.jpg"
                                        alt="unionarena"
                                        style={{ width: "120%", height: "auto" }}
                                    />
                                </ButtonBase>
                            </Link>
                            <Link to={{ pathname: '/onepiece' }} sx={{ textDecoration: "none" }}>
                                <ButtonBase
                                    sx={{
                                        display: "flex",
                                        flexDirection: "column",
                                        alignItems: "center",
                                        bgcolor: "#121212",
                                        borderRadius: 3,
                                        boxShadow: 5,
                                        overflow: "hidden",
                                        width: { xs: 125, sm: 200 },
                                        height: { xs: 188, sm: 300 },
                                    }}
                                >
                                    <img
                                        src="/images/homeOPbtn.jpg"
                                        alt="unionarena"
                                        style={{ width: "120%", height: "auto" }}
                                    />
                                </ButtonBase>
                            </Link>
                            <Link to={{ pathname: '/dragonballz' }} sx={{ textDecoration: "none" }}>
                                <ButtonBase
                                    sx={{
                                        display: "flex",
                                        flexDirection: "column",
                                        alignItems: "center",
                                        bgcolor: "#121212",
                                        borderRadius: 3,
                                        boxShadow: 5,
                                        overflow: "hidden",
                                        width: { xs: 125, sm: 200 },
                                        height: { xs: 188, sm: 300 },
                                    }}
                                >
                                    <img
                                        src="/images/homeDBZbtn.jpg"
                                        alt="unionarena"
                                        style={{ width: "120%", height: "auto" }}
                                    />
                                </ButtonBase>
                            </Link>
                            <Box sx={{ width: '30px' }}></Box>
                        </Box>
                        <Box sx={{ fontSize: "20px", color: "#F2F8FC", paddingTop: '15px', paddingBottom: '10px',backgroundColor: '#121212',marginBottom:'-8px' ,textAlign: 'left', width: '100%', paddingLeft: '50px' }}><strong>WHAT'S NEW?</strong></Box>
                        <Box sx={{ display: 'flex', flexDirection: 'column', backgroundColor: '#121212', width: '100vw', paddingBottom: '40px', paddingTop: '5px', alignItems: 'center', gap: '10px' }}>
                            <Box sx={{ width: { xs: "calc(70vw + 60px)", sm: "calc(60vw + 60px)", md: '800px' }, }}>
                                <Slider {...settings}>
                                    {imageData.map((image, index) => (
                                        <Link key={index} to={image.path}>
                                            <Box component={'img'} src={image.src} sx={{
                                                width: { xs: "calc(70vw + 60px)", sm: "calc(60vw + 60px)", md: '800px' },
                                                height: 'auto', borderRadius: '10px',
                                            }} />
                                        </Link>
                                    ))}
                                </Slider>
                            </Box>
                        </Box>
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', paddingBottom: '30px' }}>
                            <img src="images/COMINGSOON.png" alt="comingsoon" style={{ width: '300px' }} />
                            <Box sx={{ width: { xs: "calc(70vw + 60px)", sm: "calc(60vw + 60px)", md: '800px' } }}>
                                <Slider {...settings1}>
                                    {comingsoonData.map((image, index) => (
                                        <Box component={'img'} key={index} src={image.src} sx={{ width: { xs: "calc(70vw + 60px)", sm: "calc(60vw + 60px)", md: '800px' }, height: 'auto', borderRadius: '10px' }} />
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
                                        initialDate={'2023-01-01'}
                                        views={{
                                            multiYear: {
                                                type: 'list',
                                                duration: { years: 2 }
                                            }
                                        }}
                                        initialView="multiYear"
                                        validRange={{
                                            start: '2023-01-01',
                                            end: '2024-12-31'
                                        }}
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
                                        <MenuItem value="ruipoOP">ONEPIECE</MenuItem>
                                    </Select>
                                </Box>
                            </Collapse>
                        </Box>
                        <Box width={{ xs: "70vw", sm: "60vw" }} sx={{ display: "flex", flexDirection: "column", bgcolor: "#26252d", paddingRight: "30px", paddingLeft: "30px", paddingTop: "20px", paddingBottom: "20px", borderRadius: "20px" }}>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}><div style={{ fontSize: "20px", color: "#74CFFF" }}><strong>PATCH NOTES</strong></div>
                                <IconButton
                                    onClick={() => setOpen(!open)}
                                    sx={{ color: '#f2f3f8', transform: open ? 'rotate(180deg)' : 'rotate(0deg)', transition: theme.transitions.create('transform', { duration: theme.transitions.duration.shortest }) }}
                                >
                                    <ExpandMore />
                                </IconButton>
                            </Box>
                            <Collapse in={open}>
                                <div className='hide-scrollbar' style={{ color: '#f2f3f8', marginBottom: '10px', height: '300px', overflow: 'auto', }}><strong style={{ color: '#f2f3f8' }}>As of 30th March:</strong>
                                    <Box sx={{ overflow: 'hidden', height: '150px', width: 'inherit', marginTop: '10px', marginBottom: '10px', borderRadius: '5px' }}>
                                        <img src="/images/deckcover.webp" style={{ width: '100%' }} alt="screen" />
                                    </Box>
                                    <li>Added feature to build with Alternate Arts.</li>
                                    <li>However it is important to note that, all previously built decks are no longer "unbuildable". <br /><strong style={{ color: '#ff6961' }}>PLEASE DELETE THEM</strong></li>
                                    <li>Onepiece Deckbuilder is fully functional</li>
                                </div>
                            </Collapse>
                        </Box>
                        <Box sx={{ display: "flex", flexDirection: "row", flexWrap: 'wrap', marginRight: "15px", gap: { xs: "20px", sm: "50px" }, justifyContent: "center" }}>
                            <ButtonBase sx={{ padding: "1px", display: "flex", flexDirection: "column", }}
                                href="https://www.buymeacoffee.com/geekstack">
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