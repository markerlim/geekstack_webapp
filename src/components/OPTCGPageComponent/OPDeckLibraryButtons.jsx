import React, { useState, useEffect } from "react";
import { collection, getDocs, deleteDoc, doc, addDoc, setDoc } from "firebase/firestore";
import { db } from "../../Firebase";
import { Box,ButtonBase, } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { Delete, Share, Style } from "@mui/icons-material";
import { useAuth } from "../../context/AuthContext";

const OPDecklibrarybtn = () => {
  const { currentUser } = useAuth();
  const [decks, setDecks] = useState([]);

  const navigate = useNavigate();

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
            deckldrid: data.deckldrid,
            ...data,
          });
        }
      });
      setDecks(deckDocs);
    };
    fetchDecks();
  }, [currentUser]);

  const handleOpen = async (deck) => {
    navigate(`/optcgbuilder?deckUid=${deck.id}`);
  };

  const handleDeleteDeck = async (deckId) => {
    try {
      await deleteDoc(doc(db, `users/${currentUser.uid}/optcgdecks`, deckId));
      setDecks(decks.filter((deck) => deck.id !== deckId));
    } catch (error) {
      console.error("Error deleting deck: ", error);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: 'left',
        width: '100vw',
        gap: '20px',
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between',alignItems:'center', paddingLeft: 'calc(5vw)', paddingRight: 'calc(5vw)' }}>
        <span style={{ display: 'flex', alignItems: 'center' }}><Style style={{ marginRight: '10px' }} />OP Decks</span>
        <Link to="/deckviewer" style={{ textDecoration: 'none', color: '#74cfff',fontSize:'12px' }}>View all</Link>
      </Box>
      <Box sx={{ width: '100vw', display: "flex", flexWrap: "nowrap", overflow: "auto", height: { xs: '220px', sm: '500px' } }} className="hide-scrollbar">
        <div style={{ paddingLeft: '5vw' }}>
          <br />
        </div>
        {decks.map((deck) => (
          <Box sx={{ marginRight: '20px ' }} onClick={() => handleOpen(deck)}>
            <Link key={deck.id} style={{ textDecoration: "none" }}>
              <Box sx={{ textAlign: "center" }}>
                <ButtonBase
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    bgcolor: "#121212",
                    borderRadius: 2,
                    boxShadow: 5,
                    overflow: "hidden",
                    width: { xs: 100, sm: 200 },
                    height: { xs: 150, sm: 300 }
                  }}
                >
                  <img
                    src={deck.deckcover}
                    alt={deck.name}
                    style={{ width: "110%", height: "auto" }}
                  />
                </ButtonBase>
                <h3 style={{ margin: "0.5rem 0", color: "#f2f3f8", fontSize: '12px', width: '100', }}>{deck.name}</h3>
              </Box>
            </Link>
            <Box sx={{ display: "flex", flexDirection: "row", gap: "5px", justifyContent: "center" }}>
              <Box
                sx={{
                  backgroundColor: "#26252D",
                  color: "#7C4FFF",
                  paddingLeft: '5px',
                  paddingRight: '5px',
                  paddingTop: '4px',
                  paddingBottom: '4px',
                  display: 'flex',
                  justifyContent: 'center',
                  aligntItems: 'center',
                  borderRadius: '2px',
                  '&:hover': {
                    backgroundColor: "#222222", // Change this to the desired hover background color
                    color: "#7C4FFF", // Change this to the desired hover text color if needed
                  }
                }}
                onClick={(event) => {
                  event.stopPropagation();
                  handleDeleteDeck(deck.id);
                }}
              >
                <Delete sx={{ fontSize: '16px' }} />
              </Box>
            </Box>
          </Box>
        ))}
        <div style={{ paddingLeft: '5vw' }}>
          <br />
        </div>
      </Box>
    </Box>
  );
};

export default OPDecklibrarybtn;
