import React, { useEffect, useState } from "react";
import { Box, Button, Grid } from "@mui/material";
import { CardDigimonModal } from "./CardDigimonModal";
import { AddCircle, RemoveCircle } from "@mui/icons-material";

const DTCGRightBar = ({filteredCards,countArray,setCountArray}) => {
    console.log(filteredCards)
    const [digimons, setDigimons] = useState(filteredCards);
    const [openModal, setOpenModal] = useState(false);
    const [selectedCard, setSelectedCard] = useState(null);
    const [imageWidth] = useState(100); // you can remove setImageWidth if you're not using it elsewhere
    const imageHeight = imageWidth * 1.395;

    const handleOpenModal = (digimon) => {
        setSelectedCard(digimon);   
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setSelectedCard(null);
        setOpenModal(false);
    };

    const increase = (cardId) => {
        setDigimons(prevDigimons => prevDigimons.map(card => {
            if (card.cardid === cardId) {
                return {
                    ...card,
                    count: (card.count || 0) + 1
                };
            }
            return card;
        }));
    };
    
    const decrease = (cardId) => {
        setDigimons(prevDigimons => prevDigimons.map(card => {
            if (card.cardid === cardId && card.count && card.count > 0) {
                return {
                    ...card,
                    count: card.count - 1
                };
            }
            return card;
        }));
    };
    useEffect(() => {
        const handleStorageChange = (e) => {
            if (e.key === 'filteredCards') {
                const updatedCards = e.newValue ? JSON.parse(e.newValue) : [];
                setDigimons(updatedCards); // Update the digimons state
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
        setDigimons(filteredCards);
    }, [filteredCards]);
    
    

    return (
        <>
            <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', flexWrap: 'wrap', gap: '20px' }}>
                    {digimons.map((digimon) => (
                        <Grid item key={digimon.cardid}>
                            <Box onClick={() => handleOpenModal(digimon)}>
                                <img
                                    loading="lazy"
                                    src={digimon.images}
                                    draggable="false"
                                    alt={digimon.cardid}
                                    width={imageWidth}
                                    height={imageHeight}
                                />
                            </Box>
                            <Box display={"flex"} flexDirection={"row"} gap={1} alignItems={"center"} justifyContent={"center"}>
                                <div component={Button} onClick={() => decrease(digimon.cardid)} style={{ cursor: "pointer" }}>
                                    <RemoveCircle sx={{ fontSize: 20 }} />
                                </div>
                                <span sx={{ fontSize: 20 }}>{digimon.count || 0}</span>
                                <div component={Button} onClick={() => increase(digimon.cardid)} style={{ cursor: "pointer" }}>
                                    <AddCircle sx={{ fontSize: 20 }} />
                                </div>
                            </Box>
                        </Grid>
                    ))}
                    {selectedCard && (
                        <CardDigimonModal
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

export default DTCGRightBar;
