import React, { useContext, useEffect, useRef, useState } from "react";
import { Box } from "@mui/material";
import SingleCardStack from "./SingleCardStack";
import { onSnapshot, query, collection, orderBy, limit, startAfter, getDocs, where } from 'firebase/firestore';
import { getDoc, doc } from 'firebase/firestore';
import { db } from "../../Firebase";
import { AuthContext } from "../../context/AuthContext";
import SingleCardDrawer from "./SingleCardDrawer";
import { useNavigate, useParams } from "react-router-dom";

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

const CardStackFlood = ({ selectedCategoryTag, selectedUAtag }) => {
    const grabbingParams = useParams();
    const paramsUid = grabbingParams.id;
    const navigate = useNavigate();
    const [deckData, setDeckData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [isPaginating, setIsPaginating] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isClicked, setIsClicked] = useState(false);
    const [canPaginateNext, setCanPaginateNext] = useState(true);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const itemsPerPage = 10;
    const querySnapshotRef = useRef(null);
    const querySnapshotStackRef = useRef([]);
    const lastCardRef = useRef(null);

    const paddingTopValue = selectedCategoryTag === 'UNION-ARENA' ? '64px' : '44px';

    const authContext = useContext(AuthContext);
    const uid = authContext.currentUser?.uid;

    const fetchDeckData = async () => {
        console.log('fetching DATAAAAA');
        setIsPaginating(true);
        setIsLoading(true);
        try {
            let lastSharedDate;

            if (currentPage > querySnapshotStackRef.current.length) {
                if (querySnapshotRef.current && querySnapshotRef.current.docs.length > 0) {
                    lastSharedDate = querySnapshotRef.current.docs[querySnapshotRef.current.docs.length - 1].data().sharedDate;
                    querySnapshotStackRef.current.push(lastSharedDate);
                }
            } else {
                // Pop the last shared date only if it's not the first page
                if (currentPage > 1) {
                    querySnapshotStackRef.current.pop();
                }
                lastSharedDate = querySnapshotStackRef.current[querySnapshotStackRef.current.length - 1];
            }

            let deckQuery;
            let selectedCollection;

            if (selectedCategoryTag === "UNION-ARENA") {
                selectedCollection = "uniondecklist";
                deckQuery = query(
                    collection(db, selectedCollection),
                    where('postType', '==', 'UATCG'),
                    orderBy("sharedDate", "desc"),
                    limit(itemsPerPage),
                    ...(lastSharedDate ? [startAfter(lastSharedDate)] : []),
                    ...(selectedCollection === "uniondecklist" && selectedUAtag
                        ? [
                            where('animecode', '==', selectedUAtag.toLowerCase())
                        ]
                        : [])
                );
            } else if (selectedCategoryTag === "ONE-PIECE") {
                selectedCollection = "uniondecklist";
                deckQuery = query(
                    collection(db, selectedCollection),
                    where('postType', '==', 'OPTCG'),
                    orderBy("sharedDate", "desc"),
                    limit(itemsPerPage),
                    ...(lastSharedDate ? [startAfter(lastSharedDate)] : []),
                );
            } else {
                selectedCollection = "uniondecklist";
                deckQuery = query(
                    collection(db, selectedCollection),
                    orderBy("sharedDate", "desc"),
                    limit(itemsPerPage),
                    ...(lastSharedDate ? [startAfter(lastSharedDate)] : [])
                );
            }

            const newQuerySnapshot = await getDocs(deckQuery);
            if (newQuerySnapshot.docs.length > 0) {
                querySnapshotRef.current = newQuerySnapshot;
            }

            console.log('Number of docs returned:', newQuerySnapshot.docs.length);
            setCanPaginateNext(newQuerySnapshot.docs.length === itemsPerPage);

            const docsCount = querySnapshotRef.current.docs.length;
            if (docsCount === 0) {
                setIsPaginating(false);
                return; // No more documents to fetch
            }

            const newDeckData = [];
            for (let deckDoc of querySnapshotRef.current.docs) {
                const data = deckDoc.data();
                if (data.uid) {
                    const userDoc = await getDoc(doc(db, 'users', data.uid));
                    if (userDoc.exists()) {
                        const userData = userDoc.data();
                        data.photoURL = userData.photoURL;
                        data.displayName = userData.displayName;
                    }
                }
                const date = data.sharedDate.toDate();
                const formattedDate = formatDate(date);
                newDeckData.push({ id: deckDoc.id, ...data, sharedDateOnly: formattedDate });
            }

            newDeckData.sort((a, b) => new Date(b.sharedDateOnly) - new Date(a.sharedDateOnly));

            // Update deck data
            setDeckData((prevDeckData) => [...prevDeckData, ...newDeckData]);

        } catch (error) {
            console.error("Error fetching deck data: ", error);
        }
        setIsPaginating(false);
        setIsLoading(false);
    };

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && !isPaginating && canPaginateNext) {
                    console.log('Triggering Pagination');
                    setCurrentPage((prevPage) => prevPage + 1);
                    setIsPaginating(true);
                }
            },
            { threshold: 0.2 }
        );

        if (lastCardRef.current) {
            observer.observe(lastCardRef.current);
        }

        return () => {
            if (lastCardRef.current) {
                observer.unobserve(lastCardRef.current);
            }
        };
    }, [lastCardRef, isPaginating, canPaginateNext]);


    useEffect(() => {
        // Fetch initial data only once
        if (!currentPage) {
            fetchDeckData();
        }

        // Check if paramsUid is present and set isClicked and drawerOpen accordingly
        if (paramsUid) {
            setIsClicked(true);
            setDrawerOpen(true);
        }
    }, []);

    useEffect(() => {
        if (isPaginating && currentPage > 1) {
            fetchDeckData();
        }
        console.log('Paginating');
    }, [isPaginating, currentPage]);
    

    useEffect(() => {
        // Reset deckData when selectedCategoryTag changes
        setDeckData([]);
        setCurrentPage(1);
        querySnapshotRef.current = null;
        querySnapshotStackRef.current = [];
        setCanPaginateNext(true);

        // Fetch new data for the selected category
        fetchDeckData();
    }, [selectedCategoryTag, selectedUAtag]);

    const leftColumnCards = deckData.filter((_, index) => index % 2 === 0);
    const rightColumnCards = deckData.filter((_, index) => index % 2 !== 0);

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'center',
                gap: '10px',
                alignItems: 'start',
                height: '80vh', // Adjusted height
                paddingBottom: '50px',
                paddingTop: paddingTopValue,
                width: { xs: '100vw', sm: '100vw', md: 'calc(100vw - 100px)' },
            }}
        >
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', paddingBottom: '20px' }}>
                {leftColumnCards.map((data, index) => (
                    <Box
                        key={index}
                        ref={index === leftColumnCards.length - 1 ? lastCardRef : null} // Set the ref for the last card
                        sx={{
                            paddingTop: '0px',
                            height: !data.description ? '205px' : (data.selectedCards[0].imagesrc ? '240px' : '130px'),
                            borderRadius: '10px',
                            width: '170px',
                            flex: '0 0 auto',
                            position: 'relative',
                            overflow: 'hidden',
                        }}
                        onClick={() => { setIsClicked(true) }}
                    >
                        <SingleCardStack grpdata={data} index={index} uid={uid} setDrawerOpen={setDrawerOpen} drawerOpen={drawerOpen} />
                    </Box>
                ))}
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', paddingBottom: '20px' }}>
                {rightColumnCards.map((data, index) => (
                    <Box
                        key={index}
                        ref={index === rightColumnCards.length - 1 ? lastCardRef : null} // Set the ref for the last card
                        sx={{
                            paddingTop: '0px',
                            height: !data.description ? '205px' : (data.selectedCards[0].imagesrc ? '240px' : '130px'),
                            width: '170px',
                            borderRadius: '10px',
                            flex: '0 0 auto',
                            position: 'relative',
                            overflow: 'hidden',
                        }}
                        onClick={() => { setIsClicked(true) }}
                    >
                        <SingleCardStack grpdata={data} index={index} uid={uid} setDrawerOpen={setDrawerOpen} drawerOpen={drawerOpen} />
                    </Box>
                ))}
            </Box>
            {isLoading && (
                <Box
                    sx={{
                        position: 'fixed',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        zIndex: 1000,
                    }}
                >
                    {/* Add your loading indicator component here */}
                    Loading...
                </Box>
            )}
            {isClicked && (<SingleCardDrawer uid={uid} setDrawerOpen={setDrawerOpen} drawerOpen={drawerOpen} />)}
        </Box>
    );
};

export default CardStackFlood;
