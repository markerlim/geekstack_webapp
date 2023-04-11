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

    // Function to update filtered cards array
    const updateFilteredCards = (index, updatedCountArray) => {
        setFilteredCards((prevFilteredCards) => {
            const newFilteredCards = [...prevFilteredCards];
            const card = {
                ...filteredCards[index],
                count: updatedCountArray[index],
            };
            if (updatedCountArray[index] > 0) {
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

    // Function to increase card count
    const increase = (index) => {
        const cardId = filteredCards[index].cardId;
        const cardIndex = filteredCards.findIndex((item) => item.cardId === cardId);
        const count = filteredCards[cardIndex].count;

        setCountArray((prevCountArray) => {
            const newArray = [...prevCountArray];
            if (count < MAX_COUNT) {
                newArray[cardIndex] = count + 1;
                setToLocalStorage("countArray", newArray);
                updateFilteredCards(index, newArray); // Pass the updated countArray
                return newArray;
            }
            return prevCountArray;
        });
    };

    // Function to decrease card count
    const decrease = (index) => {
        const cardId = filteredCards[index].cardId;
        const cardIndex = filteredCards.findIndex((item) => item.cardId === cardId);
        const count = filteredCards[cardIndex].count;

        setCountArray((prevCountArray) => {
            const newArray = [...prevCountArray];
            if (count > 0) {
                newArray[cardIndex] = count - 1;
                setToLocalStorage("countArray", newArray);
                updateFilteredCards(index, newArray); // Pass the updated countArray
                return newArray;
            }
            return prevCountArray;
        });
    };

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
                const newCountArray = filteredCards.map((card) => card.count || 0);
                setCountArray(newCountArray);
                setToLocalStorage("countArray", newCountArray);
            }
        };

        initCountArray();
    }, []);




    return (
        <Grid container spacing={2} justifyContent="center">
            {filteredCards.map((document, index) => (
                <Grid item key={document.cardId}>
                    {countArray[index] === 0 && (
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
                                <div component={Button} onClick={() => decrease(index)}>
                                    <RemoveCircle />
                                </div>
                                <span>{countArray[index]}</span>
                                <div component={Button} onClick={() => increase(index)}>
                                    <AddCircle />
                                </div>
                            </Box>
                        </Box>
                    )}
                </Grid>
            ))}
            {selectedCard && (
                <CardModal
                    open={openModal}
                    onClose={handleCloseModal}
                    selectedCard={selectedCard}
                />
            )}
        </Grid>
    );
};

export default RightBar;
