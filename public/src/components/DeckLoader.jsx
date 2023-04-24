import React, { useState, useEffect } from "react";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "../Firebase";
import { Box, Button, ButtonBase } from "@mui/material";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Delete } from "@mui/icons-material";

const DeckLoader = () => {
  const { currentUser } = useAuth();
  const [decks, setDecks] = useState([]);


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
          colorCount: data.colorCount,
          specialCount: data.specialCount,
          finalCount: data.finalCount,
          image: data.image,
          ...data,
        });
      });
      setDecks(deckDocs);
    };
    fetchDecks();
  }, [currentUser]);

  const handleDeleteDeck = async (deckId) => {
    try {
      await deleteDoc(doc(db, `users/${currentUser.uid}/decks`, deckId));
      setDecks(decks.filter((deck) => deck.id !== deckId));
    } catch (error) {
      console.error("Error deleting deck: ", error);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        flexWrap: "wrap",
        color: "#121212",
        padding: 2,
        overflowY: "auto",
      }}
    >
      {decks.map((deck) => (
        <Box sx={{marginBottom:"60px"}}>
          <Link key={deck.id} to={`/deck/${deck.id}`} style={{ textDecoration: "none" }}>
            <Box sx={{ textAlign: "center" }}>
              <ButtonBase
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  bgcolor: "#121212",
                  margin: 2,
                  padding: 2,
                  borderRadius: 5,
                  boxShadow: 5,
                  overflow: "hidden",
                  width: { xs: 150, sm: 200 },
                  height: { xs: 200, sm: 300 }
                }}
              >
                <img
                  src={deck.image}
                  alt={deck.name}
                  style={{ width: "140%", height: "auto" }}
                />
                <p style={{ margin: 0 }}>{deck.description}</p>
              </ButtonBase>
              <h3 style={{ margin: "0.5rem 0", color: "#f2f3f8" }}>{deck.name}</h3>
            </Box>
          </Link>
          <Box sx={{textAlign:"center"}}>
          <Button
            sx={{
              backgroundColor: "#f2f3f8",
              '&:hover': {
                backgroundColor: "#240052", // Change this to the desired hover background color
                color: "#f2f3f8", // Change this to the desired hover text color if needed
              }
            }}
            onClick={(event) => {
              event.stopPropagation();
              handleDeleteDeck(deck.id);
            }}
          >
            <Delete />
          </Button>
          </Box>
        </Box>
      ))}
    </Box>
  );
};

export default DeckLoader;
