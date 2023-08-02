import React, { useState, useEffect } from "react";
import { collection, getDocs, deleteDoc, doc, addDoc, setDoc } from "firebase/firestore";
import { db } from "../Firebase";
import { Box, Button, ButtonBase, Modal, TextField } from "@mui/material";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Delete } from "@mui/icons-material";

const DeckLoader = () => {
  const { currentUser } = useAuth();
  const [decks, setDecks] = useState([]);
  const [open, setOpen] = useState(false);
  const [description, setDescription] = useState("");
  const [selectedCards, setSelectedCards] = useState([]);
  const [cards, setCards] = useState([]);


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

  const handleOpen = async (deckId) => {
    const cardsSnapshot = await getDocs(collection(db, `users/${currentUser.uid}/decks/${deckId}/cards`));
    const cardsData = [];
    cardsSnapshot.forEach((doc) => {
      const data = doc.data();
      cardsData.push({
        id: doc.id,
        ...data,
      });
    });
    console.log(cardsData, "present")
    setCards(cardsData);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleInputChange = (e) => {
    setDescription(e.target.value);
  };

  const handleDeleteDeck = async (deckId) => {
    try {
      await deleteDoc(doc(db, `users/${currentUser.uid}/decks`, deckId));
      setDecks(decks.filter((deck) => deck.id !== deckId));
    } catch (error) {
      console.error("Error deleting deck: ", error);
    }
  };

  const handleCardSelection = (cardId, cardName, image) => {
    setSelectedCards(prevState => {
      // If the card is already selected, deselect it
      const existingCardIndex = prevState.findIndex(card => card.id === cardId);
      if (existingCardIndex !== -1) {
        return prevState.filter(card => card.id !== cardId);
      }

      // If 3 cards are already selected, replace the first selected card
      if (prevState.length === 3) {
        return [
          prevState[1],
          prevState[2],
          { id: cardId, name: cardName, imagesrc: image }
        ];
      }

      // Otherwise, add the card to the selection
      return [...prevState, { id: cardId, name: cardName, imagesrc: image }];
    });
  };
  
  const handleShareDeck = async (deck) => {
    try {
      if (!deck || !deck.id) {
        console.error("Deck ID is missing.");
        return;
      }
  
      if (currentUser) {
        // Create date object in GMT+8 timezone
        const date = new Date();
        const offset = 8; // Offset for GMT+8
        const localTime = date.getTime();
        const localOffset = date.getTimezoneOffset() * 60000;
        const utc = localTime + localOffset;
        const timestamp = utc + (3600000 * offset);
        const finalDate = new Date(timestamp);
        
        // Get the cards of the selected deck from Firestore
        const cardsSnapshot = await getDocs(collection(db, `users/${currentUser.uid}/decks/${deck.id}/cards`));
        const cardsData = [];
        cardsSnapshot.forEach((cardDoc) => {
          cardsData.push({
            id: cardDoc.id,
            ...cardDoc.data(),
          });
        });
  
        // Create a new shared deck document in the 'uniondecklist' collection
        await addDoc(collection(db, "uniondecklist"), {
          deckName: deck.name,
          colorCount: deck.colorCount,
          specialCount: deck.specialCount,
          finalCount: deck.finalCount,
          image: deck.image,
          description: description,
          selectedCards: selectedCards,
          displayName: currentUser.displayName,
          photoURL: currentUser.photoURL,
          uid: currentUser.uid,
          sharedDate: finalDate,
          cards: cardsData, // add cards data to deck document directly
        });
      }
    } catch (error) {
      console.error("Error sharing deck: ", error);
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
        <Box sx={{ marginBottom: "60px" }}>
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
          <Box sx={{ display: "flex", flexDirection: "row", gap: "5px", justifyContent: "center" }}>
            <Button
              sx={{
                backgroundColor: "#26252D",
                color: "#7C4FFF",
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
              <Delete />
            </Button>
            <Button
              sx={{
                backgroundColor: "#26252D",
                color: "#7C4FFF",
                '&:hover': {
                  backgroundColor: "#222222", // Change this to the desired hover background color
                  color: "#7C4FFF", // Change this to the desired hover text color if needed
                }
              }}
              onClick={() => handleOpen(deck.id)}
            >
              Share
            </Button>
          </Box>
          <Modal sx={{ display: "flex", justifyContent: "center", alignItems: "center" }} open={open} onClose={handleClose}>
            <Box sx={{ backgroundColor: "#26252D", color: "white", borderRadius: "30px", padding: "30px", width: "500px", height: "600px", display: "flex", flexDirection: "column", gap: "5px", textAlign: "center", alignItems: "center" }}>
              <span style={{ padding: "10px" }}>Write a short description no more than 80 characters on the key pointers of the deck.</span>
              <TextField
                label="Description"
                value={description}
                onChange={handleInputChange}
                fullWidth
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: '#7C4FFF', // Border color when not focused
                    },
                    '&:hover fieldset': {
                      borderColor: '#7C4FFF', // Border color when hovered over
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#7C4FFF', // Border color when focused (in use)
                    },
                  },
                  '.MuiOutlinedInput-input': {
                    color: 'white', // changes the text color
                  },
                  '.MuiInputLabel-outlined': {
                    color: 'white', // changes the label color
                  },
                }}
              />
              <span style={{ padding: "10px" }}>Pick 3 cards which will be key in the deck, this will help people when they want to search for the deck as well</span>
              <Box sx={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "5px" }}>
                {cards.map((card) => (
                  <Box key={card.id} onClick={() => handleCardSelection(card.id, card.cardName, card.image)}>
                    <img
                      style={{
                        width: "75px",
                        border: selectedCards.some(selectedCard => selectedCard.id === card.id) ? "4px solid #7C4FFF" : "none",
                      }}
                      src={card.image}
                      alt={card.id}
                    />
                  </Box>
                ))}
              </Box>
              <Box sx={{ display: "flex", gap: "5px", justifyContent: "center" }}>
                <Button sx={{ color: "#7C4FFF" }} onClick={() => {
                  handleClose();
                  handleShareDeck(deck, description, selectedCards);
                }}>Submit</Button>
                <Button sx={{ color: "#7C4FFF" }} onClick={handleClose}>Cancel</Button>
              </Box>
            </Box>
          </Modal>
        </Box>
      ))}
    </Box>
  );
};

export default DeckLoader;
