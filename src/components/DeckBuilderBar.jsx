import React, { useState } from "react";
import { Box, Button, ButtonGroup, TextField, Tooltip } from "@mui/material";
import { Delete, Save } from "@mui/icons-material";
import { useCardState } from "../context/useCardState";
import { setToLocalStorage } from "./LocalStorage/localStorageHelper";
import { db, updateDocuments } from "../Firebase";
import { useAuth } from "../context/AuthContext";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { collection, doc, setDoc } from "firebase/firestore";


const DeckBuilderBar = (props) => {
  const { currentUser } = useAuth();
  const { countArray, setCountArray, filteredCards } = useCardState();
  const [deckName, setDeckName] = useState("myDeckId");
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);


  const handleClearClick = () => {
    setCountArray({});
    setToLocalStorage("countArray", {});
    setToLocalStorage("filteredCards", []);
  };

  const totalCount = Object.values(countArray).reduce(
    (accumulator, count) => accumulator + count,
    0
  );

  const handleSaveClick = async (proceed = false) => {
    if (!proceed && totalCount < 50) {
      setShowConfirmDialog(true);
      return;
    }

    if (!currentUser) {
      return;
    }

    const uid = currentUser.uid;

    const deckInfo = {
      deckName: deckName,
      // Add any other information about the deck as required
    };

    try {
      // Create a document for the deck with the specified name and deck info
      await setDoc(doc(db, `users/${uid}/decks`, deckName), deckInfo);

      // Add the unique cards to a subcollection called "cards"
      const cardsCollectionRef = collection(
        db,
        `users/${uid}/decks/${deckName}/cards`
      );

      await Promise.all(
        filteredCards.map(async (card) => {
          const cardData = {
            booster: card.booster,
            cardId: card.cardId,
            cardName: card.cardName,
            color: card.color,
            effect: card.effect,
            image: card.image,
            trigger: card.trigger,
            count: countArray[card.cardId] || 0,
          };
          await setDoc(doc(cardsCollectionRef, card.cardId), cardData);
        })
      );

      console.log("Data saved successfully!");
    } catch (error) {
      console.error("Error saving data: ", error);
    }
  };

  const handleProceedSave = () => {
    handleSaveClick(true);
    setShowConfirmDialog(false);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        bgcolor: "#f2f3f8",
        color: "#121212",
        top: 55,
        position: "fixed",
        zIndex: 1,
        ...props.style,
      }}
      p={2}
    >
      <Box display={"flex"} flexDirection={"row"} sx={{ flex: "1 1 auto" }}>
        <Box>
          <h2 style={{ margin: 0 }}>DECKBUILDER</h2>
          <TextField
            label="Deck Name"
            variant="outlined"
            size="small"
            value={deckName}
            onChange={(event) => setDeckName(event.target.value)}
            inputProps={{ style: { color: '#121212' } }}
            sx={{ '& .MuiInputLabel-filled': { color: '#121212' }, '& .MuiFilledInput-input': { color: '#121212' } }}
          />
        </Box>
        <Box>
          Total Count:{" "}
          <span style={{ color: totalCount > 50 ? "red" : "inherit" }}>
            {totalCount}/50
          </span>
          <br />
          <img src="/icons/TCOLOR.png" alt="Color:" />{" "}
          <span style={{ color: totalCount > 4 ? "red" : "inherit" }}>
            {totalCount}/4
          </span>
          <br />
          <img src="/icons/TSPECIAL.png" alt="Special:" />{" "}
          <span style={{ color: totalCount > 4 ? "red" : "inherit" }}>
            {totalCount}/4
          </span>
          <br />
          <img src="/icons/TFINAL.png" alt="Final:" />{" "}
          <span style={{ color: totalCount > 4 ? "red" : "inherit" }}>
            {totalCount}/4
          </span>
        </Box>
      </Box>
      <ButtonGroup size="large" aria-label="small button group">
        <Button>
          <Tooltip
            onClick={handleClearClick}
            title="Clear"
            p={1}
            sx={{ color: "#121212" }}
          >
            <Delete />
          </Tooltip>
        </Button>
        <Button>
          <Tooltip
            components={Button}
            onClick={() => handleSaveClick(false)}
            title="Save"
            p={1}
            sx={{ color: "#121212" }}
          >
            <Save />
          </Tooltip>
        </Button>
      </ButtonGroup>
      <Dialog
        open={showConfirmDialog}
        onClose={() => setShowConfirmDialog(false)}
      >
        <DialogTitle>{"Save incomplete deck?"}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Your deck has less than 50 cards. Do you want to save it anyway?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowConfirmDialog(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={() => handleProceedSave()} color="primary" autoFocus>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );

};

export default DeckBuilderBar;
