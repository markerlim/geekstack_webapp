import { ArrowBack, BookmarkBorderOutlined, CommentOutlined, FavoriteBorderOutlined, Pentagon, Search, Send } from "@mui/icons-material";
import { Avatar, Box, Input, List, ListItem, ListItemAvatar, SwipeableDrawer, Typography } from "@mui/material";
import React, { useCallback, useEffect, useState } from "react";
import CommentPill from "./CommentPill";
import { useNavigate, useParams } from "react-router-dom";
import { arrayUnion, doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../Firebase";
import { ResponsiveImage } from "../ResponsiveImage";

function formatDate(date) {
    const day = date.getDate();
    const monthIndex = date.getMonth();
    const year = date.getFullYear();

    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];

    const monthName = monthNames[monthIndex];

    return `${day} ${monthName} ${year}`;
}

const SingleCardDrawer = ({ uid, setDrawerOpen, drawerOpen }) => {
    const grabbingParams = useParams();
    const paramsUid = grabbingParams.id;
    const navigate = useNavigate();
    const [commentText, setCommentText] = useState("");
    const [comments, setComments] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [data, setData] = useState([]);
    const [showAllComments, setShowAllComments] = useState(false);
    const maxVisibleComments = 3;

    const handleDrawerClose = useCallback(() => {
        setDrawerOpen(false);
        setCommentText("");
        setComments([]);
        setIsSubmitting(false);
        navigate('/stacks')
    }, []);

    useEffect(() => {
        const fetchDeckDetailsData = async () => {
            if (paramsUid) {
                try {
                    const deckRef = doc(db, "uniondecklist", paramsUid);
                    const deckSnapshot = await getDoc(deckRef);

                    if (deckSnapshot.exists()) {
                        // Fetch additional data based on the selectedDeck UID
                        const userData = await fetchUserData(deckSnapshot.data().uid);
                        const date = deckSnapshot.data().sharedDate.toDate();
                        const formattedDate = formatDate(date);

                        const fetchedDeckData = {
                            ...deckSnapshot.data(),
                            photoURL: userData.photoURL,
                            displayName: userData.displayName,
                            id: paramsUid,
                            sharedDateOnly: formattedDate
                        };
                        setData(fetchedDeckData);
                        setComments(fetchedDeckData?.comments);
                    } else {
                        console.error("Deck data not found for deck UID:", paramsUid);
                    }
                } catch (error) {
                    console.error("Error fetching deck data from Firestore: ", error);
                }
            }
        };

        const fetchUserData = async (uid) => {
            try {
                const userRef = doc(db, "users", uid);
                const userSnapshot = await getDoc(userRef);

                if (userSnapshot.exists()) {
                    return userSnapshot.data();
                } else {
                    console.error("User data not found for UID:", uid);
                    // Handle the case where the user data is not found
                    return {};
                }
            } catch (error) {
                console.error("Error fetching user data from Firestore: ", error);
                return {};
            }
        };

        if (paramsUid) {
            fetchDeckDetailsData();
        }
    }, [paramsUid]);

    const handleCommentSubmit = async (uid) => {
        console.log('logging comments');
        const newComment = { uid: uid, text: commentText, timestamp: new Date() };

        // Optimistically update the UI
        setComments((prevComments) => {
            if (!Array.isArray(prevComments)) {
                console.error("prevComments is not an array:", prevComments);
                return [];
            }
            return [...prevComments, newComment];
        });        setCommentText("");
        setIsSubmitting(true);

        try {
            // Simulate backend delay
            await new Promise(resolve => setTimeout(resolve, 1000));

            const deckRef = doc(db, "uniondecklist", data.id);
            await updateDoc(deckRef, {
                comments: arrayUnion(newComment),
            });

            // If the backend update is successful, get the updated comments
            const updatedDeckSnapshot = await getDoc(deckRef);
            const updatedComments = updatedDeckSnapshot.data().comments || [];

            setComments(updatedComments);

            // If the backend update is successful, setIsSubmitting to false
            setIsSubmitting(false);
        } catch (error) {
            console.error("Error updating comments in Firestore: ", error);

            // If the backend update fails, revert the optimistic update
            setComments((prevComments) => prevComments.slice(0, -1));
            setIsSubmitting(false);
        }
    };

    const handleDeleteComment = async (commentIndex) => {
        console.log('deleting')
        try {
            // Optimistically update the UI
            setComments((prevComments) => prevComments.filter((_, index) => index !== commentIndex));

            const deckRef = doc(db, "uniondecklist", data.id);
            await updateDoc(deckRef, {
                comments: comments.filter((_, index) => index !== commentIndex),
            });
        } catch (error) {
            console.error("Error deleting comment in Firestore: ", error);

            // If the backend deletion fails, revert the optimistic update
            setComments((prevComments) => [...prevComments]);
        }
    };

    const calculateTimeSincePost = (sharedDate) => {
        let TimeStamp;

        if (sharedDate instanceof Date) {
            // If comment.timestamp is already a JavaScript Date
            TimeStamp = sharedDate;
        } else if (sharedDate && sharedDate.toDate instanceof Function) {
            // If comment.timestamp is a Firestore Timestamp, convert it to JavaScript Date
            TimeStamp = sharedDate.toDate();
        } else {
            // Handle the case where comment.timestamp is neither a Date nor a Firestore Timestamp
            return "Invalid timestamp";
        }

        const currentTime = new Date();
        const timeDifference = currentTime - TimeStamp;

        const seconds = Math.floor(timeDifference / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);

        if (days > 0) {
            return `${days}d ago`;
        } else if (hours > 0) {
            return `${hours}h ago`;
        } else if (minutes > 0) {
            return `${minutes}m ago`;
        } else {
            return `${seconds}s ago`;
        }
    };

    const handleSeeMoreToggle = () => {
        setShowAllComments(!showAllComments);
    };

    useEffect(() => {
        const fetchComments = async () => {
            try {
                const deckRef = doc(db, "uniondecklist", data.id);
                const deckSnapshot = await getDoc(deckRef);
                const fetchedComments = deckSnapshot.data().comments || [];

                setComments(fetchedComments);
            } catch (error) {
                console.error("Error fetching comments from Firestore: ", error);
            }
        };

        if (drawerOpen) {
            fetchComments();
        }
    }, [drawerOpen]);

    return (
        <SwipeableDrawer
            anchor="right"
            open={drawerOpen}
            onOpen={() => { }}
            onClose={handleDrawerClose}
            disableSwipeToOpen={true}>
            <Box sx={{ position: 'sticky', display: 'flex', flexDirection: 'row', padding: '10px', backgroundColor: '#26252d', justifyContent: 'space-between', width: 'calc(100vw - 20px)', alignItems: 'center' }}>
                <ArrowBack onClick={handleDrawerClose} sx={{ color: '#f2f3f8' }} />
                <Box sx={{ display: 'flex', flexDirection: 'row', gap: '5px', alignItems: 'center' }}>
                    <Box sx={{ borderRadius: '20px', border: '4px solid #26262d', width: '30px', height: '30px', display: 'flex', alignItems: 'middle', overflow: 'hidden', backgroundColor: '#7C4FFF' }}>
                        {data.photoURL ? <img src={data.photoURL} alt={data.photoURL} style={{ width: '40px', height: 'auto' }} /> :
                            <div
                                style={{
                                    display: 'none',
                                    width: '30px',
                                    height: '30px',
                                    textAlign: 'center',
                                    lineHeight: '30px',
                                    color: '#f2f3f8'
                                }}
                            >
                                {data.displayName?.charAt(0)?.toUpperCase()}
                            </div>}
                    </Box>
                    <Box sx={{ fontSize: '14px', color: '#f2f8fc', fontWeight: '900' }}>{data.displayName}</Box>
                </Box>
                <Search sx={{ color: '#f2f3f8' }} />
            </Box>
            <Box sx={{ width: 'calc(100vw)', height: 'calc(100vh)', backgroundColor: '#26252d', overflowY: 'auto' }}>
                {data.cards && data.cards.length > 0 ? (
                    <Box sx={{ display: "flex", width: { xs: "100%", sm: "500px", md: "700px" }, backgroundColor: '#121212', justifyContent: "center", paddingTop: '10px', paddingBottom: '10px' }}>
                        <Box sx={{ display: "flex", justifyContent: "center", flexWrap: "wrap", paddingTop: "10px", gap: "10px", }}>
                            {data.cards.map((card, index) => (
                                <div style={{ position: "relative" }}>
                                    <Box sx={{ position: "absolute", bottom: "15px", left: "50%", transform: "translateX(-50%)", zIndex: "3" }}>
                                        <div style={{ fontSize: "20px", color: "#74CFFF" }}><strong>{card.count}</strong></div>
                                    </Box>
                                    <Box sx={{ position: "absolute", bottom: "5px", left: "50%", transform: "translateX(-50%)", zIndex: "2" }}>
                                        <Pentagon sx={{ fontSize: '40px', color: '#11172d' }} />
                                    </Box>
                                    <ResponsiveImage key={index} src={card.image} alt={card.cardName} />
                                </div>
                            ))}
                        </Box>
                    </Box>) : null}
                <Box sx={{ fontSize: '14px', padding: '10px', backgroundColor: '#29333e', color: '#f2f3f8', display: 'flex', justifyContent: 'space-between' }}>
                    <Box>Posted</Box>
                    <Box>{calculateTimeSincePost(data.sharedDate)}</Box>
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', fontSize: '16px', gap: '5px', paddingTop: '10px', paddingBottom: '10px', paddingLeft: '15px', paddingRight: '15px', color: '#f2f3f8' }}>
                    <Typography sx={{ color: '#f2f8fc', fontWeight: '900', fontSize: '18px' }}>Description</Typography>
                    {data.description}
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: '5px', fontSize: '16px', paddingTop: '10px', paddingLeft: '15px', paddingRight: '15px' }}>
                    <Typography sx={{ color: '#f2f8fc', fontWeight: '900', fontSize: '18px' }}>Comments</Typography>
                    {comments && comments.length > 0 ? (
                        <List sx={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            {comments.slice(0, showAllComments ? comments.length : maxVisibleComments).map((comment, index) => (
                                <ListItem key={index} sx={{ padding: "2px", display: 'flex', alignItems: 'start' }}>
                                    <ListItemAvatar sx={{ paddingTop: '6px' }}>
                                        <Avatar src={comment.photoURL} alt={`avatar-${index}`} />
                                    </ListItemAvatar>
                                    <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', gap: '7px' }}>
                                        <CommentPill
                                            comment={comment}
                                            comments={comments}
                                            index={index}
                                            isSubmitting={isSubmitting}
                                            handleDeleteComment={handleDeleteComment} />
                                    </Box>
                                </ListItem>
                            ))}
                        </List>
                    ) : (
                        <Typography sx={{ color: '#f2f8fc', fontSize: '14px', paddingTop: '5px' }}>No comments yet.</Typography>
                    )}
                    {(comments && comments.length > maxVisibleComments && comments.length > 0) && (
                        <Typography onClick={handleSeeMoreToggle} sx={{ color: '#74CFFF', fontSize: '12px', padding: '10px', alignSelf: 'flex-end' }}>
                            {showAllComments ? 'See Less' : 'See More'}
                        </Typography>
                    )}
                </Box>
            </Box>
            <Box sx={{ position: 'sticky', height: '100px', padding: '10px', backgroundColor: '#26252d', borderTop: '1px solid #29333e' }}>
                <Box sx={{ display: 'flex', flexDirection: 'row', padding: '8px', backgroundColor: '#1f1f1f', borderRadius: '5px', gap: '8px', alignItems: 'center' }}>
                    <Input
                        placeholder="Add a comment"
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        sx={{ width: '90%', color: '#f2f8fc' }}
                    />
                    <Box onClick={isSubmitting ? null : () => handleCommentSubmit(uid)}
                        sx={{ color: isSubmitting ? '#909394' : '#C8A2C8', cursor: isSubmitting ? 'not-allowed' : 'pointer' }}>
                        <Send />
                    </Box>
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', paddingTop: '5px', alignItems: 'center' }}>
                    <BookmarkBorderOutlined sx={{ fontSize: '30px', color: '#c8a2c8' }} />
                    <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '5px', paddingRight: '5px', }}>
                        <FavoriteBorderOutlined sx={{ fontSize: '30px', color: '#c8a2c8' }} />
                        <CommentOutlined sx={{ fontSize: '30px', color: '#c8a2c8' }} />
                    </Box>
                </Box>
            </Box>
        </SwipeableDrawer>
    )
}

export default SingleCardDrawer;