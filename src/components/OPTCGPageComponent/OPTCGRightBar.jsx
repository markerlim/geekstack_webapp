import React, { useEffect, useState } from "react";
import { Box, Button, Grid } from "@mui/material";
import { AddCircle, RemoveCircle } from "@mui/icons-material";
import { useCardState } from "../../context/useCardStateOnepiece";
import { OPTCGCardDrawer } from "./OPTCGCardDrawer";

const OPTCGRightBar = ({setChangeClick}) => {
    const { filteredCards, setFilteredCards } = useCardState(); // Use useCardState hook
    const [openModal, setOpenModal] = useState(false);
    const [selectedCard, setSelectedCard] = useState(null);
    const [imageWidth] = useState(100); // you can remove setImageWidth if you're not using it elsewhere
    const imageHeight = imageWidth * 1.395;

    const handleOpenModal = (onepiece) => {
        setSelectedCard(onepiece);
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setSelectedCard(null);
        setOpenModal(false);
    };

    const modifyCardCount = (cardId, change) => {
        const updatedCards = filteredCards.map(card => {
            if (card.cardid === cardId) {
                let newCount = (card.count || 0) + change;
                newCount = Math.max(0, Math.min(4, newCount));
                return { ...card, count: newCount };
            }
            return card;
        }).filter(card => card.count > 0);

        setFilteredCards(updatedCards);
        setChangeClick(prevState => !prevState);
    };

    const increase = (cardId) => modifyCardCount(cardId, 1);
    const decrease = (cardId) => modifyCardCount(cardId, -1);
    
    return (
        <>
            <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', flexWrap: 'wrap', gap: '20px', paddingTop: '20px' }}>
                    {filteredCards.map((onepiece) => (
                        <Grid item key={onepiece.cardid}>
                            <Box onClick={() => handleOpenModal(onepiece)}>
                                <img
                                    loading="lazy"
                                    src={onepiece.image}
                                    draggable="false"
                                    alt={onepiece.cardid}
                                    width={imageWidth}
                                    height={imageHeight}
                                />
                            </Box>
                            <Box display={"flex"} flexDirection={"row"} gap={1} alignItems={"center"} justifyContent={"center"}>
                                <div component={Button} onClick={() => decrease(onepiece.cardid)} style={{ cursor: "pointer" }}>
                                    <RemoveCircle sx={{ fontSize: 20 }} />
                                </div>
                                <span sx={{ fontSize: 20 }}>{onepiece.count || 0}</span>
                                <div component={Button} onClick={() => increase(onepiece.cardid)} style={{ cursor: "pointer" }}>
                                    <AddCircle sx={{ fontSize: 20 }} />
                                </div>
                            </Box>
                        </Grid>
                    ))}
                    {selectedCard && (
                        <OPTCGCardDrawer
                            open={openModal}
                            onClose={handleCloseModal}
                            selectedCard={selectedCard}
                        />
                    )}
                </Box>
            </Box>
        </>
    );
};

export default OPTCGRightBar;
