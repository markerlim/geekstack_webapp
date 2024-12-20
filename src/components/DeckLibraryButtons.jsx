import React, { useState, useEffect } from "react";
import { collection, getDocs, deleteDoc, doc, addDoc, } from "firebase/firestore";
import { db } from "../Firebase";
import { Box, Button, ButtonBase, CircularProgress, Modal, TextField } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Delete, Share, Style } from "@mui/icons-material";
import SharingStack from "./SharingStack";

const Decklibrarybtn = () => {
  const { currentUser } = useAuth();
  const [decks, setDecks] = useState([]);
  const [open, setOpen] = useState(false);
  const [description, setDescription] = useState("");
  const [selectedCards, setSelectedCards] = useState([]);
  const [cards, setCards] = useState([]);
  const [deckType, setDeckType] = useState(null); // 'tournament' or 'casuals'
  const [editedDeckName, setEditedDeckName] = useState("");
  const [loading, setLoading] = useState(true);

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
        if (doc.id !== "placeholder") {
          deckDocs.push({
            id: doc.id,
            name: data.deckName,
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
    setLoading(false);
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
        const finalDate = new Date(date.toLocaleString('en-US', { timeZone: 'Asia/Singapore' }));

        const finalDeckName = editedDeckName || deck.name;

        const animecode = selectedCards[0]?.id?.substring(0, 3).toLowerCase() || "";

        // Create a new shared deck document in the 'uniondecklist' collection
        await addDoc(collection(db, "uniondecklist"), {
          postType: 'UATCG',
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
          cards: cards,
          animecode: animecode,
        });
        console.log(cards, 'completed')
        navigate('/stacks', { state: { openedDeck: deck.id } });
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
        alignItems: 'center',
        width: '100vw',
        gap: '20px',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: { xs: '100vw', sm: '100vw', md: 'calc(100vw - 100px)' }, }}>
        <Box sx={{ display: 'flex', alignItems: 'center', marginLeft: { xs: '0px', sm: '0px', md: '-100px' } }}><Style style={{ marginRight: '10px' }} />UA Decks</Box>
      </Box>
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
          <CircularProgress />
        </Box>
      ) : (
        <Box sx={{ width: '100vw', display: "flex", flexDirection: 'row', alignItems: 'start', flexWrap: 'nowrap', overflow: 'visible', height: 'calc(100vh - 84px)' }} className="hide-scrollbar">
          <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', gap: '20px', width: { xs: '100vw', sm: '100vw', md: 'calc(100vw - 100px)' }, flexWrap: 'wrap', paddingBottom: '100px' }}>
            {decks.length === 0 ? (
              <Box style={{ textAlign: 'center', color: '#f2f3f8', padding: '20px' }}>
                No Union Arena Deck Created
              </Box>
            ) : (
              decks.map((deck) => (
                <Box>
                  <Link key={deck.id} to={`/deckbuilder?deckUid=${deck.id}`} style={{ textDecoration: "none" }}>
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
                  <SharingStack
                    open={open}
                    handleClose={handleClose}
                    editedDeckName={editedDeckName}
                    handleDeckNameChange={handleDeckNameChange}
                    description={description}
                    setDescription={setDescription}
                    handleInputChange={handleInputChange}
                    cards={cards}
                    selectedCards={selectedCards} 
                    deckType={deckType}
                    setDeckType={setDeckType}
                    handleCardSelection={handleCardSelection}
                    handleShareDeck={handleShareDeck}
                    deck={deck}
                  />
                </Box>
              )))}
          </Box>
        </Box>)}
    </Box>
  );
};

export default Decklibrarybtn;
