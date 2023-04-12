import React, { useEffect, useState } from "react";
import { Box, Button, Grid } from "@mui/material";
import { CardModal } from "./CardModal";
import { AddCircle, RemoveCircle } from "@mui/icons-material";
import { useCardState } from "../context/useCardState";
import { getFromLocalStorage, setToLocalStorage } from "./LocalStorage/localStorageHelper";

const RightBar = () => {
    const { filteredCards, setFilteredCards, countArray, setCountArray } =
        useCardState();
    const [openModal, setOpenModal] = useState(false);
    const [selectedCard, setSelectedCard] = useState(null);

    const handleOpenModal = (document) => {
        setSelectedCard(document);
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setSelectedCard(null);
        setOpenModal(false);
    };

    const MAX_COUNT = 4;

    // Function to update countArray based on filteredCards
    const updateCountArray = (cardId, count, callback) => {
        setCountArray((prevCountArray) => {
            const updatedCountArray = { ...prevCountArray, [cardId]: count };
            setToLocalStorage("countArray", updatedCountArray);

            // Call the callback function with the updated count array
            if (callback) {
                callback(updatedCountArray);
            }

            return updatedCountArray;
        });
    };

    // Function to increase card count
    const increase = (cardId) => {
        const count = countArray[cardId] || 0;

        if (count < MAX_COUNT) {
            updateCountArray(cardId, count + 1, (updatedCountArray) => {
                const index = filteredCards.findIndex((item) => item.cardId === cardId);
                updateFilteredCards(index, updatedCountArray);
            });
        }
    };

    // Function to decrease card count
    const decrease = (cardId) => {
        const count = countArray[cardId] || 0;

        if (count > 0) {
            updateCountArray(cardId, count - 1, (updatedCountArray) => {
                const index = filteredCards.findIndex((item) => item.cardId === cardId);
                updateFilteredCards(index, updatedCountArray);
            });
        }
    };

    // Function to update filtered cards array
    const updateFilteredCards = (index, updatedCountArray) => {
        setFilteredCards((prevFilteredCards) => {
            const newFilteredCards = [...prevFilteredCards];
            const card = {
                ...filteredCards[index],
                count: updatedCountArray[filteredCards[index].cardId],
            };
            if (updatedCountArray[filteredCards[index].cardId] > 0) {
                const existingIndex = newFilteredCards.findIndex(
                    (item) => item.cardId === card.cardId
                );
                if (existingIndex !== -1) {
                    newFilteredCards[existingIndex] = card;
                } else {
                    newFilteredCards.push(card);
                }
            } else {
                const cardIndex = newFilteredCards.findIndex(
                    (item) => item.cardId === filteredCards[index].cardId
                );
                if (cardIndex !== -1) {
                    newFilteredCards.splice(cardIndex, 1);
                }
            }
            setToLocalStorage("filteredCards", newFilteredCards);
            return newFilteredCards;
        });
    };

    // ...

    useEffect(() => {
        const initCountArray = () => {
            const localFilteredCards = getFromLocalStorage("filteredCards");
            if (localFilteredCards) {
                setFilteredCards(localFilteredCards);
            }

            const localCountArray = getFromLocalStorage("countArray");
            if (localCountArray) {
                setCountArray(localCountArray);
            } else {
                const newCountArray = {};
                setCountArray(newCountArray);
                setToLocalStorage("countArray", newCountArray);
            }
        };

        initCountArray();
    }, []);

    // ...

    return (
        <Grid container spacing={2} justifyContent="center">
            {filteredCards.map((document, index) => (
                <Grid item key={document.cardId}>
                    <Box
                        onContextMenu={(event) => {
                            event.preventDefault();
                            handleOpenModal(document);
                        }}
                    >
                        <img
                            loading="lazy"
                            src={document.image}
                            draggable="false"
                            alt="test"
                            style={{
                                width: "200px",
                                height: "281.235px",
                                borderRadius: "5%",
                                border: "2px solid black",
                                cursor: "pointer",
                            }}
                        />
                        <Box
                            display={"flex"}
                            flexDirection={"row"}
                            gap={3}
                            alignItems={"center"}
                            justifyContent={"center"}
                        >
                            <Button onClick={() => decrease(document.cardId)}>
                                <RemoveCircle />
                            </Button>
                            <span>{countArray[document.cardId] || 0}</span>
                            <Button onClick={() => increase(document.cardId)}>
                                <AddCircle />
                            </Button>
                        </Box>
                    </Box>
                </Grid>
            ))
            }
            {
                selectedCard && (
                    <CardModal
                        open={openModal}
                        onClose={handleCloseModal}
                        selectedCard={selectedCard}
                    />
                )
            }
        </Grid >
    );
};

export default RightBar;
