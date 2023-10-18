import React, { useState, useEffect } from "react";
import { collection, getDocs, deleteDoc, doc, addDoc, setDoc } from "firebase/firestore";
import { db } from "../Firebase";
import { Box, Button, ButtonBase, Modal, TextField } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Delete, Share, Style } from "@mui/icons-material";

const Decklibrarybtn = () => {
  const { currentUser } = useAuth();
  const [decks, setDecks] = useState([]);
  const [open, setOpen] = useState(false);
  const [description, setDescription] = useState("");
  const [selectedCards, setSelectedCards] = useState([]);
  const [cards, setCards] = useState([]);
  const [deckType, setDeckType] = useState(null); // 'tournament' or 'casuals'
  const [editedDeckName, setEditedDeckName] = useState("");


  const navigate = useNavigate();

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
    const deck = decks.find((d) => d.id === deckId);
    if (deck) {
      setEditedDeckName(deck.name);
    }
    setCards(cardsData);
    setSelectedCards([]);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleInputChange = (e) => {
    if (e.target.value.length > 80) {
      alert("Description should not exceed 80 characters.");
      return;
    }
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

  const handleDeckNameChange = (e) => {
    if (e.target.value.length > 15) {
      alert("Deck name should not exceed 15 characters.");
      return;
    }
    setEditedDeckName(e.target.value);
  };


  const handleShareDeck = async (deck, description, selectedCards) => {
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

        const finalDeckName = editedDeckName || deck.name;

        const animecode = selectedCards[0]?.id?.substring(0, 3).toLowerCase() || "";

        // Create a new shared deck document in the 'uniondecklist' collection
        await addDoc(collection(db, "uniondecklist"), {
          deckName: finalDeckName,
          colorCount: deck.colorCount,
          specialCount: deck.specialCount,
          finalCount: deck.finalCount,
          image: deck.image,
          description: description,
          selectedCards: selectedCards,
          uid: currentUser.uid,
          sharedDate: finalDate,
          deckType: deckType,
          cards: cards, // use the cards state directly
          animecode: animecode,
        });
        console.log(cards, 'completed')
        navigate('/uadecklist', { state: { openedDeck: deck.id } });
      }
    } catch (error) {
      console.error("Error sharing deck: ", error);
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
        <span style={{ display: 'flex', alignItems: 'center' }}><Style style={{ marginRight: '10px' }} />UA Decks</span>
        <Link to="/deckviewer" style={{ textDecoration: 'none', color: '#74cfff',fontSize:'12px' }}>View all</Link>
      </Box>
      <Box sx={{ width: '100vw', display: "flex", flexWrap: "nowrap", overflow: "auto", height: { xs: '220px', sm: '500px' } }} className="hide-scrollbar">
        <div style={{ paddingLeft: '5vw' }}>
          <br />
        </div>
        {decks.map((deck) => (
          <Box sx={{ marginRight: '20px ' }}>
            <Link key={deck.id} to={`/deck/${deck.id}`} style={{ textDecoration: "none" }}>
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
                    src={deck.image}
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
                onClick={() => handleOpen(deck.id)}
              >
                <Share sx={{ fontSize: '16px' }} />
              </Box>
            </Box>
            <Modal sx={{ display: "flex", justifyContent: "center", alignItems: "center" }} open={open} onClose={handleClose}>
              <Box sx={{ backgroundColor: "#26252D", color: "white", borderRadius: "30px", padding: "30px", width: "500px", height: { xs: '100%', sm: "600px" }, display: "flex", flexDirection: "column", gap: "5px", textAlign: "center", alignItems: "center", overflowY: 'auto' }}>
                <span>Title of Deck</span>
                <TextField
                  label="Deck Name"
                  value={editedDeckName}
                  onChange={(e) => handleDeckNameChange(e)}
                  fullWidth
                  maxLength="15"
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
                    '& .MuiInputLabel-outlined.MuiInputLabel-shrink': {
                      color: 'white', // changes the label color when typing
                    },
                  }}
                />
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
                    '& .MuiInputLabel-outlined.MuiInputLabel-shrink': {
                      color: 'white', // changes the label color when typing
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
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <span style={{ padding: "10px" }}>Pick the usage of this deck</span>
                  <Box sx={{ display: 'flex', flexDirection: 'row', gap: '10px' }}>
                    <Button
                      sx={{
                        backgroundColor: deckType === "tournament" ? "#333333" : "#333333",
                        color: deckType === "tournament" ? "#7C4FFF" : "#240056",
                        '&:focus': {
                          backgroundColor: '#333333',
                        }
                      }}
                      onClick={() => setDeckType("tournament")}
                    >
                      Tournament
                    </Button>
                    <Button
                      sx={{
                        backgroundColor: deckType === "casuals" ? "#333333" : "#333333",
                        color: deckType === "casuals" ? "#7C4FFF" : "#240056",
                        '&:focus': {
                          backgroundColor: '#333333',
                        }
                      }}
                      onClick={() => setDeckType("casuals")}
                    >
                      Casuals
                    </Button>
                  </Box>
                </Box>
                <Box sx={{ display: "flex", gap: "5px", justifyContent: "center" }}>
                  <Button
                    sx={{ color: "#7C4FFF" }}
                    onClick={() => {
                      if (selectedCards.length !== 3) {
                        alert("You must select exactly 3 cards to submit.");
                        return;
                      }
                      handleClose();
                      handleShareDeck(deck, description, selectedCards);
                    }}
                  >
                    Submit
                  </Button>
                  <Button sx={{ color: "#7C4FFF" }} onClick={handleClose}>Cancel</Button>
                </Box>
              </Box>
            </Modal>
          </Box>
        ))}
        <div style={{ paddingLeft: '5vw' }}>
          <br />
        </div>
      </Box>
    </Box>
  );
};

export default Decklibrarybtn;
