import React, { useEffect, useState } from "react";
import { Box, Button, ButtonGroup, Grid, TextField, Tooltip } from "@mui/material";
import { Delete, Save, SystemUpdateAlt } from "@mui/icons-material";
import { useCardState } from "../context/useCardState";
import { setToLocalStorage } from "./LocalStorage/localStorageHelper";
import { db, } from "../Firebase";
import { useAuth } from "../context/AuthContext";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import FullScreenDialog from "./FullScreenDialog";
import { collection, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import ImagePickerModal from "./ImagePickerModal";


const DeckBuilderBar = (props) => {
  const { currentUser } = useAuth();
  const { countArray, setCountArray, filteredCards } = useCardState();
  const [deckName, setDeckName] = useState("myDeckId");
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showDeckLoaderModal, setShowDeckLoaderModal] = useState(false); // State to manage the visibility of the DeckLoader modal
  const [isUpdatingExistingDeck, setIsUpdatingExistingDeck] = useState(false);
  const [loadedDeckUid, setLoadedDeckUid] = useState(null);
  const [saveStatus, setSaveStatus] = useState(null);
  const [showImagePickerModal, setShowImagePickerModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [shouldSaveDeck, setShouldSaveDeck] = useState(false);


  const images = [
    "/images/Alice.png",
    "/images/Renee.png",
    "/images/deckimage.jpg",
    "/images/deckimage1.jpg",
    "/images/deckimage2.jpg",
    "/images/deckimage3.jpg",
    "/images/deckimage4.jpg",
    "/images/deckimage5.jpg",
    "/images/deckimage6.jpg",
    "/images/deckimage7.jpg",
    "/images/deckimage8.jpg",
  ];

  const handleClearClick = () => {
    setCountArray({});
    setToLocalStorage("countArray", {});
    setToLocalStorage("filteredCards", []);
    setLoadedDeckUid(null); // Clear the loadedDeckUid
    setIsUpdatingExistingDeck(false); // Set isUpdatingExistingDeck to false
    setSelectedImage(null);
  };

  const totalCount = Object.values(countArray).reduce(
    (accumulator, count) => accumulator + count,
    0
  );

  // Filter the cards based on the triggerState that are color
  const colorCards = filteredCards.filter(card => card.triggerState === "Color");

  const colorCount = colorCards.reduce(
    (accumulator, card) => accumulator + (countArray[card.cardId] || 0),
    0
  );

  // Filter the cards based on the triggerState that are color
  const specialCards = filteredCards.filter(card => card.triggerState === "Special");

  const specialCount = specialCards.reduce(
    (accumulator, card) => accumulator + (countArray[card.cardId] || 0),
    0
  );

  // Filter the cards based on the triggerState that are color
  const finalCards = filteredCards.filter(card => card.triggerState === "Final");

  const finalCount = finalCards.reduce(
    (accumulator, card) => accumulator + (countArray[card.cardId] || 0),
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
    if (!selectedImage) {
      setShowImagePickerModal(true);
      return;
    }
    const uid = currentUser.uid;

    try {
      let deckUid;
      if (!isUpdatingExistingDeck) {
        const userDocRef = doc(db, "users", uid);

        // Get the decksCounter from the user document
        const userDocSnapshot = await getDoc(userDocRef);
        const decksCounter = userDocSnapshot.get("decksCounter") || 0;

        // Update the decksCounter for the user
        await updateDoc(userDocRef, { decksCounter: decksCounter + 1 });

        // Generate a new deckuid based on the updated decksCounter
        deckUid = `deckuid${String(decksCounter + 1).padStart(10, "0")}`;
      } else {
        deckUid = loadedDeckUid; // Use the loadedDeckUid when updating an existing deck
      }

      const deckDocRef = doc(db, `users/${uid}/decks`, deckUid);

      const deckInfo = {
        deckName: deckName,
        deckuid: deckUid,
        colorCount: colorCount,
        specialCount: specialCount,
        finalCount: finalCount,
        image: selectedImage,
        // Add any other information about the deck as required
      };

      if (!isUpdatingExistingDeck) {
        // Create a document for the deck with the new name and deck info
        await setDoc(deckDocRef, deckInfo);
      } else {
        // Update the deck name in the existing document
        await updateDoc(deckDocRef, { deckName: deckName, ...deckInfo });
      }

      // Add the unique cards to a subcollection called "cards"
      const cardsCollectionRef = collection(
        db,
        `users/${uid}/decks/${deckUid}/cards`
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
      setSaveStatus("success");

      // Reset the component state
      handleClearClick();
      setDeckName("myDeckId");
      setIsUpdatingExistingDeck(false);
      setLoadedDeckUid(null);
      setShouldSaveDeck(false); // Reset shouldSaveDeck to false
    } catch (error) {
      console.error("Error saving data: ", error);
      setSaveStatus("error");
    }
  };


  const handleProceedSave = () => {
    setShouldSaveDeck(true);
    handleSaveClick(true);
    setShowConfirmDialog(false);
  };

  const handleLoadDeckClick = () => {
    setShowDeckLoaderModal(true); // Open the DeckLoader modal
  };

  const handleDeckLoaded = (loadedDeckId, loadedDeckUid, loadedDeckName) => {
    // Handle the deck loaded from DeckLoader
    // You can update the DeckBuilderBar state here based on the loadedDeck data
    setDeckName(loadedDeckName);
    setLoadedDeckUid(loadedDeckUid); // Update the loadedDeckUid
    setIsUpdatingExistingDeck(true); //Update the previousDeckName
    setShowDeckLoaderModal(false); // Close the DeckLoader modal
  };

  useEffect(() => {
    if (selectedImage && shouldSaveDeck) {
      handleSaveClick(true);
      setShouldSaveDeck(false);
    }
    if (selectedImage && totalCount) {
      handleSaveClick(true);
      setShouldSaveDeck(false);
    }
  }, [selectedImage, shouldSaveDeck, handleSaveClick]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        bgcolor: "#f2f3f8",
        color: "#121212",
        zIndex: 1,
        ...props.style,
      }}
      p={2}
    >
      <Box display={"flex"} flexDirection={"row"} gap={2} sx={{ flex: "1 1 auto" }}>
        <Grid container rowSpacing={1} columnSpacing={1}>
          <Grid item xs={3}>
            <TextField
              label="Deck Name"
              variant="outlined"
              size="small"
              value={deckName}
              onChange={(event) => setDeckName(event.target.value)}
              inputProps={{ style: { color: '#121212' } }}
              sx={{ '& .MuiInputLabel-filled': { color: '#121212' }, '& .MuiFilledInput-input': { color: '#121212' } }}
            />
          </Grid>
          <Grid item xs={5}>
            <Grid container rowSpacing={1} columnSpacing={0}>
              <Grid item xs={5}>
                <img src="/icons/TTOTAL.png" alt="Total:" />{" "}
                <span style={{ color: totalCount > 50 ? "red" : "inherit" }}>
                  {totalCount}/50
                </span>
              </Grid>
              <Grid item xs={5}>
                <img src="/icons/TCOLOR.png" alt="Color:" />{" "}
                <span style={{ color: colorCount > 4 ? "red" : "inherit" }}>
                  {colorCount}/4
                </span>
              </Grid>
              <Grid item xs={5}>
                <img src="/icons/TSPECIAL.png" alt="Special:" />{" "}
                <span style={{ color: specialCount > 4 ? "red" : "inherit" }}>
                  {specialCount}/4
                </span>
              </Grid>
              <Grid item xs={5}>
                <img src="/icons/TFINAL.png" alt="Final:" />{" "}
                <span style={{ color: finalCount > 4 ? "red" : "inherit" }}>
                  {finalCount}/4
                </span>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={4}>
            <ButtonGroup size="small" aria-label="small button group">
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
              <Tooltip title="Load Deck">
                <Button onClick={handleLoadDeckClick} sx={{ color: "#121212" }}>
                  <SystemUpdateAlt />
                </Button>
              </Tooltip>
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
          </Grid>
        </Grid>
      </Box>
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
      <FullScreenDialog
        open={showDeckLoaderModal}
        handleClose={() => setShowDeckLoaderModal(false)}
        handleDeckLoaded={(deckName, deckUid, loadedDeckName) => handleDeckLoaded(deckName, deckUid, loadedDeckName)}
      />
      <Snackbar
        open={saveStatus === "success"}
        autoHideDuration={6000}
        onClose={() => setSaveStatus(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Alert onClose={() => setSaveStatus(null)} severity="success" sx={{ width: '100%' }}>
          Deck saved successfully!
        </Alert>
      </Snackbar>
      <ImagePickerModal
        open={showImagePickerModal}
        handleClose={() => setShowImagePickerModal(false)}
        images={images}
        handleImageSelected={(image) => {
          setSelectedImage(image);
          setShowImagePickerModal(false); // Close the ImagePickerModal upon selection
        }}
      />
    </Box>
  );

};

export default DeckBuilderBar;
