import React, { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../Firebase";
import { Box, ButtonBase } from "@mui/material";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import DeckCardLoader from "../pages/DeckCardLoader";

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
        top: 55,
        position: "fixed",
        zIndex: 1,
        padding: 2,
      }}
    >
      {decks.map((deck) => (
        <Link key={deck.id} to={`/deck/${deck.id}`} style={{ textDecoration: "none" }}>
            <Box sx={{textAlign:"center"}}>
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
          <h3 style={{ margin: "0.5rem 0", color:"primary" }}>{deck.name}</h3>
          </Box>
        </Link>
      ))}
    </Box>
  );
};

export default DeckLoader;
