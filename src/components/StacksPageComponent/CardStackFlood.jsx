import React, { useContext, useEffect, useRef, useState } from "react";
import { Box } from "@mui/material";
import SingleCardStack from "./SingleCardStack";
import { onSnapshot, query, collection, orderBy, limit, startAfter, getDocs, where } from 'firebase/firestore';
import { getDoc, doc } from 'firebase/firestore';
import { db } from "../../Firebase";
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

const CardStackFlood = () => {
    const [deckData, setDeckData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [isPaginating, setIsPaginating] = useState(false);
    const [canPaginateNext, setCanPaginateNext] = useState(true);
    const itemsPerPage = 10;
    const querySnapshotRef = useRef(null);
    const querySnapshotStackRef = useRef([]);
    const [filters, setFilters] = useState([]);
    const lastCardRef = useRef(null);

    const handleFiltersChange = (newFilters) => {
        setFilters(newFilters);
    };

    const authContext = useContext(AuthContext);
    const uid = authContext.currentUser?.uid;

    const animecode = ['cgh', 'jjk', 'htr', 'ims', 'kmy', 'toa', 'tsk', 'btr', 'mha', 'gnt', 'blc', 'blk'];

    const setFilter = (filter) => {
        setFilters([filter]);
    };

    const fetchDeckData = async () => {
        setIsPaginating(true);
        try {
            let lastSharedDate;

            if (currentPage > querySnapshotStackRef.current.length) {
                if (querySnapshotRef.current && querySnapshotRef.current.docs.length > 0) {
                    lastSharedDate = querySnapshotRef.current.docs[querySnapshotRef.current.docs.length - 1].data().sharedDate;
                    querySnapshotStackRef.current.push(lastSharedDate);
                }
            } else {
                lastSharedDate = querySnapshotStackRef.current[querySnapshotStackRef.current.length - 2];
                querySnapshotStackRef.current.pop();
            }

            console.log(filters);

            let deckQuery;

            if (filters.length > 0) {
                deckQuery = query(
                    collection(db, "uniondecklist"),
                    orderBy("sharedDate", "desc"),
                    limit(itemsPerPage),
                    ...(lastSharedDate ? [startAfter(lastSharedDate)] : []),
                    where('animecode', 'in', filters),
                );
            } else {
                deckQuery = query(
                    collection(db, "uniondecklist"),
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
                newDeckData.push({ id: deckDoc.id, ...data, sharedDate: formattedDate });
            }

            newDeckData.sort((a, b) => new Date(b.sharedDate) - new Date(a.sharedDate));

            // Update deck data
            setDeckData((prevDeckData) => [...prevDeckData, ...newDeckData]);

        } catch (error) {
            console.error("Error fetching deck data: ", error);
        }
        setIsPaginating(false);
    };

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && !isPaginating && canPaginateNext) {
                    console.log('Triggering Pagination');
                    setIsPaginating(true);
                    setCurrentPage((prevPage) => prevPage + 1);
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
        if (isPaginating) {
            fetchDeckData();
        }
        console.log('Paginating');
    }, [isPaginating]);

    useEffect(() => {
        // Set up real-time listener
        const changelistener = onSnapshot(collection(db, "uniondecklist"), snapshot => {
            fetchDeckData();  // This will re-fetch the data whenever there's a change in the Firestore collection.
        });

        return () => {
            // Clean up the listener when the component unmounts
            changelistener();
        };
    }, []);

    const leftColumnCards = deckData.filter((_, index) => index % 2 === 0);
    const rightColumnCards = deckData.filter((_, index) => index % 2 !== 0);

    return (
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
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px',paddingBottom:'20px' }}>
                {leftColumnCards.map((data, index) => (
                    <Box
                        key={index}
                        ref={index === leftColumnCards.length - 1 ? lastCardRef : null} // Set the ref for the last card
                        sx={{
                            paddingTop: '0px',
                            height: !data.description ? '205px' : (data.selectedCards[0].imagesrc ? '240px' : '130px'),
                            borderRadius: '10px',
                            width: '170px',
                            position: 'relative',
                            overflow: 'hidden',
                        }}
                    >
                        <SingleCardStack grpdata={data} index={index} uid={uid}/>
                    </Box>
                ))}
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px',paddingBottom:'20px'  }}>
                {rightColumnCards.map((data, index) => (
                    <Box
                        key={index}
                        ref={index === rightColumnCards.length - 1 ? lastCardRef : null} // Set the ref for the last card
                        sx={{
                            paddingTop: '0px',
                            height: !data.description ? '205px' : (data.selectedCards[0].imagesrc ? '240px' : '130px'),
                            width: '170px',
                            borderRadius: '10px',
                            position: 'relative',
                            overflow: 'hidden',
                        }}
                    >
                        <SingleCardStack grpdata={data} index={index} uid={uid}/>
                    </Box>
                ))}
            </Box>
        </Box>
    );
};

export default CardStackFlood;
