import React, { useState, useEffect } from "react";
import { collection, getDocs, deleteDoc, doc, addDoc, } from "firebase/firestore";
import { db } from "../Firebase";
import { Box, ButtonBase, CircularProgress, } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Delete, Share, Style } from "@mui/icons-material";
import SharingStack from "./SharingStack";

const DecklibrarybtnMobile = () => {
  const { currentUser } = useAuth();
  const [decks, setDecks] = useState([]);
  const [deck, setDeck] = useState(null);
  const [open, setOpen] = useState(false);
  const [description, setDescription] = useState("");
  const [selectedCards, setSelectedCards] = useState([]);
  const [cards, setCards] = useState([]);
  const [deckType, setDeckType] = useState(null);
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

  const handleOpen = async (deck) => {
    const cardsSnapshot = await getDocs(collection(db, `users/${currentUser.uid}/decks/${deck.id}/cards`));
    const cardsData = [];
    cardsSnapshot.forEach((doc) => {
      const data = doc.data();
      cardsData.push({
        id: doc.id,
        ...data,
      });
    });
    const decksearch = decks.find((d) => d.id === deck.id);
    if (decksearch) {
      setEditedDeckName(decksearch.name);
    }
    setCards(cardsData);
    setSelectedCards([]);
    setDeck(deck)
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleInputChange = (e) => {
    console.log('type')
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
          cards: cards, // use the cards state directly
          animecode: animecode,
        });
        console.log(cards, 'completed')
        navigate('/stacks');
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
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingLeft: 'calc(5vw)', paddingRight: 'calc(5vw)' }}>
        <span style={{ display: 'flex', alignItems: 'center' }}><Style style={{ marginRight: '10px' }} />UA Decks</span>
        <Link to="/deckviewer" style={{ textDecoration: 'none', color: '#74cfff', fontSize: '12px' }}>View all</Link>
      </Box>
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
          <CircularProgress />
        </Box>
      ) : (
        <Box sx={{ width: '100vw', display: "flex", flexDirection: 'row', flexWrap: 'nowrap', overflow: 'auto', height: { xs: '220px', sm: '500px' } }} className="hide-scrollbar">
          <div style={{ paddingLeft: '5vw' }}>
            <br />
          </div>
          {decks.length === 0 ? (
            <Box style={{ textAlign: 'center', color: '#f2f3f8', padding: '20px' }}>
              No Union Arena Deck Created
            </Box>
          ) : (
            decks.map((deck) => (
              <Box sx={{ marginRight: '20px' }}>
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
                    onClick={() => handleOpen(deck)}
                  >
                    <Share sx={{ fontSize: '16px' }} />
                  </Box>
                </Box>
              </Box>
            )))}
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
          <div style={{ paddingLeft: '5vw' }}>
            <br />
          </div>
        </Box>)}
    </Box>
  );
};

export default DecklibrarybtnMobile;
