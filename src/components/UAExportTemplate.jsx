import React, { useEffect, useState } from 'react';
import { Box } from '@mui/material';

const processImage = (imageSrc, quality = 0.7) => {
    return new Promise((resolve) => {
        const img = new Image();
        img.crossOrigin = "Anonymous"; // Handle CORS
        img.src = imageSrc;
        img.onload = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);

            // Compress image as JPEG
            const imgData = canvas.toDataURL('image/jpeg', quality);
            resolve(imgData);
        };
        img.onerror = () => {
            console.error('Error loading image');
            resolve(imageSrc); // Fallback to original src
        };
    });
};


const UATCGExport = ({ filteredCards, exportImage, currentUser }) => {

    const [processedCards, setProcessedCards] = useState([]);

    useEffect(() => {
        const processImages = async () => {
            const processed = await Promise.all(filteredCards.map(async (uacard) => {
                const processedImage = await processImage(uacard.image, 0.7); // Adjust quality as needed
                return { ...uacard, image: processedImage };
            }));
            setProcessedCards(processed);
        };

        if (filteredCards.length > 0) {
            processImages();
        }
    }, [filteredCards]);


    if (!Array.isArray(processedCards) || processedCards.length === 0) {
        return null;
    }

    // Sorting the cards based on category and energy cost
    const sortedCards = [...processedCards].sort((a, b) => {
        if (a.category === b.category) {
            return a.energycost - b.energycost;
        }
        return a.category.localeCompare(b.category);
    });

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
                <Box style={{ color: '#FFFFFF', fontSize: '30px', flex: '0 0 auto' }}>
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
                {sortedCards.map((uacard) => (
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
