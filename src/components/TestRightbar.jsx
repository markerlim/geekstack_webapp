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

    const increase = (cardId, cardUid) => {
        setCountArray((prevCountArray) => {
            const newArray = { ...prevCountArray };
    
            // Find all instances of the specific cardId in filteredCards
            const cardInstances = filteredCards.filter((card) => card.cardId === cardId);
    
            // Calculate the total count for all instances of this cardId
            const totalCardCount = cardInstances.reduce((acc, card) => acc + (newArray[card.cardUid] || 0), 0);
    
            // Get the banRatio for the cardId
            const banRatio = cardInstances.length > 0 ? cardInstances[0].banRatio : 4;
    
            // Check if increasing the count will exceed the banRatio
            if (totalCardCount < banRatio) {
                // Increase count for the specified cardUid
                newArray[cardUid] = (newArray[cardUid] || 0) + 1;
    
                // Update filteredCards with the updated count
                const updatedFilteredCards = filteredCards.map((card) => {
                    if (card.cardUid === cardUid) {
                        return { ...card, count: (card.count || 0) + 1 };
                    }
                    return card;
                });
                setFilteredCards(updatedFilteredCards);
                setToLocalStorage("filteredCards", updatedFilteredCards);
            } else {
                // Notify or handle the situation where the banRatio is reached
                console.log("Cannot increase count. Ban ratio reached.");
            }
    
            // Update countArray with the new count
            setToLocalStorage("countArray", newArray);
    
            return newArray;
        });
    };
    
    
    const decrease = (cardId, cardUid) => {
        setCountArray((prevCountArray) => {
            const newArray = { ...prevCountArray };
    
            // Find the specific card in filteredCards
            const updatedFilteredCards = filteredCards.map((card) => {
                if (card.cardId === cardId && card.count > 0) {
                    // Decrease count and return the updated card
                    return { ...card, count: card.count - 1 };
                }
                return card;
            });
    
            // Update filteredCards with the updated card
            setFilteredCards(updatedFilteredCards);
    
            // Update local storage
            setToLocalStorage("filteredCards", updatedFilteredCards);
    
            // Update countArray, ensuring it doesn't go below zero
            if (newArray[cardUid] > 0) {
                newArray[cardUid]--;
            }
            setToLocalStorage("countArray", newArray);
    
            return newArray;
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
                        countArray[document.cardUid] > 0 && (
                            <Grid item key={document.cardUid} style={{ alignSelf: "flex-start" }}>
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
                                        <div component={Button} onClick={() => decrease(document.cardId,document.cardUid)} style={{ cursor: "pointer" }}>
                                            <RemoveCircle sx={{ fontSize: 20 }} />
                                        </div>
                                        <span sx={{ fontSize: 20 }}>{countArray[document.cardUid] || 0}</span>
                                        <div component={Button} onClick={() => increase(document.cardId,document.cardUid)} style={{ cursor: "pointer" }}>
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