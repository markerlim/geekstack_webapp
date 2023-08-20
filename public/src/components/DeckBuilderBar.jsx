import React, { useEffect, useState } from "react";
import { Box, Button, Collapse, Grid, TextField, Typography } from "@mui/material";
import { Delete, Save, Sort, SystemUpdateAlt } from "@mui/icons-material";
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
import { collection, deleteDoc, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
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
  const [viewDeckbar, setViewDeckbar] = useState(false);
  const [showPadding, setShowPadding] = useState(false);

  const images = [
    "/images/deckimage.jpg",
    "/images/deckimage1.jpg",
    "/images/deckimage2.jpg",
    "/images/deckimage3.jpg",
    "/images/deckimage4.jpg",
    "/images/deckimage5.jpg",
    "/images/deckimage6.jpg",
    "/images/deckimage7.jpg",
    "/images/deckimage8.jpg",
    "/images/deckimage9.jpg",
    "/images/deckimage10.jpg",
  ];

  const handleClearClick = () => {
    setCountArray({});
    setToLocalStorage("countArray", {});
    setToLocalStorage("filteredCards", []);
    setDeckName("myDeckId");
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
  // Filter the cards based on the triggerState that are special
  const specialCards = filteredCards.filter(card => card.triggerState === "Special");

  const specialCount = specialCards.reduce(
    (accumulator, card) => accumulator + (countArray[card.cardId] || 0),
    0
  );

  // Filter the cards based on the triggerState that are final
  const finalCards = filteredCards.filter(card => card.triggerState === "Final");

  const finalCount = finalCards.reduce(
    (accumulator, card) => accumulator + (countArray[card.cardId] || 0),
    0
  );

  const calculateStats = () => {
    const energyCounts = filteredCards.reduce((acc, card) => {
      acc[card.energycost] = (acc[card.energycost] || 0) + card.count;
      return acc;
    }, {});

    return energyCounts;
  };

  const stats = calculateStats();

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

      const cardsCollectionRef = collection(
        db,
        `users/${uid}/decks/${deckUid}/cards`
      );

      await Promise.all(
        Object.entries(countArray).map(async ([cardId, cardCount]) => {
          const card = filteredCards.find((card) => card.cardId === cardId);
          const cardDocRef = doc(cardsCollectionRef, cardId);

          if (cardCount === 0) {
            console.log("Deleting card with cardId:", cardId);
            await deleteDoc(cardDocRef)
              .then(() => {
                console.log("Card deleted successfully:", cardId);
              })
              .catch((error) => {
                console.error("Error deleting card:", error);
              });
          } else {
            if (card) {
              const cardData = {
                anime: card.anime,
                apcost: card.apcost,
                basicpower: card.basicpower,
                booster: card.booster,
                cardId: card.cardId,
                cardName: card.cardName,
                category: card.category,
                color: card.color,
                effect: card.effect,
                energycost: card.energycost,
                energygen: card.energygen,
                image: card.image,
                traits: card.traits,
                trigger: card.trigger,
                triggerState: card.triggerState,
                count: cardCount,
              };
              await setDoc(cardDocRef, cardData);
            } else {
              console.error("Card not found in filteredCards:", cardId);
            }
          }
        })
      );

      console.log("Data saved successfully!");
      setSaveStatus("success");

      // Reset the component state
      handleClearClick();
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

  const sortCards = () => {
    if (props.onSortCards) {
      props.onSortCards();
    }
  };

  const buttonBackgroundColor = props.sortCards ? "#240056" : "#d0cbdf";
  const buttonFontColor = props.sortCards ? "#10c5a3" : "#240056";

  const getImageSrc = (energycost) => {
    switch (energycost) {
      case 0:
        return "/images/ENERGY0.png"
      case 1:
        return "/images/ENERGY1.png";
      case 2:
        return "/images/ENERGY2.png";
      case 3:
        return "/images/ENERGY3.png";
      case 4:
        return "/images/ENERGY4.png";
      case 5:
        return "/images/ENERGY5.png";
      case 6:
        return "/images/ENERGY6.png";
      case 7:
        return "/images/ENERGY7.png";
      case 8:
        return "/images/ENERGY8.png";
      case 9:
        return "/images/ENERGY9.png";
      case 10:
        return "/images/ENERGY10.png";
      // Add more cases as needed
      default:
        return "/images/ENERGYDEFAULT.png";
    }
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

  
  useEffect(() => {
    if (viewDeckbar) {
        setShowPadding(true);
    } else {
        // 300ms is the default transition duration for Collapse.
        // Adjust if you've set a different duration.
        setTimeout(() => {
            setShowPadding(false);
        }, 300);
    }
    // Clear the timeout when the component is unmounted
    return () => clearTimeout();
}, [viewDeckbar]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        bgcolor: "#f2f3f8",
        color: "#121212",
        zIndex: 1,
        paddingTop: showPadding ? "10px":"0px",paddingBottom: showPadding ? "10px":"0px",paddingLeft: "10px", paddingRight:"10px",
        ...props.style,
      }}
    >
      <Collapse in={viewDeckbar}>
        <Box display={"flex"} flexDirection={"row"} gap={2}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: "5px" }}>
            <Box sx={{ display: 'flex', flexDirection: 'row', gap: '10px', alignItems: 'center' }}>
              <Box>
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
              <Box sx={{ fontSize: 11 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                  <Box sx={{ display: 'flex', flexDirection: 'row', gap: '10px' }}>
                    <Box sx={{ display: "flex", flexDirection: "row", gap: 1, alignItems: "center" }}>
                      <img src="/icons/TTOTAL.png" alt="Total:" />{" "}
                      <span style={{ color: totalCount > 50 ? "red" : "inherit" }}>
                        {totalCount}<span className="mobile-hidden">/50</span>
                      </span>
                    </Box>
                    <Box sx={{ display: "flex", flexDirection: "row", gap: 1, alignItems: "center" }}>
                      <img src="/icons/TCOLOR.png" alt="Color:" />{" "}
                      <span style={{ color: colorCount > 4 ? "red" : "inherit" }}>
                        {colorCount}<span className="mobile-hidden">/4</span>
                      </span>
                    </Box>
                  </Box>
                  <Box sx={{ display: 'flex', flexDirection: 'row', gap: '10px' }}>
                    <Box sx={{ display: "flex", flexDirection: "row", gap: 1, alignItems: "center" }}>
                      <img src="/icons/TSPECIAL.png" alt="Special:" />{" "}
                      <span style={{ color: specialCount > 4 ? "red" : "inherit" }}>
                        {specialCount}<span className="mobile-hidden">/4</span>
                      </span>
                    </Box>
                    <Box sx={{ display: "flex", flexDirection: "row", gap: 1, alignItems: "center" }}>
                      <img src="/icons/TFINAL.png" alt="Final:" />{" "}
                      <span style={{ color: finalCount > 4 ? "red" : "inherit" }}>
                        {finalCount}<span className="mobile-hidden">/4</span>
                      </span>
                    </Box>
                  </Box>
                </Box>
              </Box>
            </Box>
            <Box>
              <Box style={{ display: "flex", flexDirection: "row", gap: 5, flexWrap: "wrap" }}>
                {Array.from({ length: 11 }).map((_, index) => (
                  <Box key={index} style={{ display: "flex", alignItems: "center", fontSize: "16px", }}>
                    <img src={getImageSrc(index)} alt={`Energy cost ${index}`} width="30px" height="auto" />
                    <span>:{stats[index] || 0}</span>
                  </Box>
                ))}
              </Box>
            </Box>
            <Box style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 10 }}>
              <Button sx={{
                borderRadius: "5px", backgroundColor: buttonBackgroundColor,
                "&:hover": {
                  backgroundColor: buttonBackgroundColor, // Set hover background color same as normal state
                },
              }} onClick={props.onSortClick}>
                <Sort sx={{
                  fontSize: "11px", color: buttonFontColor, fontWeight: "600", "&:hover": {
                    Color: buttonFontColor, // Set hover background color same as normal state
                  },
                }} />
                <Typography sx={{
                  fontSize: "10px", color: buttonFontColor, fontWeight: "600", "&:hover": {
                    Color: buttonFontColor, // Set hover background color same as normal state
                  },
                }} component="div">
                  {props.sortCards ? "Sorted Mode" : "Unsort Mode"}
                </Typography>
              </Button>
              <Button sx={{ backgroundColor: "#240056", borderRadius: "5px" }} onClick={handleClearClick}>
                <Delete sx={{ fontSize: "10px", color: "#10c5a3", fontWeight: "600" }} />
                <Typography sx={{ fontSize: "10px", color: "#10c5a3", fontWeight: "600" }} component="div">
                  Clear
                </Typography>
              </Button>
              <Button sx={{ backgroundColor: "#240056", borderRadius: "5px" }} onClick={handleLoadDeckClick}>
                <SystemUpdateAlt sx={{ fontSize: "10px", color: "#10c5a3", fontWeight: "600" }} />
                <Typography sx={{ fontSize: "10px", color: "#10c5a3", fontWeight: "600" }} component="div">
                  Load
                </Typography>
              </Button>
              <Button sx={{ backgroundColor: "#240056", borderRadius: "5px" }} onClick={() => handleSaveClick(false)}>
                <Save sx={{ fontSize: "10px", color: "#10c5a3", fontWeight: "600" }} />
                <Typography sx={{ fontSize: "10px", color: "#10c5a3", fontWeight: "600" }} component="div">
                  Save
                </Typography>
              </Button>
            </Box>
          </Box>
        </Box >
      </Collapse>
      <Button disableRipple sx={{ marginLeft: 'auto', bgcolor: '#f2f3f8', '&:hover': { bgcolor: '#f2f3f8' } }} onClick={() => setViewDeckbar(prev => !prev)}>
        {viewDeckbar ? <><img style={{ width: '110px' }} alt="gojo" src="http://localhost:3000/icons/gojo_inner.png" /></> : <><img alt="gojo" style={{ width: '30px' }} src="http://localhost:3000/icons/gojo_outer.png" /></>}
      </Button>
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
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        sx={{
          height: "100%"
        }}
      >
        <Alert onClose={() => setSaveStatus(null)} severity="success" sx={{ width: '100%' }}>
          Deck saved successfully!
          <br />Please load your deck to view/edit.
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
    </Box >
  );

};

export default DeckBuilderBar;
