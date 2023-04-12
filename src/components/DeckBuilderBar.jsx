import React, { useState } from "react";
import { Box, Button, Fab, TextField, Tooltip } from "@mui/material";
import { Delete, Save } from "@mui/icons-material";
import { useCardState } from "../context/useCardState";
import { setToLocalStorage } from "./LocalStorage/localStorageHelper";
import { updateDocuments } from "../Firebase";
import { AuthContext, useAuth } from "../context/AuthContext";

const DeckBuilderBar = () => {
  const { currentUser } = useAuth();
  const { countArray, setCountArray, filteredCards } = useCardState();
  const [deckName, setDeckName] = useState("myDeckId");

  const handleClearClick = () => {
    setCountArray({});
    setToLocalStorage("countArray", {});
    setToLocalStorage("filteredCards", []);
  };

  const totalCount = Object.values(countArray).reduce(
    (accumulator, count) => accumulator + count,
    0
  );

  const handleSaveClick = async () => {
    if (!currentUser) {
      return;
    }
  
    const uid = currentUser.uid;
  
    // Splice filteredCards into individual unique cards based on cardId
    const uniqueCards = filteredCards.map((card) => ({
      ...card,
    }));
  
    try {
      await updateDocuments(`users/${uid}/decks/${deckName}`, uniqueCards);
      console.log("Data saved successfully!");
    } catch (error) {
      console.error("Error saving data: ", error);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        bgcolor: "#121212",
        color: "white",
        position: "fixed",
        width: "40%",
        zIndex: 1,
      }}
      p={2}
    >
      <Box sx={{ flex: "1 1 auto" }}>
        <h2 style={{ margin: 0 }}>DECKBUILDER</h2>
        <TextField
          label="Deck Name"
          variant="outlined"
          size="small"
          value={deckName}
          onChange={(event) => setDeckName(event.target.value)}
          inputProps={{ style: { color: 'white' } }}
        sx={{ '& .MuiInputLabel-filled': { color: 'white' }, '& .MuiFilledInput-input': { color: 'white' } }}
        />
        Total Count:{" "}
        <span style={{ color: totalCount > 50 ? "red" : "inherit" }}>
          {totalCount}
        </span>
      </Box>
      <Tooltip
        components={Button}
        onClick={handleClearClick}
        title="Clear"
        p={1}
        sx={{ color: "inherit" }}
      >
        <Fab color="primary" aria-label="add">
          <Delete />
        </Fab>
      </Tooltip>
      <Tooltip
        components={Button}
        onClick={handleSaveClick}
        title="Save"
        p={1}
        sx={{ color: "inherit" }}
      >
        <Fab color="primary" aria-label="add">
          <Save />
        </Fab>
      </Tooltip>
    </Box>
  );
};

export default DeckBuilderBar;
