import React, { useContext, useEffect, useState, } from "react";
import { Box, Button, Collapse, } from "@mui/material"
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import BottomNav from "../components/BottomNav";
import { Helmet } from "react-helmet";
import "../style.scss";
import AccountDetailsComponent from "../components/AccountDetailComponent";
import { collection, deleteDoc, doc, getDocs, query, where } from "firebase/firestore";
import { db } from "../Firebase";
import { AuthContext } from "../context/AuthContext";
import { Delete } from "@mui/icons-material";

function formatDate(date) {
    const day = date.getDate();
    const monthIndex = date.getMonth();
    const year = date.getFullYear();

    const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const monthName = monthNames[monthIndex];

    return `${day} ${monthName} ${year}`;
}

const AccountDetails = () => {
    const currentUser = useContext(AuthContext);
    const [isUAButtonsVisible, setIsUAButtonsVisible] = useState(false);
    const [isOPTCGButtonsVisible, setIsOPTCGButtonsVisible] = useState(false);
    const [uaDeckData, setUaDeckData] = useState([]);
    const [opDeckData, setOpDeckData] = useState([]);
    const uid = currentUser.currentUser.uid;

    useEffect(() => {
        const link = document.createElement("link");
        link.rel = "webmanifest";
        link.href = `${process.env.PUBLIC_URL}/manifest.json`; // Equivalent to %PUBLIC_URL%
        document.head.appendChild(link);

        return () => {
            document.head.removeChild(link);
        };
    }, []);

    const fetchUAData = async () => {
        const querySnapshot = await getDocs(query(
            collection(db, 'uniondecklist'),
            where('uid', '==', uid),
            where('postType', '==', 'UATCG')
        ));

        const retrievedData = querySnapshot.docs.map(doc => {
            const data = doc.data();
            data.id = doc.id;
            if (data.sharedDate) {
                data.formattedSharedDate = formatDate(data.sharedDate.toDate());
            }
            return data;
        });
        setUaDeckData(retrievedData);
    };

    const fetchOPData = async () => {
        const querySnapshot = await getDocs(query(
            collection(db, 'uniondecklist'),
            where('uid', '==', uid),
            where('postType', '==', 'OPTCG')
        ));

        const retrievedData = querySnapshot.docs.map(doc => {
            const data = doc.data();
            data.id = doc.id;
            if (data.sharedDate) {
                data.formattedSharedDate = formatDate(data.sharedDate.toDate());
            }
            return data;
        });
        setOpDeckData(retrievedData);
    };

    useEffect(() => {
        // Call fetchData within useEffect
        fetchUAData();
        fetchOPData();
    }, [uid]);

    const imgStyles = {
        width: { xs: '150px', sm: '300px' },
        marginLeft: { xs: '-36.5px', sm: '-73px' },
        marginTop: { xs: '-35px', sm: '-70px' },
    };


    const deleteUADeck = async (deckId) => {
        if (window.confirm(`Are you sure you want to delete this deck?`)) {
            try {
                await deleteDoc(doc(db, 'uniondecklist', deckId));
                // Refresh deck data after deletion
                fetchUAData();
            } catch (error) {
                console.error("Error deleting deck: ", error);
            }
        }
    }

    const deleteOPDeck = async (deckId) => {
        if (window.confirm(`Are you sure you want to delete this deck?`)) {
            try {
                await deleteDoc(doc(db, 'uniondecklist', deckId));
                // Refresh deck data after deletion
                fetchOPData();
            } catch (error) {
                console.error("Error deleting deck: ", error);
            }
        }
    }

    return (
        <div>
            <Helmet>
                <meta name="apple-mobile-web-app-capable" content="yes" />
            </Helmet>
            <Box color={"#f2f3f8"}>
                <Navbar />
                <Box>
                    <Box sx={{ display: { xs: "none", sm: "none", md: "block" } }}><Sidebar /></Box>
                    <Box sx={{ marginLeft: { xs: "0px", sm: "0px", md: "100px" }, paddingLeft: "15px", paddingRight: "15px", display: "flex", flexDirection: "column", gap: "30px", alignItems: "center", }} overflowY={"auto"} height={"100vh"}>
                        <div style={{ height: "1px" }}></div>
                        <Box sx={{ display: "flex", flexDirection: "row", flexWrap: "wrap", gap: "30px", paddingBottom: "150px", justifyContent: "center"}}>
                            <AccountDetailsComponent />
                            <Box sx={{ display: "flex", flexDirection: "column", flexWrap: "wrap", gap: "20px", paddingBottom: "500px", alignItems: "center" }}>
                                <span style={{ color: '#f2f3f8', }}>Click to view decklist shared:</span>
                                <Box sx={{ display: 'flex', flexWrap: 'nowrap', gap: '20px', height: '83.5px', overflowX: 'auto', justifyContent: 'center', alignItems: 'center', width: '100vw' }}>
                                    <Button
                                        sx={{
                                            width: { xs: 'auto', sm: "120px" }, flex: '0 0 auto', height: { xs: '50px', sm: "75px" }, color: "#7C4FFF", bgcolor: "#26252d", padding: 0, borderRadius: "10px", overflow: 'hidden', transition: 'all 0.2s ease-in-out', '&:hover': {
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
                                            width: { xs: 'auto', sm: "120px" }, flex: '0 0 auto', height: { xs: '50px', sm: "75px" }, color: "#7C4FFF", bgcolor: "#26252d", padding: 0, borderRadius: "10px", overflow: 'hidden', transition: 'all 0.2s ease-in-out', '&:hover': {
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
                                <Box sx={{ position: 'relative' }}>
                                    <Collapse sx={{ position: "absolute", top: '50%', left: '50%', transform: 'translate(-50%, 0%)' }} in={isUAButtonsVisible}>
                                        <Box sx={{ width: 'calc(100vw - 80px)', display: "flex", flexDirection: "row", gap: '20px', justifyContent: 'left',overflowY:'auto', paddingLeft:'40px', paddingRight:'40px' }}>
                                            <Box
                                                sx={{
                                                    display: "flex", flexDirection: "row", gap: '20px', justifyContent: 'center', paddingBottom: "20px", borderRadius: "20px"
                                                }}
                                            >
                                                {uaDeckData.length > 0 ? (
                                                    uaDeckData.map((deck, index) => (
                                                        <div key={index}>
                                                            <Box position={'relative'} sx={{ width: { xs: "130px", sm: "200px" }, paddingTop: { xs: '10px', sm: "20px" }, paddingBottom: { xs: '10px', sm: "20px" }, borderRadius: "20px", bgcolor: "#26252D", display: "flex", gap: '10px', alignItems: 'center', flexDirection: "column", cursor: "pointer", position: "relative" }}>
                                                                <Box sx={{ width: { xs: "80px", sm: "150px" }, height: { xs: "80px", sm: "150px" }, borderRadius: { xs: "40px", sm: "75px" }, overflow: "hidden", flex: "0 0 auto", border: { xs: "2px solid #7C4FFF", sm: "4px solid #7C4FFF" } }}>
                                                                    <Box component="img" src={deck.selectedCards[0].imagesrc} alt="test" sx={imgStyles} />
                                                                </Box>
                                                                <Box><span style={{ fontWeight: "900", color: "#f2f3f8" }}>{deck.deckName}</span></Box>
                                                                <Box><span style={{ fontWeight: "900", color: "#7C4FFF" }}>{deck.formattedSharedDate}</span></Box>
                                                                <Box
                                                                    onClick={() => deleteUADeck(deck.id)}  // make sure to pass the deck's ID
                                                                    sx={{ position: { xs: 'block', sm: 'absolute' }, bottom: '10px', right: '10px', color: '#ff2247', cursor: "pointer" }}  // added cursor style for better UX
                                                                >
                                                                    <Delete />
                                                                </Box>
                                                            </Box>
                                                        </div>
                                                    ))
                                                ) : (
                                                    <Box>
                                                        <span style={{ fontWeight: "900", color: "#f2f3f8" }}>No deck shared</span>
                                                    </Box>
                                                )}
                                            </Box>
                                        </Box>
                                    </Collapse>
                                    <Collapse sx={{ position: "absolute", top: '50%', left: '50%', transform: 'translate(-50%, 0%)' }} in={isOPTCGButtonsVisible}>
                                    <Box sx={{ width: 'calc(100vw - 80px)', display: "flex", flexDirection: "row", gap: '20px', justifyContent: 'left',overflowY:'auto', paddingLeft:'40px', paddingRight:'40px' }}>
                                            <Box
                                                sx={{
                                                    display: "flex", flexDirection: "row", gap: '20px', justifyContent: 'center', paddingBottom: "20px", borderRadius: "20px"
                                                }}
                                            >
                                                {opDeckData.length > 0 ? (
                                                    opDeckData.map((deck, index) => (
                                                        <div key={index}>
                                                            <Box position={'relative'} sx={{ width: { xs: "130px", sm: "200px" }, paddingTop: { xs: '10px', sm: "20px" }, paddingBottom: { xs: '10px', sm: "20px" }, borderRadius: "20px", bgcolor: "#26252D", display: "flex", gap: '10px', alignItems: 'center', flexDirection: "column", cursor: "pointer", position: "relative" }}>
                                                                <Box sx={{ width: { xs: "80px", sm: "150px" }, height: { xs: "80px", sm: "150px" }, borderRadius: { xs: "40px", sm: "75px" }, overflow: "hidden", flex: "0 0 auto", border: { xs: "2px solid #7C4FFF", sm: "4px solid #7C4FFF" } }}>
                                                                    <Box component="img" src={deck.selectedCards[0].imagesrc} alt="test" sx={imgStyles} />
                                                                </Box>
                                                                <Box><span style={{ fontWeight: "900", color: "#f2f3f8" }}>{deck.deckName}</span></Box>
                                                                <Box><span style={{ fontWeight: "900", color: "#7C4FFF" }}>{deck.formattedSharedDate}</span></Box>
                                                                <Box
                                                                    onClick={() => deleteOPDeck(deck.id)}  // make sure to pass the deck's ID
                                                                    sx={{ position: { xs: 'block', sm: 'absolute' }, bottom: '10px', right: '10px', color: '#ff2247', cursor: "pointer" }}  // added cursor style for better UX
                                                                >
                                                                    <Delete />
                                                                </Box>
                                                            </Box>
                                                        </div>
                                                    ))
                                                ) : (
                                                    <Box>
                                                        <span style={{ fontWeight: "900", color: "#f2f3f8" }}>No deck shared</span>
                                                    </Box>
                                                )}
                                            </Box>
                                        </Box>
                                    </Collapse>
                                </Box>
                            </Box>
                        </Box>
                    </Box>
                </Box>
                <Box sx={{ display: { sm: "block", md: "none" } }}><BottomNav /></Box>
            </Box>
        </div>
    );
}

export default AccountDetails