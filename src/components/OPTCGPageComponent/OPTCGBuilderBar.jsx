import { MoreVert } from "@mui/icons-material";
import { Alert, Box, Button, Collapse, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton, Menu, MenuItem, Snackbar, TextField, Tooltip } from "@mui/material";
import React, { useEffect, useState } from "react";
import { OPTCGLdrCardDrawer } from "./OPTCGDrawerLeader";
import { useCardState } from "../../context/useCardState";
import { useAuth } from "../../context/AuthContext";
import { collection, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "../../Firebase";
import FullScreenDialogOPTCG from "../../components/OPTCGPageComponent/FullScreenDialogOPTCG";

const OPTCGBuilderBar = () => {
    const { currentUser } = useAuth();
    const { filteredCards, setFilteredCards } = useCardState();
    const [totalCount, setTotalCount] = useState(0);
    const [deckName, setDeckName] = useState("NewDeck");
    const [viewDeckbar, setViewDeckbar] = useState(true);
    const [openModal, setOpenModal] = useState(false);
    const [showDeckLoaderModal, setShowDeckLoaderModal] = useState(false);
    const [selectedImage, setSelectedImage] = useState("icons/OPIcon/nika_inner.png");
    const [anchorEl, setAnchorEl] = useState(null);
    const [showPadding, setShowPadding] = useState(false);
    const [saveStatus, setSaveStatus] = useState(null);
    const [shouldSaveDeck, setShouldSaveDeck] = useState(false);
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const [loadedDeckUid, setLoadedDeckUid] = useState(null);
    const [isUpdatingExistingDeck, setIsUpdatingExistingDeck] = useState(false);
    const [tooltipOpen, setTooltipOpen] = useState(true);


    useEffect(() => {
        const sortedCards = [...filteredCards].sort((a, b) => a.cost_life - b.cost_life);
        setFilteredCards(sortedCards);

        const total = sortedCards.reduce((acc, card) => acc + (card.count || 0), 0);
        setTotalCount(total);
    }, [filteredCards]);


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
        handleOpenModal();
    };

    const handleCloseModal = () => {
        setOpenModal(false);
    };

    const handleSaveClick = async (proceed = false) => {
        if (!proceed && totalCount < 50) {
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
                const userDocRef = doc(db, "users", uid);

                // Get the decksCounter from the user document
                const userDocSnapshot = await getDoc(userDocRef);
                const optcgdecksCounter = userDocSnapshot.get("optcgdecksCounter") || 0;

                // Update the decksCounter for the user
                await updateDoc(userDocRef, { optcgdecksCounter: optcgdecksCounter + 1 });

                // Generate a new deckuid based on the updated decksCounter
                deckUid = `gsdeck${String(optcgdecksCounter + 1).padStart(8, "0")}`;
            } else {
                deckUid = loadedDeckUid; // Use the loadedDeckUid when updating an existing deck
            }

            const deckDocRef = doc(db, `users/${uid}/optcgdecks`, deckUid);

            const deckInfo = {
                deckName: deckName,
                deckuid: deckUid,
                deckcover: selectedImage,
                // Add any other information about the deck as required
            };

            if (!isUpdatingExistingDeck) {
                // Create a document for the deck with the new name and deck info
                await setDoc(deckDocRef, deckInfo);
            } else {
                // Update the deck name in the existing document
                await updateDoc(deckDocRef, { deckName: deckName, ...deckInfo });
            }

            const cardsCollectionRef = collection(db, `users/${uid}/optcgdecks/${deckUid}/optcgcards`);
            console.log(filteredCards)
            await Promise.all(
                filteredCards.map(async (card) => {
                    const cardDocRef = doc(cardsCollectionRef, card.cardid);
                    const cardData = {
                        booster: card.booster,
                        cardfrom: card.cardfrom,
                        cardname: card.cardname,
                        cardname_lower: card.cardname_lower,
                        cardid: card.cardid,
                        rarity: card.rarity,
                        rarity_lower: card.rarity_lower,
                        category: card.category,
                        cost_life: card.cost_life,
                        attribute: card.attribute,
                        attribute_lower: card.attribute_lower,
                        power: card.power,
                        counter: card.counter,
                        color: card.color,
                        color_lower: card.color_lower,
                        typing: card.typing,
                        typing_lower: card.typing_lower,
                        effects: card.effects,
                        trigger: card.trigger,
                        image: card.image,
                        count: card.count,
                    };

                    try {
                        await setDoc(cardDocRef, cardData);
                        console.log("Card saved successfully:", card.cardid);
                    } catch (error) {
                        console.error("Error saving card:", error);
                    }
                    console.log(cardData, "test")
                })
            );

            console.log("Data saved successfully!");
            setSaveStatus("success");

            // Reset the component state
            handleClearClick();
            handleMenuClose();
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
        handleMenuClose();
    };
    const handleClearClick = () => {
        setFilteredCards([])
        setSelectedImage("icons/OPIcon/nika_inner.png")
        setDeckName("NewDeck")
        handleMenuClose();
    }

    return (
        <Box sx={{ width: "100%", paddingTop: showPadding ? "10px" : "0px", paddingBottom: showPadding ? "10px" : "0px", paddingLeft: "10px", paddingRight: "10px", backgroundColor: "#F2F3F8", color: "#121212", display: 'flex' }}>
            <Collapse in={viewDeckbar}>
                <Box sx={{ display: 'flex', flexDirection: 'row', gap: '10px', alignItems: 'center' }}>
                    <Tooltip title="Click to change the deck cover!" open={selectedImage === "icons/OPIcon/nika_inner.png" && tooltipOpen}>
                        <Box sx={{
                            width: { xs: '60px', sm: '95px' }, height: { xs: '60px', sm: '95px' }, flex: '0 0 auto',
                            border: '4px solid #4a2f99', overflow: 'hidden', borderRadius: '10px',
                            display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer',
                        }}
                            onClick={handleBoxClick}>
                            <img style={{ width: '110%', marginTop: '40%' }} src={selectedImage} alt="ldr" />
                        </Box>
                    </Tooltip>
                    <Box sx={{ display: 'flex', flexDirection: { xs: 'row', sm: 'column' }, gap: '10px' }}>
                        <TextField
                            label="Deck Name"
                            variant="outlined"
                            size="small"
                            value={deckName}
                            onChange={(event) => setDeckName(event.target.value)}
                            inputProps={{ style: { color: '#121212' } }}
                            sx={{ '& .MuiInputLabel-filled': { color: '#121212' }, '& .MuiFilledInput-input': { color: '#121212' } }}
                        />
                        <Box sx={{ display: { xs: 'flex', sm: 'none' } }}>
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
                            </Menu>
                        </Box>
                        <Box sx={{ display: { xs: 'none', sm: 'flex' }, flexDirection: 'row', gap: '10px' }}>
                            <Button sx={{ fontSize: '10px', bgcolor: '#4a2f99', color: '#f2f3f8', '&:hover': { bgcolor: '#240056', color: '#7C4FFF' } }} onClick={handleClearClick}>clear</Button>
                            <Button sx={{ fontSize: '10px', bgcolor: '#4a2f99', color: '#f2f3f8', '&:hover': { bgcolor: '#240056', color: '#7C4FFF' } }} onClick={() => handleSaveClick(false)}>save</Button>
                            <Button sx={{ fontSize: '10px', bgcolor: '#4a2f99', color: '#f2f3f8', '&:hover': { bgcolor: '#240056', color: '#7C4FFF' } }} onClick={handleLoadDeckClick}>load</Button>
                        </Box>
                    </Box>
                </Box>
            </Collapse>
            <Button disableRipple sx={{ marginLeft: 'auto', bgcolor: '#f2f3f8', '&:hover': { bgcolor: '#f2f3f8' } }} onClick={() => setViewDeckbar(prev => !prev)}>
                {viewDeckbar ? <><img style={{ width: '30px' }} alt="nika" src="icons/OPIcon/nika_inner.png" /></> : <><img alt="nika" style={{ width: '30px' }} src="icons/OPIcon/nika_outer.png" /></>}
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
            <FullScreenDialogOPTCG
                open={showDeckLoaderModal}
                handleClose={() => setShowDeckLoaderModal(false)}
                handleDeckLoaded={(deckUid, deckname, deckcover) => handleDeckLoaded(deckUid, deckname, deckcover)}
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
            <OPTCGLdrCardDrawer
                open={openModal}
                onClose={handleCloseModal}
                selectedImage={selectedImage}
                setSelectedImage={setSelectedImage} />
        </Box>
    )
}

export default OPTCGBuilderBar