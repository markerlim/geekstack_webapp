import { CheckCircle } from "@mui/icons-material";
import { Box, Button, Modal, TextField } from "@mui/material";
import React, { useState } from "react";

const SharingStack = ({
  open,
  handleClose,
  editedDeckName,
  handleDeckNameChange,
  description,
  setDescription,
  cards,
  selectedCards,
  deckType,
  setDeckType,
  handleCardSelection,
  handleShareDeck,
  deck,
}) => {
  const [localDescription, setLocalDescription] = useState(description);
  const handleSubmit = () => {

    if (localDescription.length > 80) {
      alert("Description should not exceed 80 characters.");
      return;
    }

    if (selectedCards.length !== 3) {
      alert("You must select exactly 3 cards to submit.");
      return;
    }

    setDescription(localDescription);

    handleClose();
    handleShareDeck(deck, localDescription, selectedCards);
  };
  return (
    <Modal
      sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
      open={open}
      onClose={handleClose}
    >
      <Box
        sx={{
          backgroundColor: "#26252D",
          color: "white",
          borderRadius: "30px",
          padding: "30px",
          width: { xs: "calc(100vw - 60px)", sm: "500px" },
          height: { xs: "100%", sm: "600px" },
          display: "flex",
          flexDirection: "column",
          paddingTop: '60px',
          gap: "5px",
          textAlign: "center",
          alignItems: "center",
          overflowY: "auto",
        }}
      >
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
        <span style={{ padding: "10px" }}>
          Write a short description no more than 80 characters on the key
          pointers of the deck.
        </span>
        <TextField
          label="Description"
          fullWidth
          multiline
          value={localDescription}
          onChange={(e) => setLocalDescription(e.target.value)}
          maxRows={4}
          InputLabelProps={{ shrink: true }}
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
              color: 'white', // changes the label colorwhite
              whiteSpace: 'pre-wrap'
            },
            '& .MuiInputLabel-outlined.MuiInputLabel-shrink': {
              color: 'white', // changes the label color when typing
            },
          }}
        />
        <span style={{ padding: "10px" }}>
          Scroll and pick 3 cards which will be key in the deck, this will help people
          when they want to search for the deck as well
        </span>
        <Box
          sx={{
            display: "flex",
            overflow: 'auto',
            justifyContent: "left",
            width: 'calc(100vw - 60px)',
            gap: "5px",
            height: '110px',
          }}
        >
          {cards.map((card) => (
            <Box
              key={card.id}
              onClick={() =>
                handleCardSelection(
                  card.id || card.cardid,
                  card.cardName || card.cardname,
                  card.urlimage || card.image
                )
              }
              sx={{ position: 'relative' }}
            >
              <CheckCircle sx={{
                position: "absolute",
                top: '50%',
                left: '50%',
                color: '#f2f3f8',
                zIndex: '2',
                transform: 'translate(-50%, -50%)',
                transition: '0.3s ease-in-out',
                display: selectedCards.some(
                  (selectedCard) => selectedCard.id === card.id
                )
                  ? "block"
                  : "none",
              }} />
              <img
                style={{
                  width: "75px",
                  transition: '0.3s ease-in-out',
                  filter: selectedCards.some(
                    (selectedCard) => selectedCard.id === card.id
                  )
                    ? "brightness(50%)"
                    : "brightness(100%)",
                }}
                src={card.urlimage || card.image}
                alt={card.id}
              />
            </Box>
          ))}
        </Box>
        <Box
          sx={{ display: "flex", flexDirection: "column", gap: "10px" }}
        >
          <span style={{ padding: "10px" }}>Pick the usage of this deck</span>
          <Box sx={{ display: "flex", flexDirection: "row", gap: "10px" }}>
            <Button
              sx={{
                backgroundColor:
                  deckType === "tournament" ? "#333333" : "#333333",
                color: deckType === "tournament" ? "#7C4FFF" : "#240056",
                "&:focus": {
                  backgroundColor: "#333333",
                },
              }}
              onClick={() => setDeckType("tournament")}
            >
              Tournament
            </Button>
            <Button
              sx={{
                backgroundColor: deckType === "casuals" ? "#333333" : "#333333",
                color: deckType === "casuals" ? "#7C4FFF" : "#240056",
                "&:focus": {
                  backgroundColor: "#333333",
                },
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
            onClick={handleSubmit}
          >
            Submit
          </Button>
          <Button sx={{ color: "#7C4FFF" }} onClick={handleClose}>
            Cancel
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default SharingStack;
