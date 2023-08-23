import React, { useEffect, useState } from "react";
import { Box, Button, Grid } from "@mui/material";
import { AddCircle, RemoveCircle } from "@mui/icons-material";
import { CardOnepieceModal } from "./CardOnepieceModal";

const OPTCGRightBar = ({filteredCards}) => {
    console.log(filteredCards)
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

    const increase = (cardId) => {
        setOnepieces(prevonepieces => {
          const updatedonepieces = prevonepieces.map(onepiece => {
            if (onepiece.cardid === cardId) {
              return { ...onepiece, count: (onepiece.count || 0) + 1 };
            }
            return onepiece;
          });
          return updatedonepieces;
        });
      };
    
      const decrease = (cardId) => {
        setOnepieces(prevonepieces => {
          const updatedonepieces = prevonepieces.map(onepiece => {
            if (onepiece.cardid === cardId && onepiece.count && onepiece.count > 0) {
              return { ...onepiece, count: onepiece.count - 1 };
            }
            return onepiece;
          });
          return updatedonepieces;
        });
      };
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
