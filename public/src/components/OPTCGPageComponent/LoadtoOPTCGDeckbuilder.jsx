import React, { useState, useEffect } from "react";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "../../Firebase";
import { Box, Button, ButtonBase } from "@mui/material";
import { useAuth } from "../../context/AuthContext";
import { Delete } from "@mui/icons-material";
import { useCardState } from "../../context/useCardState";

const LoadtoOPTCGDeckbuilder = ({ onDeckLoaded }) => {
  const { currentUser } = useAuth();
  const { setFilteredCards } = useCardState();
  const [decks, setDecks] = useState([]);

  const loadDeckCards = async (deckId) => {
    const querySnapshot = await getDocs(collection(db, `users/${currentUser.uid}/optcgdecks/${deckId}/optcgcards`));
    const cards = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      cards.push({
        id: doc.id,
        ...data,
      });
    });
    return cards;
  };

  const handleDeckClick = async (deck) => {
    const cards = await loadDeckCards(deck.id);
    const newFilteredCards = [];

    cards.forEach((card) => {
      const existingCardIndex = newFilteredCards.findIndex((newCard) => newCard.id === card.id);
      if (existingCardIndex !== -1) {
        newFilteredCards[existingCardIndex].count += card.count;
      } else {
        newFilteredCards.push(card);
      }
    });
    setFilteredCards(newFilteredCards);
    onDeckLoaded(deck.deckuid, deck.name, deck.deckcover);
  };

  const handleDeleteDeck = async (deckId) => {
    try {
      await deleteDoc(doc(db, `users/${currentUser.uid}/optcgdecks`, deckId));
      setDecks(decks.filter((deck) => deck.id !== deckId));
    } catch (error) {
      console.error("Error deleting deck: ", error);
    }
  };

  useEffect(() => {
    const fetchDecks = async () => {
      if (!currentUser) {
        return;
      }

      const uid = currentUser.uid;
      const querySnapshot = await getDocs(collection(db, `users/${uid}/optcgdecks`));
      const deckDocs = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        deckDocs.push({
          id: doc.id,
          name: data.deckName,
          deckcover: data.deckcover,
          ...data,
        });
      });
      setDecks(deckDocs);
    };
    fetchDecks();
  }, [currentUser]);


  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        justifyContent:"center",
        flexWrap: "wrap",
        color: "#121212",
        overflowY: "auto",
        padding: 2,
      }}
    >
      {decks.map((deck) => (
        <Box
          key={deck.id}
          sx={{ textAlign: "center" }}
          onClick={() => handleDeckClick(deck)}
        >
          <ButtonBase
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              bgcolor: "#ffffff",
              margin: 2,
              padding: 2,
              borderRadius: 5,
              boxShadow: 5,
              overflow: "hidden",
              width: 200,
              height: 300,
            }}
          >
            <img
              src={deck.deckcover}
              alt={deck.name}
              style={{ width: "140%", height: "auto" }}
            />
            <p style={{ margin: 0 }}>{deck.description}</p>
          </ButtonBase>
          <h3 style={{ margin: "0.5rem 0", color: "primary" }}>{deck.name}</h3>
          <Button
            onClick={(event) => {
              event.stopPropagation();
              handleDeleteDeck(deck.id);
            }}
          >
            <Delete/>
          </Button>
        </Box>

      ))}
    </Box>
  );
};

export default LoadtoOPTCGDeckbuilder;
