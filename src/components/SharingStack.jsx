import { Box, Button, Modal, TextField } from "@mui/material";
import React from "react";

const SharingStack = ({
  open,
  handleClose,
  editedDeckName,
  handleDeckNameChange,
  description,
  handleInputChange,
  cards,
  selectedCards,
  deckType,
  setDeckType,
  handleCardSelection,
  handleShareDeck,
  deck,
}) => {
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
          width: "500px",
          height: { xs: "100%", sm: "600px" },
          display: "flex",
          flexDirection: "column",
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
        <span style={{ padding: "10px" }}>
          Pick 3 cards which will be key in the deck, this will help people
          when they want to search for the deck as well
        </span>
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: "5px",
          }}
        >
          {cards.map((card) => (
            <Box
              key={card.id}
              onClick={() =>
                handleCardSelection(
                    card.id || card.cardid,
                    card.cardName || card.cardname,
                    card.image
                  )
                }
            >
              <img
                style={{
                  width: "75px",
                  border: selectedCards.some(
                    (selectedCard) => selectedCard.id === card.id
                  )
                    ? "4px solid #7C4FFF"
                    : "none",
                }}
                src={card.image}
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
          <Button sx={{ color: "#7C4FFF" }} onClick={handleClose}>
            Cancel
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default SharingStack;
