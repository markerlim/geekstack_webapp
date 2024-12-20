import { Close, MoreVert } from "@mui/icons-material";
import {
  Alert,
  Box,
  Button,
  Collapse,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Menu,
  MenuItem,
  Modal,
  Snackbar,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../Firebase";
import { useLocation } from "react-router-dom";
import { useCRBCardState } from "../../context/useCardStateCookieRun";
import FullScreenDialogCRBTCG from "./FullScreenDialogCRBTCG";


const CRBTCGBuilderBar = ({ changeClick, setChangeClick }) => {
  const { currentUser } = useAuth();
  const { filteredCards, setFilteredCards } = useCRBCardState();
  const [totalCount, setTotalCount] = useState(0);
  const [deckName, setDeckName] = useState("NewDeck");
  const [viewDeckbar, setViewDeckbar] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [showDeckLoaderModal, setShowDeckLoaderModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState("icons/cookierun.webp");
  const [anchorEl, setAnchorEl] = useState(null);
  const [showPadding, setShowPadding] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null);
  const [shouldSaveDeck, setShouldSaveDeck] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [loadedDeckUid, setLoadedDeckUid] = useState(null);
  const [isUpdatingExistingDeck, setIsUpdatingExistingDeck] = useState(false);
  const [chosenCardUrl, setChosenCardUrl] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tooltipOpen, setTooltipOpen] = useState(true);
  const sortedCards = [...filteredCards].sort(
    (a, b) => a.cost_life - b.cost_life
  );
  const sorttotalCount = sortedCards.reduce(
    (acc, card) => acc + (card.count || 0),
    0
  );

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);

  console.log(currentUser);
  useEffect(() => {
    if (changeClick === true) {
      setFilteredCards(sortedCards);
      setTotalCount(sorttotalCount);
      console.log("Card count changed! TRUE");
    }
    if (changeClick === false) {
      setFilteredCards(sortedCards);
      setTotalCount(sorttotalCount);
      console.log("Card count changed! FALSE");
    }
  }, [changeClick]);

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

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleBoxClick = () => {
    setTooltipOpen(false); // Hide the tooltip when the box is clicked
    setIsModalOpen(true);
    handleOpenModal();
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };
  const createNewDeck = async (uid) => {
    const userDocRef = doc(db, "users", uid);

    // Get the decksCounter from the user document
    const userDocSnapshot = await getDoc(userDocRef);
    const crbtcgdecksCounter = userDocSnapshot.get("crbtcgdecksCounter") || 0;

    // Update the decksCounter for the user
    await updateDoc(userDocRef, { crbtcgdecksCounter: crbtcgdecksCounter + 1 });

    // Generate a new deckuid based on the updated decksCounter
    const deckUid = `gsdfdeck${String(crbtcgdecksCounter + 1).padStart(
      8,
      "0"
    )}`;
    const deckDocRef = doc(db, `users/${uid}/crbtcgdecks`, deckUid);

    const deckInfo = {
      deckName: deckName,
      deckuid: deckUid,
      deckcover: selectedImage,
      // Add any other information about the deck as required
    };
    // Create a document for the deck with the new name and deck info
    await setDoc(deckDocRef, deckInfo);

    // Create a placeholder document in the `crbtcgdecks` collection if it doesn't exist yet
    const placeholderRef = doc(db, `users/${uid}/crbtcgdecks`, "placeholder");
    if (!(await getDoc(placeholderRef)).exists()) {
      await setDoc(placeholderRef, {
        placeholder: true,
        // any other default values you'd like to set
      });
    }

    return deckUid; // return this value so we can use it in handleSaveClick
  };
  const updateExistingDeck = async (uid, deckUid) => {
    const deckDocRef = doc(db, `users/${uid}/crbtcgdecks`, deckUid);

    const deckInfo = {
      deckName: deckName,
      deckuid: deckUid,
      deckcover: selectedImage,
    };
    await updateDoc(deckDocRef, { deckName: deckName, ...deckInfo });
  };

  const handleSaveClick = async (proceed = false) => {
    if (!proceed && totalCount < 60) {
      setShowConfirmDialog(true);
      return;
    }

    if (!currentUser) {
      return;
    }

    const uid = currentUser.uid;

    try {
      let deckUid;
      if (!isUpdatingExistingDeck) {
        deckUid = await createNewDeck(uid);
      } else {
        deckUid = loadedDeckUid;
        await updateExistingDeck(uid, deckUid);
      }

      const cardsCollectionRef = collection(
        db,
        `users/${uid}/crbtcgdecks/${deckUid}/crbtcgcards`
      );
      const existingCardSnapshot = await getDocs(cardsCollectionRef);
      const existingCards = existingCardSnapshot.docs.map(
        (doc) => doc.data().cardUid
      );

      await Promise.all(
        filteredCards.map(async (card) => {
          const cardDocRef = doc(cardsCollectionRef, card.cardUid);
          const cardData = {
            crb_id: card.id,
            elementId: card.elementId,
            title: card.title,
            artistTitle: card.artistTitle,
            productTitle: card.productTitle,
            cardDescription: card.cardDescription,
            rarity: card.rarity,
            hp: card.hp,
            cardUid: card.cardUid,
            cardId: card.cardId,
            grade: card.grade,
            urlimage: card.urlimage,
            productCategory: card.productCategory,
            productCategoryTitle: card.productCategoryTitle,
            cardType: card.cardType,
            cardTypeTitle: card.cardTypeTitle,
            energyType: card.energyType,
            energyTypeTitle: card.energyTypeTitle,
            cardLevel: card.cardLevel,
            cardLevelTitle: card.cardLevelTitle,
            boostercode: card.boostercode,
            count: card.count,
          };

          try {
            await setDoc(cardDocRef, cardData);
            console.log("Card saved successfully:", card.cardUid);
          } catch (error) {
            console.error("Error saving card:", error);
          }
        })
      );

      for (const cardUid of existingCards) {
        if (!filteredCards.some((card) => card.cardUid === cardUid)) {
          const cardToDeleteRef = doc(cardsCollectionRef, cardUid);
          await deleteDoc(cardToDeleteRef);
          console.log("Card deleted:", cardUid);
        }
      }

      console.log("Data saved successfully!");
      setSaveStatus("success");
      // Reset the component state
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

  const handleDeckLoaded = (deckUid, deckname, deckcover) => {
    setDeckName(deckname);
    setSelectedImage(deckcover);
    setLoadedDeckUid(deckUid);
    setIsUpdatingExistingDeck(true);
    setShowDeckLoaderModal(false);
    setChangeClick((prevState) => !prevState);
    handleMenuClose();
  };
  const handleClearClick = () => {
    setFilteredCards([]);
    setIsUpdatingExistingDeck(false);
    setTotalCount(0);
    setSelectedImage("icons/cookierun.webp");
    setDeckName("NewDeck");
    handleMenuClose();
  };

  const handleClipboard = () => {
    const clipboardString = filteredCards
      .map((card) => `${card.count}x${card.cardid}`)
      .join("\n");

    navigator.clipboard
      .writeText(clipboardString)
      .then(() => {
        alert("Copied to clipboard");
      })
      .catch((err) => {
        console.error("Error copying to clipboard", err);
      });
    handleMenuClose();
  };

  useEffect(() => {
    // Check for 'deckId' parameter in the URL
    const deckUid = searchParams.get("deckUid");
    const fetchDeckData = async () => {
      // Fetch the deck information using the deckUid
      const deckSnapshot = await getDoc(
        doc(db, `users/${currentUser.uid}/crbtcgdecks`, deckUid)
      );
      const deck = deckSnapshot.data();

      // If the deck doesn't exist, return early
      if (!deck) return;

      const querySnapshot = await getDocs(
        collection(
          db,
          `users/${currentUser.uid}/crbtcgdecks/${deckUid}/crbtcgcards`
        )
      );

      // Convert the fetched data to an array of cards
      const cards = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Set the state directly with the fetched cards
      setFilteredCards(cards);
      setTotalCount(cards.reduce((acc, card) => acc + (card.count || 0), 0));
      // Update other states with the deck information
      setDeckName(deck.deckName || "NewDeck"); // Using "NewDeck" as a fallback
      setSelectedImage(deck.deckcover || "icons/cookierun.webp"); // Fallback to a default image
      setLoadedDeckUid(deckUid);
      setIsUpdatingExistingDeck(true);
    };

    if (deckUid) {
      fetchDeckData();
    }
  }, [location]);

  const handleCardSelect = (cardUrl) => {
    setChosenCardUrl(cardUrl);
    setSelectedImage(cardUrl);
  };

  useEffect(() => {
    if (saveStatus === "success") {
      handleClearClick();
      console.log("cleared");
    }
  }, [saveStatus]);

  return (
    <Box
      sx={{
        width: "100%",
        paddingTop: showPadding ? "10px" : "0px",
        paddingBottom: showPadding ? "10px" : "0px",
        paddingLeft: "10px",
        paddingRight: "10px",
        backgroundColor: "#F2F3F8",
        color: "#121212",
        display: "flex",
      }}
    >
      <Collapse in={viewDeckbar}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            gap: "10px",
            alignItems: "center",
          }}
        >
          <Tooltip
            title="Click to change the deck cover!"
            open={
              selectedImage === "icons/OPIcon/nika_inner.png" && tooltipOpen
            }
          >
            <Box
              sx={{
                width: { xs: "60px", sm: "95px" },
                height: { xs: "60px", sm: "95px" },
                flex: "0 0 auto",
                border: "4px solid #4a2f99",
                overflow: "hidden",
                borderRadius: "10px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                cursor: "pointer",
              }}
              onClick={handleBoxClick}
            >
              <img
                style={{ width: "110%", marginTop: "40%" }}
                src={selectedImage}
                alt="ldr"
              />
            </Box>
          </Tooltip>
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "row", sm: "column" },
              gap: "10px",
            }}
          >
            <TextField
              label="Deck Name"
              variant="outlined"
              size="small"
              value={deckName}
              onChange={(event) => setDeckName(event.target.value)}
              inputProps={{ style: { color: "#121212" } }}
              sx={{
                "& .MuiInputLabel-filled": { color: "#121212" },
                "& .MuiFilledInput-input": { color: "#121212" },
              }}
            />
            <span
              style={{
                color: totalCount >= 60 ? "red" : "#121212",
                fontWeight: "bold",
              }}
            >
              Total: {totalCount}
            </span>{" "}
            <Box sx={{ display: { xs: "flex", sm: "none" } }}>
              <IconButton onClick={handleMenuOpen}>
                <MoreVert />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
              >
                <MenuItem onClick={handleClearClick}>clear</MenuItem>
                <MenuItem onClick={() => handleSaveClick(false)}>save</MenuItem>
                <MenuItem onClick={handleLoadDeckClick}>load</MenuItem>
                <MenuItem onClick={handleClipboard}>clipboard</MenuItem>
              </Menu>
            </Box>
            <Box
              sx={{
                display: { xs: "none", sm: "flex" },
                flexDirection: "row",
                gap: "10px",
              }}
            >
              <Button
                sx={{
                  fontSize: "10px",
                  bgcolor: "#4a2f99",
                  color: "#f2f3f8",
                  "&:hover": { bgcolor: "#240056", color: "#7C4FFF" },
                }}
                onClick={handleClearClick}
              >
                clear
              </Button>
              <Button
                sx={{
                  fontSize: "10px",
                  bgcolor: "#4a2f99",
                  color: "#f2f3f8",
                  "&:hover": { bgcolor: "#240056", color: "#7C4FFF" },
                }}
                onClick={() => handleSaveClick(false)}
              >
                save
              </Button>
              <Button
                sx={{
                  fontSize: "10px",
                  bgcolor: "#4a2f99",
                  color: "#f2f3f8",
                  "&:hover": { bgcolor: "#240056", color: "#7C4FFF" },
                }}
                onClick={handleLoadDeckClick}
              >
                load
              </Button>
            </Box>
          </Box>
        </Box>
      </Collapse>
      <Button
        disableRipple
        sx={{
          marginLeft: "auto",
          bgcolor: "#f2f3f8",
          "&:hover": { bgcolor: "#f2f3f8" },
        }}
        onClick={() => setViewDeckbar((prev) => !prev)}
      >
        {viewDeckbar ? (
          <>
            <img
              style={{ width: "30px" }}
              alt="nika"
              src="icons/OPIcon/nika_inner.png"
            />
          </>
        ) : (
          <>
            <img
              alt="nika"
              style={{ width: "30px" }}
              src="icons/OPIcon/nika_outer.png"
            />
          </>
        )}
      </Button>
      <Dialog
        open={showConfirmDialog}
        onClose={() => setShowConfirmDialog(false)}
      >
        <DialogTitle>{"Save incomplete deck?"}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Your deck has less than 60 cards. Do you want to save it anyway?
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
      <FullScreenDialogCRBTCG
        open={showDeckLoaderModal}
        handleClose={() => setShowDeckLoaderModal(false)}
        handleDeckLoaded={(deckUid, deckname, deckcover) =>
          handleDeckLoaded(deckUid, deckname, deckcover)
        }
      />
      <Snackbar
        open={saveStatus === "success"}
        autoHideDuration={6000}
        onClose={() => setSaveStatus(null)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        sx={{
          height: "100%",
        }}
      >
        <Alert
          onClose={() => setSaveStatus(null)}
          severity="success"
          sx={{ width: "100%" }}
        >
          Deck saved successfully!
          <br />
          Please load your deck to view/edit.
        </Alert>
      </Snackbar>
      <CardPickerModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        filteredCards={filteredCards}
        onCardSelect={handleCardSelect}
      />
    </Box>
  );
};

