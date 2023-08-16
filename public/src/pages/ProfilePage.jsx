import React, { useContext, useEffect, useState, } from "react";
import { Box, Button, Collapse, IconButton, } from "@mui/material"
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import BottomNav from "../components/BottomNav";
import { Helmet } from "react-helmet";
import "../style.scss";
import { useNavigate, useParams } from "react-router-dom";
import { db } from "../Firebase";
import { collection, doc, getDoc, getDocs, query, setDoc, updateDoc, where } from "firebase/firestore";
import { AuthContext } from "../context/AuthContext";
import { ArrowBack,ArrowCircleDown, ArrowCircleUp } from "@mui/icons-material";

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

const ProfilePage = () => {

    const { uid } = useParams();

    const [userData, setUserData] = useState(null);
    const [userVote, setUserVote] = useState(null);
    const currentUser = useContext(AuthContext);
    const [isUAButtonsVisible, setIsUAButtonsVisible] = useState(false);
    const [isDTCGButtonsVisible, setIsDTCGButtonsVisible] = useState(false);
    const [isOPTCGButtonsVisible, setIsOPTCGButtonsVisible] = useState(false);
    const [uaDeckData, setUaDeckData] = useState([]);
    const navigate = useNavigate();

    const goBack = () => {
      navigate(-1);
    };

    const imgStyles = {
        width: { xs: '150px', sm: '300px' },
        marginLeft: { xs: '-36.5px', sm: '-73px' },
        marginTop: { xs: '-35px', sm: '-70px' },
    };

    useEffect(() => {
        const fetchUserData = async () => {
            const now = new Date();
            const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            try {
                const docRef = doc(db, 'users', uid);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists) {
                    setUserData(docSnap.data());
                }
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        };

        fetchUserData();
    }, [uid]);

    useEffect(() => {
        const fetchData = async () => {
            const querySnapshot = await getDocs(query(collection(db, 'uniondecklist'), where('uid', '==', uid)));

            // Map through each document, format the date, and return the modified document
            const retrievedData = querySnapshot.docs.map(doc => {
                const data = doc.data();
                if (data.sharedDate) {
                    data.formattedSharedDate = formatDate(data.sharedDate.toDate());
                }
                return data;
            });
            console.log(retrievedData);
            setUaDeckData(retrievedData);
        };

        fetchData();

    }, [uid]);



    const handleVote = async (type) => {
        try {
            const now = new Date();
            const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            const userRef = doc(db, 'users', uid);

            // Reference to the vote document for this user for the current day
            const voteRef = doc(db, 'votes', `${currentUser.currentUser.uid}_${uid}_${today.toISOString()}`);

            const voteSnap = await getDoc(voteRef);
            if (!voteSnap.exists) {
                let newFame = userData.fame || 0;

                if (type === "up") {
                    newFame += 1;
                } else {
                    newFame -= 1;
                }

                // Update user's fame immediately in local state
                setUserData(prevData => ({
                    ...prevData,
                    fame: newFame
                }));

                // Update the fame in Firestore
                await updateDoc(userRef, {
                    fame: newFame
                });

                // Record the vote for the day in the votes collection
                await setDoc(voteRef, {
                    vote: type,
                    timestamp: now
                });

                setUserVote(type);
            } else {
                // User has already voted today
                alert('You have already voted today!');
            }
        } catch (error) {
            console.error("Error updating vote:", error);
        }
    };

    useEffect(() => {
        const fetchUserVote = async () => {
            try {
                const now = new Date();
                const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

                const voteRef = doc(db, 'votes', `${currentUser.currentUser.uid}_${uid}_${today.toISOString()}`);
                const voteSnap = await getDoc(voteRef);

                if (voteSnap.exists && voteSnap.data()) {
                    setUserVote(voteSnap.data().vote);
                }
            } catch (error) {
                console.error("Error fetching vote:", error);
            }
        };

        fetchUserVote();
    }, [uid, currentUser]);


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
                    <Box sx={{ marginLeft: { xs: "0px", sm: "0px", md: "100px" }, paddingLeft: "15px", paddingRight: "15px", display: "flex", flexDirection: "column", gap: "30px", alignItems: "center", }} overflowY={"auto"} height={"100vh"}>
                        <Box sx={{ display: "flex", flexDirection: "column", flexWrap: "wrap", gap: "20px", paddingBottom: "500px", alignItems: "center", position: 'relative' }}>
                            <Box sx={{ display:{xs:'flex',sm:'flex',md:'none'},alignItems:'center',gap:'10px',width:'100vw',backgroundColor:'#26252d',paddingLeft:'20px',
                            paddingTop:'10px',paddingBottom:'10px',marginTop:{xs:'-10px',sm:'5px'},color:'#F2f3f8',fontWeight:'900',}}>
                                <ArrowBack onClick={goBack}/><span style={{fontSize:'20px'}}>PROFILE</span>
                            </Box>
                            <div style={{height:'1px'}}></div>
                            {userData ? (
                                <>
                                    <Box sx={{ borderRadius: '100px', border: '4px solid #7C4FFF ', overflow: 'hidden', width: '200px', height: '200px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                        <img src={userData.photoURL} style={{ width: '250px', backgroundColor: '#26252D' }} alt="displaypic" />
                                    </Box>
                                    <span style={{ color: '#f2f3f8', width: '200px', backgroundColor: '#26252D', padding: '20px', textAlign: 'center', fontSize: '20px', borderRadius: '10px ' }}>{userData.displayName}</span>
                                    <span style={{ color: '#f2f3f8', }}>Click to view decklist shared:</span>
                                    <Box sx={{ width: '220px', backgroundColor: '#26252D', color: '#f2f3f8', padding: '10px', textAlign: 'center', fontSize: '20px', borderRadius: '10px ', display: 'none', flexDirection: 'row', gap: '10px', justifyContent: 'center', alignItems: 'center' }}>
                                        {/* Voting buttons */}
                                        <IconButton
                                            onClick={() => handleVote('up')}
                                            disabled={userVote === 'up'}
                                            sx={{ color: '#f2f3f8' }}
                                        >
                                            <ArrowCircleUp />
                                        </IconButton>
                                        {/* Display fame count */}
                                        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                            <div>Fame:</div>
                                            <div>{userData.fame || 0}</div>
                                        </Box>
                                        <IconButton
                                            onClick={() => handleVote('down')}
                                            disabled={userVote === 'down'}
                                            sx={{ color: '#f2f3f8' }}
                                        >
                                            <ArrowCircleDown />
                                        </IconButton>
                                    </Box>
                                    <Box sx={{ display: 'flex', flexWrap: 'nowrap', gap: '20px', height: '83.5px', overflowX: 'auto', justifyContent: 'center', alignItems: 'center', width: '100vw' }}>
                                        <Button
                                            sx={{
                                                width: { xs: 'auto', sm: "120px" }, flex: '0 0 auto', height: { xs: '50px', sm: "75px" }, color: "#7C4FFF", bgcolor: "#26252d", padding: 0, borderRadius: "10px", overflow: 'hidden', transition: 'all 0.2s ease-in-out', '&:hover': {
                                                    transform: 'scale(1.1)',
                                                    transition: 'all 0.2s ease-in-out'
                                                }
                                            }}
                                            onClick={() => {
                                                setIsDTCGButtonsVisible(!isDTCGButtonsVisible);
                                                setIsUAButtonsVisible(false);
                                                setIsOPTCGButtonsVisible(false);
                                            }}
                                        >
                                            <img style={{ height: "100%" }} alt="digimon" src="/images/HMDTCGButton.jpg" />
                                        </Button>
                                        <Button
                                            sx={{
                                                width: { xs: 'auto', sm: "120px" }, flex: '0 0 auto', height: { xs: '50px', sm: "75px" }, color: "#7C4FFF", bgcolor: "#26252d", padding: 0, borderRadius: "10px", overflow: 'hidden', transition: 'all 0.2s ease-in-out', '&:hover': {
                                                    transform: 'scale(1.1)',
                                                    transition: 'all 0.2s ease-in-out'
                                                }
                                            }}
                                            onClick={() => {
                                                setIsUAButtonsVisible(!isUAButtonsVisible);
                                                setIsDTCGButtonsVisible(false);
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
                                                setIsDTCGButtonsVisible(false);
                                                setIsUAButtonsVisible(false);
                                            }}
                                        >
                                            <img style={{ height: "100%" }} alt="onepiece" src="/images/HMOPTCGButton.jpg" />
                                        </Button>
                                    </Box>
                                    <Box sx={{ position: 'relative' }}>
                                        <Collapse sx={{ position: "absolute", top: '50%', left: '50%', transform: 'translate(-50%, 0%)' }} in={isDTCGButtonsVisible}>
                                            <Box sx={{ width: { xs: "calc(70vw + 60px)", sm: "calc(60vw + 60px)" }, display: "flex", flexDirection: "row", gap: '20px', justifyContent: 'center', paddingBottom: "20px", borderRadius: "20px" }}>
                                                Currently Unavailable
                                            </Box>
                                        </Collapse>
                                        <Collapse sx={{ position: "absolute", top: '50%', left: '50%', transform: 'translate(-50%, 0%)' }} in={isUAButtonsVisible}>
                                            <Box sx={{ width: '100vw', display: "flex", flexDirection: "row", gap: '20px', justifyContent: 'center', paddingBottom: "20px", borderRadius: "20px" }}>
                                                <Box
                                                    sx={{
                                                        display: "flex", flexDirection: "row", gap: '20px', justifyContent: 'center', paddingBottom: "20px", borderRadius: "20px"
                                                    }}
                                                >
                                                    {uaDeckData.map((deck, index) => (
                                                        <div key={index}>
                                                            <Box sx={{ width: { xs: "130px", sm: "200px" }, paddingTop: "20px", paddingBottom: "20px", borderRadius: "20px", bgcolor: "#26252D", display: "flex", gap: '10px', alignItems: 'center', flexDirection: "column", cursor: "pointer", position: "relative" }}>
                                                                <Box sx={{ width: { xs: "80px", sm: "150px" }, height: { xs: "80px", sm: "150px" }, borderRadius: { xs: "40px", sm: "75px" }, overflow: "hidden", flex: "0 0 auto", border: { xs: "2px solid #7C4FFF", sm: "4px solid #7C4FFF" } }}>
                                                                    <Box component="img" src={deck.selectedCards[0].imagesrc} alt="test" sx={imgStyles} />
                                                                </Box>
                                                                <Box><span style={{ fontWeight: "900", color: "#f2f3f8" }}>{deck.deckName}</span></Box>
                                                                <Box><span style={{ fontWeight: "900", color: "#7C4FFF" }}>{deck.formattedSharedDate}</span></Box>
                                                            </Box>
                                                        </div>
                                                    ))}
                                                </Box>
                                            </Box>
                                        </Collapse>
                                        <Collapse sx={{ position: "absolute", top: '50%', left: '50%', transform: 'translate(-50%, 0%)' }} in={isOPTCGButtonsVisible}>
                                            <Box sx={{ width: { xs: "calc(70vw + 60px)", sm: "calc(60vw + 60px)" }, display: "flex", flexDirection: "row", gap: '20px', justifyContent: 'center', paddingBottom: "20px", borderRadius: "20px" }}>
                                                Currently Unavailable
                                            </Box>
                                        </Collapse>
                                    </Box>
                                </>
                            ) : (
                                <p>Loading...</p>
                            )}
                        </Box>
                    </Box>
                </Box>
                <Box sx={{ display: { sm: "block", md: "none" } }}><BottomNav /></Box>
            </Box>
        </div>
    );
}

export default ProfilePage