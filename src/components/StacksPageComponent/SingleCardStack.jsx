import { Avatar, Box, Button, CircularProgress, Input, List, ListItem, ListItemAvatar, ListItemText, Modal, SwipeableDrawer, Typography } from "@mui/material";
import React, { useState } from "react";
import { Pentagon, Refresh, Send } from "@mui/icons-material";
import { ResponsiveImage } from "./../ResponsiveImage";
import CardFunctions from "./SingleCardStackFunc";
import { arrayUnion, doc, getDoc, serverTimestamp, updateDoc } from "firebase/firestore";
import { db } from "../../Firebase";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useEffect } from "react";
import CommentPill from "./CommentPill";

const SingleCardStack = (grpdata, index) => {
    const data = grpdata.data;
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [commentText, setCommentText] = useState("");
    const [comments, setComments] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const authContext = useContext(AuthContext);
    const displayName = authContext.currentUser?.displayName;
    const photoURL = authContext.currentUser?.photoURL;

    const handleDrawerOpen = (data) => {
        setDrawerOpen(true);
    };

    const handleDrawerClose = () => {
        setDrawerOpen(false);
        setCommentText("");
        setComments([]);
        setIsSubmitting(false);
    };

    const handleCommentSubmit = async () => {
        console.log('logging comments');
        const newComment = { displayName: displayName, photoURL: photoURL, text: commentText, timestamp: new Date() };

        // Optimistically update the UI
        setComments((prevComments) => [...prevComments, newComment]);
        setCommentText("");
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
    }, [drawerOpen, data.id]);

    function replaceTagsWithIcons(line) {
        let replacedLine = line;

        Object.keys(tagsToIcons).forEach((tag, index) => {
            const placeholder = `##REPLACE${index}##`;
            replacedLine = replacedLine.split(tag).join(placeholder);
        });

        const lineSegments = replacedLine.split(/(##REPLACE\d+##|\(.*?\))/);

        return lineSegments.map((segment, index) => {
            const tagIndexMatch = segment.match(/##REPLACE(\d+)##/);

            if (tagIndexMatch) {
                const tagIndex = parseInt(tagIndexMatch[1], 10);
                const tag = Object.keys(tagsToIcons)[tagIndex];
                return (
                    <img
                        key={index}
                        src={tagsToIcons[tag]}
                        alt={tag}
                        style={{ height: '14px', verticalAlign: 'middle' }}
                    />
                );
            }

            if (segment.startsWith('(') && segment.endsWith(')') && !tagsToIcons[segment]) {
                return <span key={index} style={{ fontSize: '11px', verticalAlign: 'middle' }}>{segment}</span>;
            }

            return segment;
        });
    }

    const tagsToIcons = {
        "[Impact 1]": "/icons/UAtags/CTImpact1.png",
        "[Impact]": "/icons/UAtags/CTImpact.png",
        "[Block x2]": "/icons/UAtags/CTBlkx2.png",
        "[Attack x2]": "/icons/UAtags/CTAtkx2.png",
        "[Snipe]": "/icons/UAtags/CTSnipe.png",
        "[Impact +1]": "/icons/UAtags/CTImpact+1.png",
        "[Step]": "/icons/UAtags/CTStep.png",
        "[Damage]": "/icons/UAtags/CTDmg.png",
        "[Damage 2]": "/icons/UAtags/CTDmg2.png",
        "[Damage 3]": "/icons/UAtags/CTDmg3.png",
        "[Impact Negate]": "/icons/UAtags/CTImpactNegate.png",
        "[Once Per Turn]": "/icons/UAtags/CTOncePerTurn.png",
        "[Rest this card]": "/icons/UAtags/CTRestThisCard.png",
        "[Retire this card]": "/icons/UAtags/CTRetirethiscard.png",
        "[Place 1 card from hand to Outside Area]": "/icons/UAtags/CT1HandtoOA.png",
        "[Place 2 card from hand to Outside Area]": "/icons/UAtags/CT2HandtoOA.png",
        "[When In Front Line]": "/icons/UAtags/CTWhenInFrontLine.png",
        "[When In Energy Line]": "/icons/UAtags/CTWhenInEnergyLine.png",
        "[Pay 1 AP]": "/icons/UAtags/CTPay1AP.png",
        "[Raid]": "/icons/UAtags/CTRaid.png",
        "[On Play]": "/icons/UAtags/CTOnPlay.png",
        "[On Retire]": "/icons/UAtags/CTOnRetire.png",
        "[On Block]": "/icons/UAtags/CTOnBlock.png",
        "[Activate Main]": "/icons/UAtags/CTActivateMain.png",
        "[When Attacking]": "/icons/UAtags/CTWhenAttacking.png",
        "[Your Turn]": "/icons/UAtags/CTYourTurn.png",
        "[Opponent's Turn]": "/icons/UAtags/CTOppTurn.png",
    };

    return (
        <>
            <Box key={index} sx={{
                paddingTop: '0px',
                height: !data.description ? '200px' : (data.selectedCards[0].imagesrc ? '240px' : '130px'),
                width: '100%', // Adjust width to fill the column
                backgroundColor: '#26262d',
                borderRadius: '10px',
                position: 'relative',
                border: 'none',
                overflow: 'hidden',
            }}
                onClick={() => handleDrawerOpen(data)}>
                <Box sx={{ width: 'inherit', height: data.selectedCards[0].imagesrc ? '140px' : '0px', display: 'flex', justifyContent: 'center', alignItems: 'start', backgroundColor: '#26262d', overflow: 'hidden', }}>
                    {data.selectedCards[0].imagesrc && <img src={data.selectedCards[0].imagesrc} alt='name' style={{ width: '200px', height: 'calc(200px * 1.395)', marginTop: '-45px' }} />}
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'row', gap: '5px', position: 'absolute', left: '0px', top: data.selectedCards[0].imagesrc ? '120px' : '0px', }}>
                    <Box sx={{ borderRadius: '30px', border: '4px solid #26262d', width: '40px', height: '40px', overflow: 'hidden', backgroundColor: '#7C4FFF' }}>
                        {data.photoURL ? <img src={data.photoURL} alt={data.photoURL} style={{ width: '40px', height: 'auto' }} /> :
                            <div
                                style={{
                                    display: 'none',
                                    width: '40px',
                                    height: '40px',
                                    textAlign: 'center',
                                    lineHeight: '40px',
                                    color: '#f2f3f8'
                                }}
                            >
                                {data.displayName.charAt(0).toUpperCase()}
                            </div>}
                    </Box>
                    <Box sx={{ fontSize: '14px', color: '#f2f8fc', fontWeight: '900', marginTop: data.selectedCards[0].imagesrc ? '22px' : '10px', }}>{data.displayName}</Box>
                </Box>
                <Box sx={{
                    display: 'flex', flexDirection: 'column', gap: '7px', width: '160px',
                    color: '#f2f8fc', height: !data.description ? '30px' : (data.selectedCards[0].imagesrc ? '70px' : '100px'), fontSize: '10px', paddingLeft: '10px', paddingRight: '10px', justifyContent: 'start', flex: 'none'
                }}>
                    <Box sx={{ height: !data.description ? '16px' : (data.selectedCards[0].imagesrc ? '25px' : '40px') }}></Box>
                    {data.description && data.description.split('\n').map((line, i) => (
                        <React.Fragment key={i}>
                            {line}
                            <br />
                        </React.Fragment>
                    ))}
                </Box>
                <Box sx={{ color: '#D3D3D3', paddingBottom: '20px' }}>
                    <CardFunctions deck={data} />
                </Box>
            </Box>
            <SwipeableDrawer
                anchor="right"
                open={drawerOpen}
                onOpen={() => { }}
                onClose={handleDrawerClose}
                disableSwipeToOpen={true}>
                <Box sx={{ width: 'calc(95vw - 60px)', height: 'calc(100vh - 60px)', padding: '30px', backgroundColor: '#26252d', overflowY: 'auto' }}>
                    {data.cards && data.cards.length > 0 ? (
                        <Box sx={{ display: "flex", width: { xs: "100%", sm: "500px", md: "700px" }, justifyContent: "center", backgroundColor: "#26252D" }}>
                            <Box sx={{ display: "flex", justifyContent: "center", flexWrap: "wrap", paddingTop: "30px", gap: "10px", }}>
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
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                        <Typography sx={{ color: '#f2f8fc' }}>Comments</Typography>
                        {data.comments && data.comments.length > 0 ? (
                            <List sx={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                {comments.map((comment, index) => (
                                    <ListItem key={index} sx={{ padding: "2px", display: 'flex', alignItems: 'start' }}>
                                        <ListItemAvatar sx={{ paddingTop: '6px' }}>
                                            <Avatar src={comment.photoURL} alt={`avatar-${index}`}/>
                                        </ListItemAvatar>
                                        <CommentPill comment={comment} comments={comments} index={index} isSubmitting={isSubmitting}/>
                                    </ListItem>
                                ))}
                            </List>
                        ) : null}
                    </Box>
                    <Box sx={{ display: 'flex', flexDirection: 'row', padding: '8px', backgroundColor: '#4e4e4e', borderRadius: '5px', gap: '8px', alignItems: 'center' }}>
                        <Input
                            placeholder="Add a comment"
                            value={commentText}
                            onChange={(e) => setCommentText(e.target.value)}
                            sx={{ width: '90%', color: '#f2f8fc' }}
                        />
                        <Box onClick={isSubmitting ? null : handleCommentSubmit}
                            sx={{ color: isSubmitting ? '#909394' : '#74CFFF', cursor: isSubmitting ? 'not-allowed' : 'pointer' }}>
                            <Send />
                        </Box>
                    </Box>
                </Box>
            </SwipeableDrawer>
        </>
    )
}

export default SingleCardStack;