const CardPickerModal = ({ open, onClose, filteredCards, onCardSelect }) => {
  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          bgcolor: "#26262d",
          color: "#f2f3f8",
          padding: "20px",
          borderRadius: "10px",
          height: "80%",
          width: "80%",
          maxWidth: "500px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography variant="h6" gutterBottom>
          Pick a Card
        </Typography>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            flexWrap: "wrap",
            gap: "10px",
            width: "100%",
            height: "100%",
            overflowY: "auto",
          }}
        >
          {filteredCards &&
            filteredCards.map((card, index) => (
              <Box
                key={index}
                sx={{
                  width: "80px",
                  height: "120px",
                  cursor: "pointer",
                  border: "2px solid transparent",
                  borderRadius: "8px",
                  overflow: "hidden",
                  "&:hover": {
                    borderColor: "#d14a5b",
                  },
                }}
                onClick={() => {
                  onCardSelect(card.urlimage || card.image);
                  onClose(); // Close modal after card selection
                }}
              >
                <img
                  src={card.urlimage || card.image}
                  alt={`Card ${index + 1}`}
                  style={{ width: "100%", height: "100%" }}
                />
              </Box>
            ))}
        </Box>
        <IconButton
          onClick={onClose}
          sx={{
            position: "absolute",
            top: "10px",
            right: "10px",
            color: "#fff",
          }}
        >
          <Close />
        </IconButton>
      </Box>
    </Modal>
  );
};

export default CRBTCGBuilderBar;
