import React, { useState } from "react";
import { Box, Button, Grid } from "@mui/material";
import { AddCircle, RemoveCircle } from "@mui/icons-material";
import { useDBZCardState } from "../../context/useCardStateDragonballz";
import { DBZCardDrawerNF } from "./DBZCardDrawerFormatted";

const DBZFWRightBar = ({setChangeClick}) => {
    const { filteredCards, setFilteredCards } = useDBZCardState(); // Use useOPCardState hook
    const [openModal, setOpenModal] = useState(false);
    const [selectedCard, setSelectedCard] = useState(null);
    const [imageWidth] = useState(100); // you can remove setImageWidth if you're not using it elsewhere
    const imageHeight = imageWidth * 1.395;

    const handleOpenModal = (dragonball) => {
        setSelectedCard(dragonball);
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setSelectedCard(null);
        setOpenModal(false);
    };

    const modifyCardCount = (cardId, cardUid, change) => {
        // Filter cards with the same cardId
        const cardsWithSameId = filteredCards.filter(card => card.cardId === cardId);
        // Count the total number of cards with the same cardId
        const countOfSameId = cardsWithSameId.reduce((total, card) => total + card.count, 0);
      
        // Check if adding 'change' cards would exceed the limit of 4 cards with the same cardId
        if (countOfSameId + change <= 4) {
          // Find the index of the existing card in filteredCards based on cardUid
          const existingCardIndex = filteredCards.findIndex(card => card.cardUid === cardUid);
      
          // If the card with cardUid exists
          if (existingCardIndex !== -1) {
            const existingCard = filteredCards[existingCardIndex];
            const newCount = Math.max(0, existingCard.count + change);
      
            // If newCount becomes 0, remove the card from filteredCards
            if (newCount === 0) {
              setFilteredCards(prevFilteredCards => prevFilteredCards.filter(card => card.cardUid !== cardUid));
            } else {
              // Update the count of the existing card
              setFilteredCards(prevFilteredCards => {
                const updatedCards = [...prevFilteredCards];
                updatedCards[existingCardIndex] = { ...existingCard, count: newCount };
                return updatedCards;
              });
            }
          }
        }
        // Toggle the state of changeClick
        setChangeClick(prevState => !prevState);
      };
      
      const increase = (cardId, cardUid) => modifyCardCount(cardId, cardUid, 1);
      const decrease = (cardId, cardUid) => modifyCardCount(cardId, cardUid, -1);
      
    
    return (
        <>
            <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', flexWrap: 'wrap', gap: '20px', paddingTop: '20px' }}>
                    {filteredCards.map((dragonball) => (
                        <Grid item key={dragonball.cardUid}>
                            <Box onClick={() => handleOpenModal(dragonball)}>
                                <img
                                    loading="lazy"
                                    src={dragonball.image}
                                    draggable="false"
                                    alt={dragonball.cardUid}
                                    width={imageWidth}
                                    height={imageHeight}
                                />
                            </Box>
                            <Box display={"flex"} flexDirection={"row"} gap={1} alignItems={"center"} justifyContent={"center"}>
                                <div component={Button} onClick={() => decrease(dragonball.cardId,dragonball.cardUid)} style={{ cursor: "pointer" }}>
                                    <RemoveCircle sx={{ fontSize: 20 }} />
                                </div>
                                <span sx={{ fontSize: 20 }}>{dragonball.count || 0}</span>
                                <div component={Button} onClick={() => increase(dragonball.cardId,dragonball.cardUid)} style={{ cursor: "pointer" }}>
                                    <AddCircle sx={{ fontSize: 20 }} />
                                </div>
                            </Box>
                        </Grid>
                    ))}
                    {selectedCard && (
                        <DBZCardDrawerNF
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

export default DBZFWRightBar;
