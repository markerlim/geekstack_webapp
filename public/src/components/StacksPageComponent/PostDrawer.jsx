import React, { useState } from "react";
import { Box, SwipeableDrawer, TextField, styled } from "@mui/material";
import DecklibrarybtnMobile from "../DeckLibraryButtonsMobile";
import OPDecklibrarybtn from "../OPTCGPageComponent/OPDeckLibraryButtons";
import { CardStateProviderOnepiece } from "../../context/useCardStateOnepiece";

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
                <Box sx={{ padding: '15px',overflowY:'auto'}}>
                    {deckshareFontWeight === 900 && (
                        <Box sx={{display:'flex', flexDirection:'column'}}>
                            <Box overflowX={'auto'} sx={{ height: { xs: '300px' } }}>
                                <DecklibrarybtnMobile />
                            </Box>
                            <Box overflowX={'auto'} sx={{ height: { xs: '300px' } }}>
                                <CardStateProviderOnepiece>
                                    <OPDecklibrarybtn />
                                </CardStateProviderOnepiece>
                            </Box>
                        </Box>
                    )}
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'row', gap: '10px', justifyContent: 'center', alignItems: 'center', width: 'calc(100vw - 40px)' }}>
                    <Box sx={{ paddingTop: '10px', paddingBottom: '10px', paddingLeft: '20px', paddingRight: '20px', bgcolor: '#121212', borderRadius: '30px', display: 'flex', gap: '10px', fontSize: '17px' }}>
                        <Box sx={{ fontWeight: postFontWeight, cursor: 'pointer',display:'none' }} onClick={() => handleFontWeightChange('Post')}>
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
