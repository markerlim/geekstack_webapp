import { Box } from "@mui/material";
import React from "react";
import { useEffect, useState, useRef } from 'react';
import { onSnapshot, query, collection, orderBy, limit, startAfter, getDocs, where } from 'firebase/firestore';
import { getDoc, doc } from 'firebase/firestore';
import SingleCardStack from "./SingleCardStack";
import { db } from "../../Firebase";

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

    const handleFiltersChange = (newFilters) => {
        setFilters(newFilters);
    };

    const animecode = ['cgh', 'jjk', 'htr', 'ims', 'kmy', 'toa', 'tsk', 'btr', 'mha', 'gnt', 'blc', 'blk']

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
                    querySnapshotStackRef.current.push(lastSharedDate); // push last shared date to the stack before going to the next page
                }
            } else {
                lastSharedDate = querySnapshotStackRef.current[querySnapshotStackRef.current.length - 2]; // get last shared date from the stack when going to the previous page
                querySnapshotStackRef.current.pop(); // remove the current last shared date from the stack
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

            const decks = [];
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
                decks.push({ id: deckDoc.id, ...data, sharedDate: formattedDate });
            }
            decks.sort((a, b) => new Date(b.sharedDate) - new Date(a.sharedDate));

            // If using infinite scrolling, append new decks to the existing deckData
            setDeckData((prevDeckData) => [...prevDeckData, ...decks]);
        } catch (error) {
            console.error("Error fetching deck data: ", error);
        }
        console.log(deckData);
        setIsPaginating(false);
    };

    const handleScroll = () => {
        const scrollTop = (document.documentElement && document.documentElement.scrollTop) || document.body.scrollTop;
        const scrollHeight = (document.documentElement && document.documentElement.scrollHeight) || document.body.scrollHeight;
        const clientHeight = document.documentElement.clientHeight || window.innerHeight;

        if (scrollTop + clientHeight >= scrollHeight - 20 && !isPaginating && canPaginateNext) {
            setIsPaginating(true);
            setCurrentPage((prevPage) => prevPage + 1);
        }
    };

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    useEffect(() => {
        if (isPaginating) {
            fetchDeckData();
        }
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
    const dataset = [{
        src: '/UD/JJK-2-004.webp', photoURL: '/UD/JJK-2-004.webp', name: 'Satoru Gojo',
        content: 'What a great deck to play with!\nHope to be able to play here again!\nDefinitely an enjoyable experience.',
        effect: 'test'
    }, {
        src: '/UD/JJK-2-003.webp', photoURL: '/UD/JJK-2-003.webp', name: 'Suguru Getou',
        content: 'What a great deck to play with!\nHope to be able to play here again!\nDefinitely an enjoyable experience.',
        effect: 'test'
    }, {
        src: '/UD/JJK-2-004.webp', photoURL: '/UD/JJK-2-004.webp', name: 'Satoru Gojo',
        content: 'What a great deck to play with!\nHope to be able to play here again!\nDefinitely an enjoyable experience.',
        effect: 'test'
    }, {
        src: '', photoURL: '/UD/JJK-2-003.webp', name: 'Suguru Getou',
        content: 'What a great deck to play with!\nHope to be able to play here again!\nDefinitely an enjoyable experience.',
        effect: 'test'
    }, {
        src: '/UD/JJK-2-003.webp', photoURL: '/UD/JJK-2-003.webp', name: 'Suguru Getou',
        content: 'What a great deck to play with!\nHope to be able to play here again!\nDefinitely an enjoyable experience.',
        effect: 'test'
    }, {
        src: '/UD/JJK-2-003.webp', photoURL: '/UD/JJK-2-003.webp', name: 'Suguru Getou',
        content: 'What a great deck to play with!\nHope to be able to play here again!\nDefinitely an enjoyable experience.',
        effect: 'test'
    }]
    const leftColumnCards = deckData.filter((_, index) => index % 2 === 0);
    const rightColumnCards = deckData.filter((_, index) => index % 2 !== 0);
    return (
        <Box sx={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            gap: '10px',
            overflow: 'auto',
            alignItems: 'start',
            height: 'calc(100vh - 204px)',
            paddingBottom: '50px',
            paddingTop: '20px',
            width: { xs: '100vw', sm: '100vw', md: 'calc(100vw - 100px)' },
        }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                {leftColumnCards.map((data, index) => (
                    <Box key={index} sx={{
                        paddingTop: '0px',
                        height: !data.description ? '190px' : (data.selectedCards[0].imagesrc ? '230px' : '120px'),
                        borderRadius: '10px',
                        width: '170px',
                        position: 'relative',
                        overflow: 'hidden',
                    }}>
                        <SingleCardStack data={data} index={index} />
                    </Box>
                ))}
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                {rightColumnCards.map((data, index) => (
                    <Box key={index} sx={{
                        paddingTop: '0px',
                        height: !data.description ? '180px' : (data.selectedCards[0].imagesrc ? '230px' : '120px'),
                        width: '170px',
                        borderRadius: '10px',
                        position: 'relative',
                        overflow: 'hidden',
                    }}>
                        <SingleCardStack data={data} index={index} />
                    </Box>
                ))}
            </Box>
        </Box>
    );
};

export default CardStackFlood
