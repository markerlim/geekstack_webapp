import React, { useState, useEffect } from "react";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "../Firebase";
import { Box, Button, ButtonBase } from "@mui/material";
import { useAuth } from "../context/AuthContext";
import { useCardState } from "../context/useCardState";
import { Delete } from "@mui/icons-material";

const LoadtoDeckbuilder = ({ onDeckLoaded }) => {
  const { currentUser } = useAuth();
  const { setFilteredCards } = useCardState(); // Use the hook to get the state setters
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
    setFilteredCards(cards);

    onDeckLoaded(deck.id, deck.deckuid, deck.name, deck.image);
  };

  const handleDeleteDeck = async (deckId) => {
    try {
      await deleteDoc(doc(db, `users/${currentUser.uid}/decks`, deckId));
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
      const querySnapshot = await getDocs(collection(db, `users/${uid}/decks`));
      const deckDocs = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        if (doc.id !== "placeholder") {
          deckDocs.push({
            id: doc.id,
            name: data.deckName,
            description: data.description,
            colorCount: data.colorCount,
            specialCount: data.specialCount,
            finalCount: data.finalCount,
            image: data.image,
            ...data,
          });
        }
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
        justifyContent: "center",
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
              width: { xs: 140, sm: 200 },
              height: { xs: 210, sm: 300 },
            }}
          >
            <Box
              component="img"
              src={deck.image}
              alt={deck.name}
              sx={{ width: { xs: "150%", sm: "140%" }, height: "auto" }}
            />
          </ButtonBase>
          <h3 style={{ margin: "0.5rem 0", color: "primary" }}>{deck.name}</h3>
          <Button
            onClick={(event) => {
              event.stopPropagation();
              handleDeleteDeck(deck.id);
            }}
          >
            <Delete />
          </Button>
        </Box>

      ))}
    </Box>
  );
};

export default LoadtoDeckbuilder;
