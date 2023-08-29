import React, { useState, useEffect } from "react";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "../../Firebase";
import { Box, Button, ButtonBase } from "@mui/material";
import { useAuth } from "../../context/AuthContext";
import { Delete } from "@mui/icons-material";
import { useCardState } from "../../context/useCardStateOnepiece";

const LoadtoOPTCGDeckbuilder = ({ handleDeckLoaded }) => {
  const { currentUser } = useAuth();
  const { setFilteredCards } = useCardState();
  const [decks, setDecks] = useState([]);

  const handleDeckClick = async (deck) => {
    // Fetch the cards associated with the deck from the database
    const querySnapshot = await getDocs(collection(db, `users/${currentUser.uid}/optcgdecks/${deck.id}/optcgcards`));
    
    // Convert the fetched data to an array of cards
    const cards = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
    })).sort((a, b) => a.cost_life - b.cost_life);

    // Set the state directly with the fetched cards
    setFilteredCards(cards);
    // Execute any additional logic after loading the deck (like triggering side-effects)
    handleDeckLoaded(deck.deckuid, deck.name, deck.deckcover);
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
        if (doc.id !== "placeholder") {
          deckDocs.push({
            id: doc.id,
            name: data.deckName,
            deckcover: data.deckcover,
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
