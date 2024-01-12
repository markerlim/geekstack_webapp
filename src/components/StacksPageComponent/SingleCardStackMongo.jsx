import { Avatar, Box, Input, List, ListItem, ListItemAvatar, SwipeableDrawer, Typography } from "@mui/material";
import React, { useState } from "react";
import { ArrowBack, BookmarkBorderOutlined, CommentOutlined, FavoriteBorderOutlined, Pentagon, Search, Send } from "@mui/icons-material";
import { ResponsiveImage } from "./../ResponsiveImage";
import CardFunctions from "./SingleCardStackFunc";
import CommentPill from "./CommentPill";
import CommentPillSubbar from "./CommentPillSubbar";
import { useRef } from "react";

const SingleCardStackMongo = ({ grpdata, index, uid }) => {
    const data = grpdata;
    console.log(data);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [commentText, setCommentText] = useState("");
    const [comments, setComments] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showAllComments, setShowAllComments] = useState(false);
    const inputRef = useRef(null);

    const maxVisibleComments = 3;

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
        const newComment = { text: commentText, timestamp: new Date(), uid: uid };

        // Optimistically update the UI
        setComments((prevComments) => [...prevComments, newComment]);
        setCommentText("");
        setIsSubmitting(true);

        try {
            // Simulate backend delay
            await new Promise((resolve) => setTimeout(resolve, 1000));

            // Build the URL for your API endpoint with _id as a query parameter
            const apiUrl = `https://ap-southeast-1.aws.data.mongodb-api.com/app/data-fwguo/endpoint/addComment?secret=${process.env.REACT_APP_SECRET_KEY}&_id=${data._id}`;
            console.log(apiUrl);

            const response = await fetch(apiUrl, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Request-Headers': '*',
                    'Authorization': `Api-key ${process.env.MONGODB_STACKCONTENT_API}`, // Replace with your actual API key
                },
                body: JSON.stringify(newComment), // Send the new comment as JSON in the request body
                credentials: "include",
            });

            if (response.ok) {
                // If the API call is successful, update the UI
                setIsSubmitting(false);
            } else {
                // Handle API error
                console.error('API request failed:', response.statusText);
                // Revert the optimistic update
                setComments((prevComments) => prevComments.slice(0, -1));
                setIsSubmitting(false);
            }
        } catch (error) {
            console.error('Error sending API request:', error);
            // Revert the optimistic update
            setComments((prevComments) => prevComments.slice(0, -1));
            setIsSubmitting(false);
        }
    };

    const handleSeeMoreToggle = () => {
        setShowAllComments(!showAllComments);
    };

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
                height: !data.description ? '205px' : (data.selectedCards[0].imagesrc ? '240px' : '130px'),
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
                    display: 'flex', flexDirection: 'column', gap: '7px', width: '150px',
                    color: '#f2f8fc', height: !data.description ? '35px' : (data.selectedCards[0].imagesrc ? '70px' : '100px'), fontSize: '10px', paddingLeft: '10px', paddingRight: '10px', justifyContent: 'start', flex: 'none'
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
                    <CardFunctions deck={data} handleDrawerOpen={handleDrawerOpen} inputRef={inputRef} />
                </Box>
            </Box>
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
                                    {data.displayName.charAt(0).toUpperCase()}
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
                    <Box sx={{ display: 'flex', flexDirection: 'column', fontSize: '16px', gap: '5px', paddingTop: '10px', paddingBottom: '10px', paddingLeft: '15px', paddingRight: '15px', color: '#f2f3f8' }}>
                        <Typography sx={{ color: '#f2f8fc', fontWeight: '900', fontSize: '18px' }}>Description</Typography>
                        {data.description}
                    </Box>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '5px', fontSize: '16px', paddingTop: '10px', paddingLeft: '15px', paddingRight: '15px' }}>
                        <Typography sx={{ color: '#f2f8fc', fontWeight: '900', fontSize: '18px' }}>Comments</Typography>
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
                                            isSubmitting={isSubmitting} />
                                        <CommentPillSubbar
                                            index={index}
                                            comment={comment} />
                                    </Box>
                                </ListItem>
                            ))}
                        </List>
                        {comments.length > maxVisibleComments && (
                            <Typography onClick={handleSeeMoreToggle} sx={{ color: '#74CFFF', fontSize: '12px', padding: '10px', alignSelf: 'flex-end' }}>
                                {showAllComments ? 'See Less' : 'See More'}
                            </Typography>
                        )}
                    </Box>
                </Box>
                <Box sx={{ position: 'sticky', height: '100px', padding: '10px', backgroundColor: '#26252d', borderTop: '1px solid #121212' }}>
                    <Box sx={{ display: 'flex', flexDirection: 'row', padding: '8px', backgroundColor: '#1f1f1f', borderRadius: '5px', gap: '8px', alignItems: 'center' }}>
                        <Input
                            placeholder="Add a comment"
                            inputRef={inputRef}
                            value={commentText}
                            onChange={(e) => setCommentText(e.target.value)}
                            sx={{ width: '90%', color: '#f2f8fc' }}
                        />
                        <Box onClick={isSubmitting ? null : handleCommentSubmit}
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
        </>
    )
}

export default SingleCardStackMongo;