import React, { useEffect, useState } from "react";
import { db } from "../Firebase";
import { collection, getDocs } from "firebase/firestore";
import { Box, Button, Grid } from "@mui/material";
import { setToLocalStorage, getFromLocalStorage } from "./LocalStorage/localStorageHelper";
import { CardModal } from "./CardModal";
import { AddCircle, RemoveCircle } from "@mui/icons-material";
import { useCardState } from "../context/useCardState";
import { ResponsiveImage } from "./ResponsiveImage";

const TestRightBar = () => {
    const [documents, setDocuments] = useState([]);
    const [openModal, setOpenModal] = useState(false);
    const [selectedCard, setSelectedCard] = useState(null);
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


    const handleLocalStorageUpdate = (event) => {
        if (event.key === "filteredCards") {
            const newFilteredCards = JSON.parse(event.newValue);
            setFilteredCards(newFilteredCards);
        }
        if (event.key === "countArray") {
            const newCountArray = JSON.parse(event.newValue);
            setCountArray(newCountArray);
        }
    };

    useEffect(() => {
        window.addEventListener("storage", handleLocalStorageUpdate);

        return () => {
            window.removeEventListener("storage", handleLocalStorageUpdate);
        };
    }, []);


    useEffect(() => {
        const fetchDocuments = async () => {
            const querySnapshot = await getDocs(collection(db, "unionarenatcg"));
            const documentsArray = [];
            querySnapshot.forEach((doc) => {
                documentsArray.push(doc.data());
            });
            setToLocalStorage("documents", documentsArray);

            // Initialize countArray with all cardIds and a count of zero
            const initialCountArray = documentsArray.reduce((accumulator, document) => {
                accumulator[document.cardId] = 0;
                return accumulator;
            }, {});

            setCountArray(prevCountArray => {
                // If countArray is empty, set it to initialCountArray
                if (Object.keys(prevCountArray).length === 0) {
                    return initialCountArray;
                }
                return prevCountArray;
            });
        };

        const localDocuments = getFromLocalStorage("documents");
        if (localDocuments) {
            setDocuments(localDocuments);
        } else {
            fetchDocuments();
        }
    }, []);


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
        <div style={{ display: "flex", flexDirection: "column"}}>
                <Grid style={{ overflowY: "auto", height: "100%" }}>
                        <Grid container spacing={2} justifyContent="center">
                            {documents.map((document) => (
                                countArray[document.cardId] > 0 && (
                                    <Grid item key={document.cardId} style={{ alignSelf: "flex-start" }}>
                                        <Box onContextMenu={(event) => { event.preventDefault(); handleOpenModal(document); }} >
                                            <ResponsiveImage
                                                loading="lazy"
                                                src={document.image}
                                                draggable="false"
                                                alt="test"
                                            />
                                            <Box display={"flex"} flexDirection={"row"} gap={3} alignItems={"center"} justifyContent={"center"}>
                                                <div component={Button} onClick={() => decrease(document.cardId)} style={{ cursor: "pointer" }}>
                                                    <RemoveCircle />
                                                </div>
                                                <span>{countArray[document.cardId] || 0}</span>
                                                <div component={Button} onClick={() => increase(document.cardId)} style={{ cursor: "pointer" }}>
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
                </Grid>
        </div>
    );
}

export default TestRightBar