import React, { useState } from "react";
import { Box, Button, Grid } from "@mui/material";
import { AddCircle, RemoveCircle } from "@mui/icons-material";
import { CRBTCGCardDrawerNF } from "./CRBTCGCardDrawerFormatted";
import { useCRBCardState } from "../../context/useCardStateCookieRun";

const CRBTCGRightBar = ({ setChangeClick }) => {
  const { filteredCards, setFilteredCards } = useCRBCardState(); // Use useCRBCardState hook
  const [openModal, setOpenModal] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const [imageWidth] = useState(100); // you can remove setImageWidth if you're not using it elsewhere
  const imageHeight = imageWidth * 1.395;

  const handleOpenModal = (cookies) => {
    setSelectedCard(cookies);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setSelectedCard(null);
    setOpenModal(false);
  };

  const modifyCardCount = (cardId, cardUid, change) => {
    // Filter cards with the same cardId
    const cardsWithSameId = filteredCards.filter(
      (card) => card.cardId === cardId
    );
    // Count the total number of cards with the same cardId
    const countOfSameId = cardsWithSameId.reduce(
      (total, card) => total + card.count,
      0
    );

    // Check if adding 'change' cards would exceed the limit of 4 cards with the same cardId
    if (countOfSameId + change <= 4) {
      // Find the index of the existing card in filteredCards based on cardUid
      const existingCardIndex = filteredCards.findIndex(
        (card) => card.cardUid === cardUid
      );

      // If the card with cardUid exists
      if (existingCardIndex !== -1) {
        const existingCard = filteredCards[existingCardIndex];
        const newCount = Math.max(0, existingCard.count + change);

        // If newCount becomes 0, remove the card from filteredCards
        if (newCount === 0) {
          setFilteredCards((prevFilteredCards) =>
            prevFilteredCards.filter((card) => card.cardUid !== cardUid)
          );
        } else {
          // Update the count of the existing card
          setFilteredCards((prevFilteredCards) => {
            const updatedCards = [...prevFilteredCards];
            updatedCards[existingCardIndex] = {
              ...existingCard,
              count: newCount,
            };
            return updatedCards;
          });
        }
      }
    }
    setChangeClick((prevState) => !prevState);
  };

  const increase = (cardId, cardUid) => modifyCardCount(cardId, cardUid, 1);
  const decrease = (cardId, cardUid) => modifyCardCount(cardId, cardUid, -1);
  const cardTypeOrder = ["cookie", "item", "trap", "stage"];

  // Sort filteredCards by cardType and then by cardLevelTitle (only for cookie type)
  const sortedCards = [...filteredCards].sort((a, b) => {
    const typeOrderA = cardTypeOrder.indexOf(a.cardType);
    const typeOrderB = cardTypeOrder.indexOf(b.cardType);

    // Sort by cardType first
    if (typeOrderA !== typeOrderB) {
      return typeOrderA - typeOrderB;
    }

    // For 'cookie' cards, sort by cardLevelTitle
    if (a.cardType === "cookie" && b.cardType === "cookie") {
      return a.cardLevelTitle.localeCompare(b.cardLevelTitle);
    }

    // No further sorting for other card types
    return 0;
  });

  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            flexWrap: "wrap",
            gap: "20px",
            paddingTop: "20px",
          }}
        >
          {sortedCards.map((cookies) => (
            <Grid item key={cookies.cardUid}>
              <Box onClick={() => handleOpenModal(cookies)}>
                <img
                  loading="lazy"
                  src={cookies.urlimage}
                  draggable="false"
                  alt={cookies.cardUid}
                  width={imageWidth}
                  height={imageHeight}
                />
              </Box>
              <Box
                display={"flex"}
                flexDirection={"row"}
                gap={1}
                alignItems={"center"}
                justifyContent={"center"}
              >
                <div
                  component={Button}
                  onClick={() => decrease(cookies.cardId, cookies.cardUid)}
                  style={{ cursor: "pointer" }}
                >
                  <RemoveCircle sx={{ fontSize: 20 }} />
                </div>
                <span sx={{ fontSize: 20 }}>{cookies.count || 0}</span>
                <div
                  component={Button}
                  onClick={() => increase(cookies.cardId, cookies.cardUid)}
                  style={{ cursor: "pointer" }}
                >
                  <AddCircle sx={{ fontSize: 20 }} />
                </div>
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
        </Box>
      </Box>
    </>
  );
};

export default CRBTCGRightBar;
