import React from 'react';
import { Box } from '@mui/material';

const DBZFWExport = ({ filteredCards, selectedImage, currentUser }) => {

    if (!Array.isArray(filteredCards) || filteredCards.length === 0) {
        return null; // or return some placeholder component or message
    }

    return (
        <Box id="DBZFWExport" sx={{ width: '1840px', height: '1000px', padding: '40px', backgroundImage: 'url(images/articlebg/dragonballbgblack.jpg)', display: 'flex', flexDirection: 'row', alignItems: 'start', justifyContent: 'center', gap: '20px' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between', height: '1000px' }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center',gap:'5px' }}>
                    <img
                        loading="lazy"
                        src={selectedImage}
                        draggable="false"
                        alt="leader"
                        width="300px"
                        height="auto"
                    />
                    <span style={{ color: "#FFFFFF", fontSize: '30px' }}>{currentUser.displayName}</span>
                </Box>
                <Box sx={{display:'flex',flexDirection:'column',gap:'5px',alignItems:'center'}}>
                    <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', gap: '5px' }}>
                        <img style={{ width: "auto", height: "100px" }} alt="uniondeck" src="/icons/geekstackicon.svg" />
                        <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', paddingTop: "5px", paddingBottom: "5px", color: "#f2f3f8" }}>
                            <strong style={{ fontSize: '30px', }}>GEEKSTACK</strong>
                            <span style={{ fontSize: '20px' }}>Everything Cards</span>
                        </Box>
                    </Box>
                    <span style={{fontSize:'30px',color:'#c8a2c8'}}>www.geekstack.dev</span>
                </Box>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', width: '1400px', justifyContent: 'center', alignItems: 'start' }}>
                {filteredCards.map((dragonball) => (
                    [...Array(dragonball.count || 1)].map((_, index) => (
                        <Box marginBottom="-4px" item key={dragonball.cardUid + index}>
                            <img
                                loading="lazy"
                                src={dragonball.image}
                                draggable="false"
                                alt={dragonball.cardUid}
                                width="140px"
                                height="auto"

                            />
                        </Box>
                    ))
                ))}
            </Box>
        </Box>
    );
};

export default DBZFWExport;
