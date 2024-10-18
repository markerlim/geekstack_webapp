import React, { useEffect, useState } from "react";
import { Box, Button, Grid } from "@mui/material";
import { setToLocalStorage } from "./LocalStorage/localStorageHelper";
import { AddCircle, RemoveCircle } from "@mui/icons-material";
import { useCardState } from "../context/useCardState";
import { ResponsiveImage } from "./ResponsiveImage";
import { Snackbar, Alert } from "@mui/material";
import { CardDrawerNF } from "./CardDrawerFormatted";
import { CardDrawerNFV2 } from "./CardDrawerV2";
import { collection, getDocs, limit, query, where } from "firebase/firestore";
import { db } from "../Firebase";

const TestRightBar = ({ setChangeClick }) => {
    const [openModal, setOpenModal] = useState(false);
    const { filteredCards, setFilteredCards, setAnimeFilter } = useCardState(); // Use useCardState hook
    const [chosenCard, setChosenCard] = useState(null);
    const [snackbarOpen, setSnackbarOpen] = useState(false);

    const handleOpenModal = (document) => {
        searchSingleCard(document.cardUid);
        setOpenModal(true);
    }

    const handleCloseModal = () => {
        setChosenCard(null);
        setOpenModal(false);
    };

    const handleSwipeLeft = () => {
        let currentIndex = sortedCards.findIndex((doc) => doc.cardUid === chosenCard.cardUid);
        let nextIndex = (currentIndex + 1) % sortedCards.length;
        let nextDocument = sortedCards[nextIndex];
        searchSingleCard(nextDocument.cardUid);
    };
    const handleSwipeRight = () => {
        let currentIndex = sortedCards.findIndex((doc) => doc.cardUid === chosenCard.cardUid);
        let prevIndex = (currentIndex - 1 + sortedCards.length) % sortedCards.length;
        let prevDocument = sortedCards[prevIndex];
        searchSingleCard(prevDocument.cardUid);

    };

    const modifyCardCount = (cardId, cardUid, change) => {
        // Filter cards with the same cardId
        const cardsWithSameId = filteredCards.filter(card => card.cardId === cardId);
        // Count the total number of cards with the same cardId
        const countOfSameId = cardsWithSameId.reduce((total, card) => total + card.count, 0);

        const banRatio = cardsWithSameId.length > 0 ? cardsWithSameId[0].banRatio : 4;

        // Check if adding 'change' cards would exceed the limit of 4 cards with the same cardId
        if (countOfSameId + change <= banRatio) {
            // Find the index of the existing card in filteredCards based on cardUid
            const existingCardIndex = filteredCards.findIndex(card => card.cardUid === cardUid);

            // If the card with cardUid exists
            if (existingCardIndex !== -1) {
                const existingCard = filteredCards[existingCardIndex];
                const newCount = Math.max(0, existingCard.count + change);

                // If newCount becomes 0, remove the card from filteredCards
                if (newCount === 0) {
                    setFilteredCards(prevFilteredCards => prevFilteredCards.filter(card => card.cardUid !== cardUid));
                } else {
                    // Update the count of the existing card
                    setFilteredCards(prevFilteredCards => {
                        const updatedCards = [...prevFilteredCards];
                        updatedCards[existingCardIndex] = { ...existingCard, count: newCount };
                        return updatedCards;
                    });
                }
            }
        }
        // Toggle the state of changeClick
        setChangeClick(prevState => !prevState);
    };

    const increase = (cardId, cardUid) => modifyCardCount(cardId, cardUid, 1);
    const decrease = (cardId, cardUid) => modifyCardCount(cardId, cardUid, -1);


    const areCardsFromSameAnime = (cards) => {
        if (cards.length === 0) {
            return true;
        }

        const firstAnime = cards[0].anime;
        return cards.every((card) => card.anime === firstAnime);
    };

    const [sortedCards, setSortedCards] = useState(filteredCards);

    useEffect(() => {
        if (!areCardsFromSameAnime(filteredCards)) {
            setSnackbarOpen(true);
        } else {
            setSnackbarOpen(false);
        }
    }, [filteredCards]);

    useEffect(() => {
        const sorted = [...filteredCards].sort((a, b) => {
            if (a.category === b.category) {
                return a.energycost - b.energycost;
            }
            return a.category.localeCompare(b.category);
        });
        setSortedCards(sorted);
    }, [filteredCards]);

    useEffect(() => {
        // This will set the anime filter based on the anime of the first card
        // in the sortedCards array (if there are any cards in the array)
        if (sortedCards.length > 0) {
            setAnimeFilter(sortedCards[0].anime);
        }
    }, [sortedCards]);

    // Search function to fetch a single card by cardUid
    const searchSingleCard = async (cardUid) => {
        if (!cardUid) {
            setChosenCard(null); // Clear the previous search result
            return;
        }

        try {
            const cardQuery = query(
                collection(db, "unionarenatcgV2"),
                where("cardUid", "==", cardUid), // Use cardUid for the query
                limit(1) // Limit the query to 1 result
            );

            const querySnapshot = await getDocs(cardQuery);

            if (!querySnapshot.empty) {
                const singleCard = querySnapshot.docs[0]?.data(); // Get the first card
                console.log("searched", singleCard)
                setChosenCard(singleCard); // Set the single card as the result
            } else {
                setChosenCard(null); // No card found
            }
        } catch (error) {
            console.error("Error fetching card by cardUid: ", error);
        }
    };

    return (
        <div style={{ display: "flex", flexDirection: "column" }}>
            <br></br>
            <Grid style={{ overflowY: "auto", height: "100%" }}>
                <Grid container spacing={2} justifyContent="center">
                    {sortedCards.map((document) => (
                        <Grid item key={document.cardUid} style={{ alignSelf: "flex-start" }}>
                            <Box sx={{ position: 'relative' }}>
                                <ResponsiveImage
                                    key={document.cardUid}
                                    loading="lazy"
                                    src={document.urlimage || document.image}
                                    draggable="false"
                                    alt="loading..."
                                    onClick={() => handleOpenModal(document)}
                                />
                                {
                                    document.banRatio !== "4" && document.banRatio != null && (
                                        <Box sx={{ width: '25px', color: '#f2f3f8', height: '25px', borderRadius: '12.5px', backgroundColor: '#240056', position: 'absolute', display: 'flex', justifyContent: 'center', alignItems: 'center', top: '5px', right: '5px' }}>
                                            {document.banRatio}
                                        </Box>
                                    )
                                }
                                <Box display={"flex"} flexDirection={"row"} gap={1} alignItems={"center"} justifyContent={"center"}>
                                    <div component={Button} onClick={() => decrease(document.cardId, document.cardUid)} style={{ cursor: "pointer" }}>
                                        <RemoveCircle sx={{ fontSize: 20 }} />
                                    </div>
                                    <span sx={{ fontSize: 20 }}>{document.count || 0}</span>
                                    <div component={Button} onClick={() => increase(document.cardId, document.cardUid)} style={{ cursor: "pointer" }}>
                                        <AddCircle sx={{ fontSize: 20 }} />
                                    </div>
                                </Box>
                            </Box>
                        </Grid>
                    ))}
                    {chosenCard && (
                        <CardDrawerNFV2
                            open={openModal}
                            onClose={handleCloseModal}
                            chosenCard={chosenCard}
                            onSwipeLeft={handleSwipeLeft}
                            onSwipeRight={handleSwipeRight}
                        />
                    )}
                </Grid>
            </Grid>
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={() => setSnackbarOpen(false)}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            >
                <Alert onClose={() => setSnackbarOpen(false)} severity="warning" sx={{ width: "100%" }}>
                    Please ensure all cards are from the same anime.
                </Alert>
            </Snackbar>
        </div>
    );
}

export default TestRightBar