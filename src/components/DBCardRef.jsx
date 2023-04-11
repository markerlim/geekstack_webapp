import React, { useEffect, useState } from "react";
import { db } from "../Firebase";
import { collection, getDocs } from "firebase/firestore";
import { Box, Button, Grid } from "@mui/material";
import { setToLocalStorage, getFromLocalStorage } from "./LocalStorage/localStorageHelper";
import { CardModal } from "./CardModal";
import { AddCircle, RemoveCircle } from "@mui/icons-material";
import { UAButtons } from "./UnionArenaButtonFilter";

const DBCardRef = () => {
    const [documents, setDocuments] = useState([]);
    const [openModal, setOpenModal] = useState(false);
    const [selectedCard, setSelectedCard] = useState(null);
    const [booster, setBooster] = useState("");
    const [countArray, setCountArray] = useState([]);
    const [filteredCards, setFilteredCards] = useState([]);

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
        const newFilteredCards = documents.filter((doc, index) => updatedCountArray[index] > 0);
        setFilteredCards(newFilteredCards);
        setToLocalStorage("filteredCards", newFilteredCards); // Save filtered cards in local storage
    };

    const increase = (index) => {
        setCountArray((prevCountArray) => {
            const newArray = [...prevCountArray];
            if (newArray[index] < MAX_COUNT) {
                newArray[index] = (newArray[index] || 0) + 1;
            }
            setToLocalStorage("countArray", newArray);
            updateFilteredCards(newArray); // Call updateFilteredCards with the updated countArray
            return newArray;
        });
    };

    const decrease = (index) => {
        setCountArray((prevCountArray) => {
            const newArray = [...prevCountArray];
            if (newArray[index] > 0) {
                newArray[index] = newArray[index] - 1;
            }
            setToLocalStorage("countArray", newArray);
            updateFilteredCards(newArray); // Call updateFilteredCards with the updated countArray
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
        setCountArray(new Array(documents.length).fill(0));
    }, [documents]);


    return (
        <div>
            <Box display="flex" justifyContent="center" alignItems="center" flexWrap="wrap" flex={8} p={2} marginTop={2} marginBottom={4}>
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
                                draggable="false" alt="test" style={{ width: "200px", height: "281.235px", borderRadius: "5%", border: "2px solid black", cursor: "pointer" }}
                            />
                            <Box display={"flex"} flexDirection={"row"} gap={3} alignItems={"center"} justifyContent={"center"}>
                                <div component={Button} onClick={() => decrease(index)}><RemoveCircle /></div>
                                <span>{countArray[index]}</span>
                                <div component={Button} onClick={() => increase(index)}><AddCircle /></div>
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