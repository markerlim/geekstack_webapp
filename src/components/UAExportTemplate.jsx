import React from 'react';
import { Box } from '@mui/material';

const UATCGExport = ({ filteredCards, exportImage, currentUser }) => {

    if (!Array.isArray(filteredCards) || filteredCards.length === 0) {
        return null;
    }

    return (
        <Box id="UATCGExport" sx={{ width: '1750px', height: '980px', padding: '40px', backgroundImage: 'url(images/articlebg/UATestBG.jpg)', display: 'flex', flexDirection: 'row', alignItems: 'start', justifyContent: 'center', gap: '20px' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px' }}>
                <img
                    loading="lazy"
                    src={exportImage}
                    draggable="false"
                    alt="boosterset"
                    style={{ width: '300px', height: 'auto', borderRadius: '20px', border: '10px #7C4FFF solid' }}
                />
                <Box style={{ color: '#FFFFFF', fontSize: '30px' }}>
                    {currentUser.displayName.length > 15 ? `${currentUser.displayName.substring(0, 15)}...` : currentUser.displayName}
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: '5px', alignItems: 'center' }}>
                    <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', gap: '5px' }}>
                        <img style={{ width: "auto", height: "100px" }} alt="uniondeck" src="/icons/geekstackicon.svg" />
                        <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', paddingTop: "5px", paddingBottom: "5px", color: "#f2f3f8" }}>
                            <strong style={{ fontSize: '30px', }}>GEEKSTACK</strong>
                            <span style={{ fontSize: '20px' }}>Everything Cards</span>
                        </Box>
                    </Box>
                    <span style={{ fontSize: '30px', color: '#c8a2c8' }}>www.geekstack.dev</span>
                    <img src='/images/GEEKSTACKQR.png' alt='qrcode' style={{ width: '200px' }} />
                </Box>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', width: '1400px', justifyContent: 'center', alignItems: 'start' }}>
                {filteredCards.map((uacard) => (
                    [...Array(uacard.count || 1)].map((_, index) => (
                        <Box marginBottom="-4px" item key={uacard.cardId + index + "EXPORT"}>
                            <img
                                loading="lazy"
                                src={uacard.image}
                                draggable="false"
                                alt={uacard.cardId}
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

export default UATCGExport;
