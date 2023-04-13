import React, { useEffect, useState } from "react";
import { db } from "../Firebase";
import { collection, getDocs } from "firebase/firestore";
import { Box, Button, Grid } from "@mui/material";
import { setToLocalStorage, getFromLocalStorage } from "./LocalStorage/localStorageHelper";
import { CardModal } from "./CardModal";
import { AddCircle, RemoveCircle } from "@mui/icons-material";
import { UAButtons } from "./UnionArenaButtonFilter";
import { useCardState } from "../context/useCardState";
import {ResponsiveImage} from "./ResponsiveImage";

const DBCardRef = () => {
    const [documents, setDocuments] = useState([]);
    const [openModal, setOpenModal] = useState(false);
    const [selectedCard, setSelectedCard] = useState(null);
    const [booster, setBooster] = useState("");
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

    return (
        <div>
            <Box display="flex" justifyContent="center" alignItems="center" flexWrap="wrap" flexShrink={"3"} flex={8} p={2} marginTop={2} marginBottom={4}>
                <Box position={"fixed"}>
                    <UAButtons
                        handleBoosterChange={handleBoosterChange}
                        boosterNames={["UABT01", "UABT02", "UABT03", "UAST01", "UAST02", "UAST03"]}
                    />
                </Box>
            </Box>
            <Grid container spacing={2} justifyContent="center">
                {documents.map((document, index) => (
                    <Grid item key={document.cardId}>
                        <Box onContextMenu={(event) => { event.preventDefault(); handleOpenModal(document); }} >
                            <ResponsiveImage
                                loading="lazy"
                                src={document.image}
                                draggable="false"
                                alt="test"
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
                ))}
                {selectedCard && (
                    <CardModal
                        open={openModal}
                        onClose={handleCloseModal}
                        selectedCard={selectedCard}
                    />
                )}
            </Grid>
        </div>
    );
}

export default DBCardRef