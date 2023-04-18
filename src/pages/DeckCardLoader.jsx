import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../Firebase";
import { useAuth } from "../context/AuthContext";
import { Box, Grid, Stack} from "@mui/material";
import { ResponsiveImage } from "../components/ResponsiveImage";
import { CardModal } from "../components/CardModal";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

const DeckCardLoader = () => {
  const { currentUser } = useAuth();
  const { deckId } = useParams();

  console.log("Deck ID:", deckId);
  const [cards, setCards] = useState([]);
  const [selectedCard, setSelectedCard] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  
  useEffect(() => {
    const fetchCards = async () => {
      if (!currentUser) {
        return;
      }

      const uid = currentUser.uid;
      const querySnapshot = await getDocs(collection(db, `users/${uid}/decks/${deckId}/cards`));
      const cardDocs = [];
      querySnapshot.forEach((doc) => {
        cardDocs.push(doc.data());
      });
      setCards(cardDocs);

      // Log the fetched cards to the console
      console.log("Fetched cards:", cardDocs);
    };

    fetchCards();
  }, [currentUser, deckId]);

  useEffect(() => {
    // Save the cards to the localStorage
    localStorage.setItem("temporaryDocument", JSON.stringify(cards));
  }, [cards]);

  const handleOpenModal = (cardId) => {
    const cardsData = JSON.parse(localStorage.getItem("temporaryDocument"));
    const selectedCardData = cardsData.find((card) => card.cardId === cardId);
    setSelectedCard(selectedCardData);
    setOpenModal(true);
  };
  
  const handleCloseModal = () => {
    setSelectedCard(null);
    setOpenModal(false);
  };
  

  return (
    <div>
        <Box bgcolor={"#121212"} color={"#f2f3f8"}>
          <Navbar />
          <Stack direction="row" spacing={2} justifyContent={"space-between"}>
            <Sidebar/>
            <Box flex={8} p={2}>
              <Grid container spacing={2} justifyContent="center">
                {cards.map((card) => (
                  <Grid item key={card.id}>
                    <Box display={"flex"} flexDirection={"column"} sx={{textAlign:"center"}} onClick={() => handleOpenModal(card)}>
                      <ResponsiveImage
                        loading="lazy"
                        src={card.image}
                        draggable="false"
                        alt={card.front}
                      />
                      <span>{card.count}</span>
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
            </Box>
          </Stack>
        </Box>
    </div>
  );
};

export default DeckCardLoader;
