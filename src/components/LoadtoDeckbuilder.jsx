import React, { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../Firebase";
import { Box, ButtonBase } from "@mui/material";
import { useAuth } from "../context/AuthContext";
import { useCardState } from "../context/useCardState";

const LoadtoDeckbuilder = ({ onDeckLoaded }) => {
  const { currentUser } = useAuth();
  const { setFilteredCards, setCountArray } = useCardState(); // Use the hook to get the state setters
  const [decks, setDecks] = useState([]);

  const loadDeckCards = async (deckId) => {
    const querySnapshot = await getDocs(collection(db, `users/${currentUser.uid}/decks/${deckId}/cards`));
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

    const newCountArray = {};
    const newFilteredCards = [];

    cards.forEach((card) => {
      // Update newCountArray with the new count for each card
      newCountArray[card.id] = (newCountArray[card.id] || 0) + card.count;

      // Update newFilteredCards
      const existingCardIndex = newFilteredCards.findIndex((newCard) => newCard.id === card.id);
      if (existingCardIndex !== -1) {
        newFilteredCards[existingCardIndex].count += card.count;
      } else {
        newFilteredCards.push(card);
      }
    });

    // Update CardState with the new countArray and filteredCards values
    setCountArray(newCountArray);
    setFilteredCards(newFilteredCards);

    onDeckLoaded(deck.id, deck.deckuid, deck.name);
  };


  useEffect(() => {
    const fetchDecks = async () => {
      if (!currentUser) {
        return;
      }

      const uid = currentUser.uid;
      const querySnapshot = await getDocs(collection(db, `users/${uid}/decks`));
      const deckDocs = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        deckDocs.push({
          id: doc.id,
          name: data.deckName,
          description: data.description,
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
        alignItems: "center",
        flexWrap: "wrap",
        color: "#121212",
        position: "fixed",
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
              src="/images/Alice.png"
              alt={deck.name}
              style={{ width: "140%", height: "auto" }}
            />
            <p style={{ margin: 0 }}>{deck.description}</p>
          </ButtonBase>
          <h3 style={{ margin: "0.5rem 0", color: "primary" }}>{deck.name}</h3>
        </Box>
      ))}
    </Box>
  );
};

export default LoadtoDeckbuilder;
