import {
    CommentOutlined,
    CopyAll,
    DeleteOutlined,
    Favorite,
    FavoriteBorderOutlined,
    ShareOutlined,
    Telegram,
    WhatsApp,
    X,
} from "@mui/icons-material";
import { Box, Button, Typography, Modal, SwipeableDrawer, styled, Alert } from "@mui/material";
import React, { useContext, useState, useCallback } from "react";
import { AuthContext } from "../../context/AuthContext";
import {
    arrayRemove,
    arrayUnion,
    deleteDoc,
    doc,
    getFirestore,
    runTransaction,
} from "firebase/firestore";
import { db } from "../../Firebase";

const CardFunctions = ({ deck, handleDrawerOpen, inputRef }) => {
    const authContext = useContext(AuthContext);
    const userId = authContext.currentUser?.uid;
    const [deckToDelete, setDeckToDelete] = useState(null);
    const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
    const [isLiked, setIsLiked] = useState(deck.upvotedUsers?.includes(userId));
    const [deckLinkText, setDeckLinkText] = useState(null);
    const [showAlert, setShowAlert] = useState(false);
    const Puller = styled('div')(({ theme }) => ({
        width: 30,
        height: 6,
        backgroundColor: '#101418',
        borderRadius: 3,
        position: 'absolute',
        top: 8,
        left: 'calc(50% - 15px)',
    }));
    const handleOpen = () => {
        handleDrawerOpen(deck);
        setTimeout(() => {
            if (inputRef.current) {
                console.log('current')
                inputRef.current.focus();
            }
        }, 300);
    };
    const [shareDrawerOpen, setShareDrawerOpen] = useState(false);

    const handleOpenShareDrawer = (event, id) => {
        event.stopPropagation();
        const deckLink = `${window.location.origin}/stacks/${id}`;
        setDeckLinkText(deckLink)
        setShareDrawerOpen(true);
    };

    const handleCloseShareDrawer = () => {
        setShareDrawerOpen(false);
    };

    const handleWhatsAppShare = () => {
        const text = `Check out this deck on Union: ${window.location.origin}/stacks/${deck.id}`;
        const whatsappUrl = `whatsapp://send?text=${encodeURIComponent(text)}`;

        // Open the WhatsApp app on the phone
        window.location.href = whatsappUrl;
    };

    const handleTelegramShare = () => {
        const text = `Check out this deck on Union: ${window.location.origin}/stacks/${deck.id}`;
        const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(text)}`;
   
        window.location.href = telegramUrl;
    };
    

    const handleTwitterShare = () => {
        const text = `Check out this deck on Union: ${window.location.origin}/stacks/${deck.id}`;
        console.log(text);
        const twitterUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(text)}`;

        // Open the Twitter share intent
        window.open(twitterUrl);
    };

    const handleCopyLink = (event, deckLinkText) => {
        event.stopPropagation();
        navigator.clipboard.writeText(deckLinkText)
            .then(() => {
                console.log("Link copied to clipboard");
                setShowAlert(true);
                setTimeout(() => {
                    setShowAlert(false);
                }, 2000);
            })
            .catch((error) => {
                console.error("Error copying link to clipboard:", error);
            });
    };

    const handleDeleteRequest = (id, event) => {
        event.stopPropagation();
        setDeckToDelete(id);
        setConfirmDeleteOpen(true);
    };

    const handleConfirmDelete = async () => {
        try {
            const deckRef = doc(db, 'uniondecklist', deckToDelete);
            await deleteDoc(deckRef);
            console.log("Deck successfully deleted!");
            setConfirmDeleteOpen(false);
        } catch (error) {
            console.error("Error deleting deck: ", error);
        }
    };

    const handleLikes = useCallback(async (event) => {
        event.stopPropagation();
        const deckRef = doc(db, "uniondecklist", deck.id);
        const firestore = getFirestore();

        // Optimistically update UI immediately
        setIsLiked((prevIsLiked) => !prevIsLiked);

        try {
            await runTransaction(firestore, async (transaction) => {
                const docSnapshot = await transaction.get(deckRef);
                const currentUpvotedUsers = docSnapshot.data().upvotedUsers || [];

                if (isLiked) {
                    transaction.update(deckRef, {
                        upvotedUsers: arrayRemove(userId),
                    });
                } else {
                    transaction.update(deckRef, {
                        upvotedUsers: arrayUnion(userId),
                    });
                }
            });
        } catch (error) {
            console.error("Error updating document: ", error);

            // Revert UI state on error
            setIsLiked((prevIsLiked) => !prevIsLiked);
        }
    }, [isLiked, deck.id, userId]);

    return (
        <>
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "row", // Change to column layout for comments
                    gap: "10px",
                    paddingLeft: "10px",
                    color: "#4e4e4e",
                }}
            >
                <Box onClick={(event) => handleLikes(event)}>
                    {isLiked ? (
                        <Favorite sx={{ color: "#7C4FFF" }} />
                    ) : (
                        <FavoriteBorderOutlined
                            sx={{
                                transition: "opacity 0.2s ease-in-out, color 0.2s ease-in-out",
                                opacity: 1,
                                '&:hover': {
                                    opacity: 0.7,
                                },
                                '&:active': {
                                    opacity: 0.5,
                                },
                            }}
                        />
                    )}
                </Box>
                <CommentOutlined onClick={handleOpen} />
                <ShareOutlined onClick={(event) => handleOpenShareDrawer(event, deck.id)} />
                {userId === deck.uid && (
                    <Box onClick={(event) => handleDeleteRequest(deck.id, event)}>
                        <DeleteOutlined sx={{ color: '#e33c58', opacity: '70%' }} />
                    </Box>
                )}
            </Box>
            <Modal
                open={confirmDeleteOpen}
                onClose={() => setConfirmDeleteOpen(false)}
            >
                <Box sx={{ width: '300px', margin: 'auto', marginTop: '20%', padding: '20px', backgroundColor: 'white', borderRadius: '8px' }}>
                    <Typography variant="h6" gutterBottom>
                        Are you sure you want to delete this deck?
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
                        <Button variant="outlined" onClick={() => setConfirmDeleteOpen(false)}>Cancel</Button>
                        <Button variant="contained" color="primary" onClick={handleConfirmDelete}>Delete</Button>
                    </Box>
                </Box>
            </Modal>
            <SwipeableDrawer
                anchor="bottom"
                open={shareDrawerOpen}
                onClose={handleCloseShareDrawer}
                sx={{ width: '100%', }}
                disableSwipeToOpen
                PaperProps={{ style: { backgroundColor: 'rgba(38, 38, 45, 0)' } }}
            >
                <Box sx={{ width: 'calc(100vw - 40px)', padding: '20px', backgroundColor: '#26262d', borderRadius: '20px 20px 0px 0px', color: '#f2f3f8' }}>
                    <Puller />
                    <Typography variant="h6" gutterBottom>
                        Share to
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '20px', }}>
                        <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', width: 'calc(100vw - 40px)', overflow: 'hidden', backgroundColor: '#3e3e3e', borderRadius: '7px' }}>
                            <Box sx={{ backgroundColor: '#101418', padding: '10px', width: 'calc(100vw - 100px)', overflowY: 'auto' }}>
                                {deckLinkText}
                            </Box>
                            <Box sx={{ width: '40px', overflow: 'hidden', textAlign: 'center' }} onClick={(event) => handleCopyLink(event, deckLinkText)}>
                                <CopyAll sx={{ fontSize: '20px' }} />
                            </Box>
                        </Box>
                        <Box sx={{display:'flex',flexDirection:'row',gap:'10px'}}>
                            <Box onClick={handleWhatsAppShare} sx={{ borderRadius: '30px', backgroundColor: '#3e3e3e', width: '60px', height: '60px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                <WhatsApp sx={{ fontSize: '30px',color:'#25D366' }} />
                            </Box>
                            <Box onClick={handleTwitterShare} sx={{ borderRadius: '30px', backgroundColor: '#3e3e3e', width: '60px', height: '60px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                <X sx={{ fontSize: '27px' }} />
                            </Box>
                            <Box onClick={handleTelegramShare} sx={{ borderRadius: '30px', backgroundColor: '#3e3e3e', width: '60px', height: '60px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                <Telegram sx={{ fontSize: '27px',color:'#0088cc' }} />
                            </Box>
                        </Box>
                    </Box>
                </Box>
                {showAlert &&
                    <Alert severity="info"
                        sx={{
                            position: 'fixed',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            transition: 'linear 0.3s ease-in-out',
                            zIndex: 1000, // Adjust the z-index as needed
                        }}>Copied to Clipboard</Alert>}
            </SwipeableDrawer>
        </>
    );
};

export default CardFunctions;
