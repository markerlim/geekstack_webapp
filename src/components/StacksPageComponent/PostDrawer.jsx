import React, { useState } from "react";
import { Box, SwipeableDrawer, TextField, styled } from "@mui/material";

const PostDrawer = ({ setPostDrawerOpen, postDrawerOpen }) => {
    const [postFontWeight, setPostFontWeight] = useState(900);
    const [deckshareFontWeight, setDeckshareFontWeight] = useState(100);
    const [localDescription, setLocalDescription] = useState("");

    const Puller = styled('div')(({ theme }) => ({
        width: 30,
        height: 6,
        backgroundColor: '#101418',
        borderRadius: 3,
        position: 'absolute',
        top: 8,
        left: 'calc(50% - 15px)',
    }));

    const handleDrawerClose = () => {
        setPostDrawerOpen(false);
    };

    const handleFontWeightChange = (option) => {
        if (option === 'Post') {
            setPostFontWeight(900);
            setDeckshareFontWeight(100);
        } else if (option === 'Deckshare') {
            setPostFontWeight(100);
            setDeckshareFontWeight(900);
        }
    };

    return (
        <SwipeableDrawer
            anchor="bottom"
            open={postDrawerOpen}
            onClose={handleDrawerClose}
            disableSwipeToOpen
            PaperProps={{ style: { backgroundColor: 'rgba(38, 38, 45, 0)' } }}
        >
            <Box sx={{ width: 'calc(100vw - 40px)', padding: '20px', height: '50vh', display: 'flex', flexDirection: 'column', backgroundColor: '#26262d', borderRadius: '20px 20px 0px 0px', color: '#f2f3f8' }}>
                <Puller />
                <br />
                <Box sx={{ padding: '15px' }}>
                    {postFontWeight === 900 && (
                        <Box>
                            <TextField
                                label="Post"
                                fullWidth
                                multiline
                                value={localDescription}
                                onChange={(e) => setLocalDescription(e.target.value)}
                                maxRows={4}
                                InputLabelProps={{ shrink: true }}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        '& fieldset': {
                                            borderColor: '#7C4FFF', // Border color when not focused
                                        },
                                        '&:hover fieldset': {
                                            borderColor: '#7C4FFF', // Border color when hovered over
                                        },
                                        '&.Mui-focused fieldset': {
                                            borderColor: '#7C4FFF', // Border color when focused (in use)
                                        },
                                    },
                                    '.MuiOutlinedInput-input': {
                                        color: 'white', // changes the text color
                                    },
                                    '.MuiInputLabel-outlined': {
                                        color: 'white', // changes the label colorwhite
                                        whiteSpace: 'pre-wrap'
                                    },
                                    '& .MuiInputLabel-outlined.MuiInputLabel-shrink': {
                                        color: 'white', // changes the label color when typing
                                    },
                                }}
                            />
                        </Box>
                    )}
                    {deckshareFontWeight === 900 && (
                        <Box>
                            This content is rendered when deckshareFontWeight is 900.
                        </Box>
                    )}
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'row', gap: '10px', justifyContent: 'center', alignItems: 'center', width: 'calc(100vw - 40px)' }}>
                    <Box sx={{ paddingTop: '10px', paddingBottom: '10px', paddingLeft: '20px', paddingRight: '20px', bgcolor: '#121212', borderRadius: '30px', display: 'flex', gap: '10px', fontSize: '17px' }}>
                        <Box sx={{ fontWeight: postFontWeight, cursor: 'pointer' }} onClick={() => handleFontWeightChange('Post')}>
                            Post
                        </Box>
                        <Box sx={{ fontWeight: deckshareFontWeight, cursor: 'pointer' }} onClick={() => handleFontWeightChange('Deckshare')}>
                            Deckshare
                        </Box>
                    </Box>
                </Box>
            </Box>
        </SwipeableDrawer>
    );
};

export default PostDrawer;
