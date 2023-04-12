import React, { useEffect, useState } from "react";
import { db } from "../Firebase";
import { collection, getDocs } from "firebase/firestore";
import { Box, Button, Grid } from "@mui/material";
import { setToLocalStorage, getFromLocalStorage } from "./LocalStorage/localStorageHelper";
import { CardModal } from "./CardModal";
import { AddCircle, RemoveCircle } from "@mui/icons-material";
import { UAButtons } from "./UnionArenaButtonFilter";
import { useCardState } from "../context/useCardState";

const DBCardRef = () => {
    const [documents, setDocuments] = useState([]);
    const [openModal, setOpenModal] = useState(false);
    const [selectedCard, setSelectedCard] = useState(null);
    const [booster, setBooster] = useState("");
    const { countArray, setCountArray, filteredCards, setFilteredCards } = useCardState(); // Use useCardState hook

    const handleResize = () => {
        setImageStyle(getImageStyle());
    };

    const getImageStyle = () => {
        const screenWidth = window.innerWidth;

        if (screenWidth >= 992) {
            return { width: "200px", height: "281.235px" };
        } else if (screenWidth >= 768) {
            return { width: "150px", height: "210.92625px" };
        } else if (screenWidth >= 576) {
            return { width: "100px", height: "140.6175px" };
        } else {
            return { width: "100px", height: "140.6175px" }; // Default for smaller screens
        }
    };

    const [imageStyle, setImageStyle] = useState(getImageStyle());

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
        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

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
                            <img loading="lazy" src={document.image}
                                draggable="false" alt="test"
                                style={{
                                    ...imageStyle,
                                    borderRadius: "5%",
                                    border: "2px solid black",
                                    cursor: "pointer",
                                }}
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