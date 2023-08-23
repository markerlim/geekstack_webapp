import React, { useEffect, useState } from "react";
import { Box, Button, Grid } from "@mui/material";
import { AddCircle, RemoveCircle } from "@mui/icons-material";
import { CardOnepieceModal } from "./CardOnepieceModal";
import { useCardState } from "../../context/useCardState";

const OPTCGRightBar = () => {
    const { filteredCards, setFilteredCards } = useCardState(); // Use useCardState hook
    const [onepieces, setOnepieces] = useState(filteredCards);
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
                // Ensure count is at least 0
                const newCount = Math.max((card.count || 0) + change, 0);
                return { ...card, count: newCount };
            }
            return card;
        }).filter(card => card.count > 0); // This line filters out the cards with zero count
    
        setFilteredCards(updatedCards);
    };
    

    const increase = (cardId) => modifyCardCount(cardId, 1);
    const decrease = (cardId) => modifyCardCount(cardId, -1);

    useEffect(() => {
        const handleStorageChange = (e) => {
            if (e.key === 'filteredCards') {
                const updatedCards = e.newValue ? JSON.parse(e.newValue) : [];
                setOnepieces(updatedCards); // Update the onepieces state
            }
        };
        
        // Listen to storage events across tabs
        window.addEventListener('storage', handleStorageChange);
        
        return () => {
            // Clean up the event listener
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);

    useEffect(() => {
        setOnepieces(filteredCards);
    }, [filteredCards]);
    
    
    return (
        <>
            <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', flexWrap: 'wrap', gap: '20px',paddingTop:'20px' }}>
                    {onepieces.map((onepiece) => (
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
                        <CardOnepieceModal
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
