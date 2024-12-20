import React, { useEffect, useState } from "react";
import { Box, Grid } from "@mui/material";
import { CircularProgress } from '@mui/material';
import { ResponsiveImage } from "../ResponsiveImage";
import { CRBTCGCardDrawerNF } from "./CRBTCGCardDrawerFormatted";
import CookieRunButtonList from "./CookieRunBoosterButton";

const CRBTCGCardlist = ({ filters }) => {
    const [documents, setDocuments] = useState([]);
    const [openModal, setOpenModal] = useState(false);
    const [selectedCard, setSelectedCard] = useState(null);
    const [loading, setLoading] = useState(false);
    const [slowFetch, setSlowFetch] = useState(false);

    const getCurrentImage = (document) => {
        let currentImage = document.image;
        return currentImage;
    };
    const handleOpenModal = (document) => {
        const currentImage = getCurrentImage(document);
        setSelectedCard({
            ...document,
            currentImage: currentImage
        });
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setSelectedCard(null);
        setOpenModal(false);
    };

    return (
        <div>
            {filters.length === 0 && (
                <Box sx={{ display: "flex", flexDirection: "row", flexWrap: "wrap", gap: "20px", justifyContent: "center" }}>
                    <CookieRunButtonList />
                </Box>
            )}
            <div className="hide-scrollbar">
                {loading ? (
                    <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", marginTop: '-30vh', height: "86vh" }}>
                        <CircularProgress sx={{ color: "#74CFFF" }} />
                        {slowFetch && <Box mt={2}>This field has a large amount of data. Please wait a moment.</Box>}
                    </Box>
                ) : (
                    <Grid container spacing={2} justifyContent="center">
                        {documents.map((document) => (
                            <Grid item key={document.cardId}>
                                <Box onClick={() => handleOpenModal(document)}>
                                    <ResponsiveImage
                                        loading="lazy"
                                        src={document.image}
                                        draggable="false"
                                        alt="loading..."
                                    />
                                </Box>
                            </Grid>
                        ))}
                        {selectedCard && (
                            <CRBTCGCardDrawerNF
                                open={openModal}
                                onClose={handleCloseModal}
                                selectedCard={selectedCard}
                            />
                        )}
                    </Grid>
                )}
            </div>
        </div >
    );
}

export default CRBTCGCardlist;
