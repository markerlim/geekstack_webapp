import React, { useContext, useEffect, useRef, useState } from "react";
import SingleCardStack from "./SingleCardStack";
import { getDoc, doc } from 'firebase/firestore'; // Import your Firebase configuration
import { db } from "../../Firebase";
import { Box, CircularProgress } from "@mui/material"; // Import CircularProgress component from Material-UI
import SingleCardStackMongo from "./SingleCardStackMongo";
import { AuthContext } from "../../context/AuthContext";

function formatDate(date) {
    const day = date.getDate();
    const monthIndex = date.getMonth();
    const year = date.getFullYear();

    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];

    const monthName = monthNames[monthIndex];

    return `${day} ${monthName} ${year}`;
}

const CardStackFloodMongo = () => {
    const [deckData, setDeckData] = useState([]);
    const [page, setPage] = useState(1); // Track the current page number
    const [lastCardRefState, setLastCardRefState] = useState(null); // State variable to track lastCardRef
    const [isLoading, setIsLoading] = useState(false); // State variable to track loading
    const isPaginatingRef = useRef(false); // Use a ref to track pagination state
    const canPaginateNextRef = useRef(true); // Use a ref to track if there's more data
    const authContext = useContext(AuthContext);

    const uid = authContext.currentUser?.uid;

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && !isPaginatingRef.current && canPaginateNextRef.current) {
                    console.log('Triggering Pagination');
                    isPaginatingRef.current = true; // Set pagination state
                    setPage((prevPage) => prevPage + 1);
                }
            },
            { threshold: 1.0 }
        );

        if (lastCardRefState) { // Use lastCardRefState here
            observer.observe(lastCardRefState);
        }

        return () => {
            if (lastCardRefState) { // Use lastCardRefState here
                observer.unobserve(lastCardRefState);
            }
        };
    }, [lastCardRefState]); // Use lastCardRefState as the dependency

    useEffect(() => {
        const fetchMoreData = async () => {
            setIsLoading(true); // Show loading indicator
            const fetchurl = `https://ap-southeast-1.aws.data.mongodb-api.com/app/data-fwguo/endpoint/getContent?page=${page}&pagesize=10&secret=${process.env.REACT_APP_SECRET_KEY}`;
            try {
                const response = await fetch(fetchurl);
                const dataArray = await response.json();

                if (dataArray.length === 0) {
                    canPaginateNextRef.current = false; // No more data to paginate
                }

                const newDeckData = await Promise.all(dataArray.map(async (data) => {
                    if (data.uid) {
                        try {
                            const userDoc = await getDoc(doc(db, 'users', data.uid));
                            if (userDoc.exists()) {
                                const userData = userDoc.data();
                                data.photoURL = userData.photoURL;
                                data.displayName = userData.displayName;
                            }
                        } catch (error) {
                            console.error('Error fetching user data:', error);
                        }
                    }
                    return { id: data._id, ...data };
                }));

                setDeckData((prevData) => [...prevData, ...newDeckData]);
                isPaginatingRef.current = false; // Reset pagination state
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setIsLoading(false); // Hide loading indicator
            }
        };

        fetchMoreData();
    }, [page]);

    // Use memoization for filtering left and right column cards
    const leftColumnCards = React.useMemo(() => deckData.filter((_, index) => index % 2 === 0), [deckData]);
    const rightColumnCards = React.useMemo(() => deckData.filter((_, index) => index % 2 !== 0), [deckData]);

    return (
        <>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'center',
                    gap: '10px',
                    overflow: 'auto',
                    alignItems: 'start',
                    height: '80vh', // Adjusted height
                    paddingBottom: '50px',
                    paddingTop: '20px',
                    width: { xs: '100vw', sm: '100vw', md: 'calc(100vw - 100px)' },
                }}
            >
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', paddingBottom: '50px' }}>
                    {leftColumnCards.map((data, index) => (
                        <Box
                            key={index}
                            ref={index === leftColumnCards.length - 1 ? setLastCardRefState : null} // Set the ref for the last card
                            sx={{
                                paddingTop: '0px',
                                height: !data.description ? '205px' : (data.selectedCards[0].imagesrc ? '240px' : '130px'),
                                borderRadius: '10px',
                                width: '170px',
                                position: 'relative',
                                overflow: 'hidden',
                            }}
                        >
                            <SingleCardStackMongo grpdata={data} index={index} uid={uid}/>
                        </Box>
                    ))}
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', paddingBottom: '50px' }}>
                    {rightColumnCards.map((data, index) => (
                        <Box
                            key={index}
                            ref={index === rightColumnCards.length - 1 ? setLastCardRefState : null} // Set the ref for the last card
                            sx={{
                                paddingTop: '0px',
                                height: !data.description ? '205px' : (data.selectedCards[0].imagesrc ? '240px' : '130px'),
                                width: '170px',
                                borderRadius: '10px',
                                position: 'relative',
                                overflow: 'hidden',
                            }}
                        >
                            <SingleCardStackMongo grpdata={data} index={index} uid={uid}/>
                        </Box>
                    ))}
                </Box>
            </Box>
            {isLoading && (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', position: 'fixed', width: '100%', background: 'rgba(0,0,0,0.5)' }}>
                    <CircularProgress color="primary" />
                </Box>
            )}
        </>
    );
};

export default CardStackFloodMongo;
