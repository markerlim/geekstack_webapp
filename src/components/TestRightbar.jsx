import React, { useEffect, useState } from "react";
import { db } from "../Firebase";
import { collection, getDocs } from "firebase/firestore";
import { Box, Button, Fab, Grid, Tooltip } from "@mui/material";
import { setToLocalStorage, getFromLocalStorage } from "./LocalStorage/localStorageHelper";
import { CardModal } from "./CardModal";
import { AddCircle, RemoveCircle, Save } from "@mui/icons-material";
import { useCardState } from "../context/useCardState";

const TestRightBar = () => {
    const [documents, setDocuments] = useState([]);
    const [openModal, setOpenModal] = useState(false);
    const [selectedCard, setSelectedCard] = useState(null);
    const [booster, setBooster] = useState("");
    const [totalCount, setTotalCount] = useState(0);
    const { countArray, setCountArray, filteredCards, setFilteredCards } = useCardState(); // Use useCardState hook

    const handleOpenModal = (document) => {
        setSelectedCard(document);
        setOpenModal(true);
    }

    const handleCloseModal = () => {
        setSelectedCard(null);
        setOpenModal(false);
    };

    const handleBoosterChange = (newBooster) => {
        setBooster(newBooster);
    };

    const MAX_COUNT = 4;

    const updateFilteredCards = (updatedCountArray) => {
        const newFilteredCards = documents.filter((doc) => updatedCountArray[doc.cardId] > 0)
            .map((doc) => ({ ...doc, count: updatedCountArray[doc.cardId] }));
        setFilteredCards(newFilteredCards);
        setToLocalStorage("filteredCards", newFilteredCards);
    };

    const increase = (cardId) => {
        setCountArray((prevCountArray) => {
            const newArray = { ...prevCountArray };
            if (!newArray[cardId]) {
                newArray[cardId] = 0;
            }
            if (newArray[cardId] < MAX_COUNT) {
                newArray[cardId]++;
            }
            setToLocalStorage("countArray", newArray);
            updateFilteredCards(newArray);
            return newArray;
        });
    };

    const decrease = (cardId) => {
        setCountArray((prevCountArray) => {
            const newArray = { ...prevCountArray };
            if (newArray[cardId] > 0) {
                newArray[cardId]--;
            }
            setToLocalStorage("countArray", newArray);
            updateFilteredCards(newArray);
            return newArray;
        });
    };

    useEffect(() => {
        const fetchDocuments = async () => {
            const querySnapshot = await getDocs(collection(db, "unionarenatcg"));
            const documentsArray = [];
            querySnapshot.forEach((doc) => {
                documentsArray.push(doc.data());
            });
            setToLocalStorage("documents", documentsArray);
        };

        const localDocuments = getFromLocalStorage("documents");
        if (localDocuments) {
            const filteredDocuments = booster
                ? localDocuments.filter((doc) => doc.booster === booster)
                : localDocuments;
            setDocuments(filteredDocuments);
        } else {
            fetchDocuments();
        }
    }, [booster]);

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

    return (
        <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ backgroundColor: "#121212", color: "white", padding: 20, position: "fixed", width: "100%" }}>
                DECKBUILDER
                Total Count: <span style={{ color: totalCount > 50 ? "red" : "inherit" }}>{totalCount}</span>
            </div>
            <Grid container spacing={2} justifyContent="center">
                {documents.map((document, index) => (
                    countArray[document.cardId] > 0 && (
                        <Grid item key={document.cardId}>
                            <Box onContextMenu={(event) => { event.preventDefault(); handleOpenModal(document); }} >
                                <img loading="lazy" src={document.image}
                                    draggable="false" alt="test" style={{ width: "200px", height: "281.235px", borderRadius: "5%", border: "2px solid black", cursor: "pointer" }}
                                />
                                <Box display={"flex"} flexDirection={"row"} gap={3} alignItems={"center"} justifyContent={"center"}>
                                    <div component={Button} onClick={() => decrease(document.cardId)}>
                                        <RemoveCircle />
                                    </div>
                                    <span>{countArray[document.cardId] || 0}</span>
                                    <div component={Button} onClick={() => increase(document.cardId)}>
                                        <AddCircle />
                                    </div>
                                </Box>
                            </Box>
                        </Grid>
                    )
                ))}
                {selectedCard && (
                    <CardModal
                        open={openModal}
                        onClose={handleCloseModal}
                        selectedCard={selectedCard}
                    />
                )}
            </Grid>
            <Tooltip title="Save Deck" sx={{ position: "fixed", bottom: 20, right: { xs: "calc(50% - 25px)", md: 30 } }}>
                <Fab color="primary" aria-label="add">
                    <Save />
                </Fab>
            </Tooltip>
        </div>
    );

}

export default TestRightBar