import React, { useEffect, useState } from "react";
import { Box, Button, Grid } from "@mui/material";
import { setToLocalStorage } from "./LocalStorage/localStorageHelper";
import { AddCircle, RemoveCircle } from "@mui/icons-material";
import { useCardState } from "../context/useCardState";
import { ResponsiveImage } from "./ResponsiveImage";
import { Snackbar, Alert } from "@mui/material";
import { CardDrawerNF } from "./CardDrawerFormatted";

const TestRightBar = (props) => {
    const [documents, setDocuments] = useState([]);
    const [openModal, setOpenModal] = useState(false);
    const [selectedCard, setSelectedCard] = useState(null);
    const [totalCount, setTotalCount] = useState(0);
    const { countArray, setCountArray, filteredCards, setFilteredCards, setAnimeFilter } = useCardState(); // Use useCardState hook
    const [snackbarOpen, setSnackbarOpen] = useState(false);

    const handleOpenModal = (document) => {
        let currentImage = document.image
        setSelectedCard({
            ...document,
            currentImage: currentImage
        });
        setOpenModal(true);
    }

    const handleCloseModal = () => {
        setSelectedCard(null);
        setOpenModal(false);
    };

    const increase = (cardId) => {
        setCountArray((prevCountArray) => {
            const newArray = { ...prevCountArray };
    
            // Get the specific card's banRatio
            const card = filteredCards.find(doc => doc.cardId === cardId);
            // Use nullish coalescing to provide a default value of 4 if card.banRatio is not found
            const cardMaxCount = card?.banRatio ?? 4;
    
            if (!newArray[cardId]) {
                newArray[cardId] = 0;
            }
            if (newArray[cardId] < cardMaxCount) {
                newArray[cardId]++;
            }
            setToLocalStorage("countArray", newArray);
            return newArray; // Update the countArray state without triggering the updateFilteredCards function
        });
    };
    

    const decrease = (cardId) => {
        setCountArray((prevCountArray) => {
            const newArray = { ...prevCountArray };
            if (newArray[cardId] > 0) {
                newArray[cardId]--;
            }
            setToLocalStorage("countArray", newArray);
            return newArray; // Update the countArray state without triggering the updateFilteredCards function
        });
    };


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
        const initialCountArray = documents.reduce((accumulator, document) => {
            accumulator[document.cardId] = 0;
            return accumulator;
        }, {});

        setCountArray(initialCountArray);
    }, [documents]);

    useEffect(() => {
        const newTotalCount = Object.values(countArray).reduce((accumulator, count) => accumulator + count, 0);
        setTotalCount(newTotalCount);
    }, [countArray]);

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

    return (
        <div style={{ display: "flex", flexDirection: "column" }}>
            <br></br>
            <Grid style={{ overflowY: "auto", height: "100%" }}>
                <Grid container spacing={2} justifyContent="center">
                    {sortedCards.map((document) => (
                        countArray[document.cardId] > 0 && (
                            <Grid item key={document.cardId} style={{ alignSelf: "flex-start" }}>
                                <Box sx={{position:'relative'}}>
                                    <ResponsiveImage
                                        loading="lazy"
                                        src={document.image}
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
                                        <div component={Button} onClick={() => decrease(document.cardId)} style={{ cursor: "pointer" }}>
                                            <RemoveCircle sx={{ fontSize: 20 }} />
                                        </div>
                                        <span sx={{ fontSize: 20 }}>{countArray[document.cardId] || 0}</span>
                                        <div component={Button} onClick={() => increase(document.cardId)} style={{ cursor: "pointer" }}>
                                            <AddCircle sx={{ fontSize: 20 }} />
                                        </div>
                                    </Box>
                                </Box>
                            </Grid>
                        )
                    ))}
                    {selectedCard && (
                        <CardDrawerNF
                            open={openModal}
                            onClose={handleCloseModal}
                            selectedCard={selectedCard}
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