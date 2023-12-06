import {
    CommentOutlined,
    DeleteOutlined,
    Favorite,
    FavoriteBorderOutlined,
    ShareOutlined,
} from "@mui/icons-material";
import { Box, Button, Typography, Modal } from "@mui/material";
import React, { useContext, useState, useCallback, useEffect } from "react";
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

    const handleOpen = () => {
        handleDrawerOpen(deck);
        setTimeout(() => {
            if (inputRef.current) {
                console.log('current')
              inputRef.current.focus();
            }
          }, 300);
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
                <ShareOutlined />
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
        </>
    );
};

export default CardFunctions;
