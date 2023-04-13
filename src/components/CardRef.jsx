import React, { useEffect, useState } from "react";
import { db } from "../Firebase";
import { collection, getDocs } from "firebase/firestore";
import { Box, Grid } from "@mui/material";
import { setToLocalStorage, getFromLocalStorage } from "./LocalStorage/localStorageHelper";
import { CardModal } from "./CardModal"
import { UAButtons } from "./UnionArenaButtonFilter";
import {ResponsiveImage} from "./ResponsiveImage";

const CardRef = () => {
    const [documents, setDocuments] = useState([]);
    const [openModal, setOpenModal] = useState(false);
    const [selectedCard, setSelectedCard] = useState(null);
    const [booster, setBooster] = useState("");

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


    return (
        <div>
            <Box display="flex" justifyContent="center" alignItems="center" flexWrap="wrap" marginTop={2} marginBottom={4}>
                <Box position={"fixed"}>
                    <UAButtons
                        handleBoosterChange={handleBoosterChange}
                        boosterNames={["UABT01", "UABT02", "UABT03", "UAST01", "UAST02", "UAST03"]}
                    />
                </Box>
            </Box>
            <Grid container spacing={2} justifyContent="center">
                {documents.map((document) => (
                    <Grid item key={document.cardId}>
                        <Box onClick={() => handleOpenModal(document)} >
                            <ResponsiveImage
                                loading="lazy"
                                src={document.image}
                                draggable="false"
                                alt="test"
                            />
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

export default CardRef