import React, { useEffect, useState } from 'react';
import { Box, Typography, Modal, IconButton } from '@mui/material';
import { Close, Person } from '@mui/icons-material';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../Firebase';

// Card Picker Modal Component
const CardPickerModal = ({ open, onClose, cards, onCardSelect }) => {
    return (
        <Modal open={open} onClose={onClose}>
            <Box
                sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    bgcolor: '#26262d',
                    color: '#f2f3f8',
                    padding: '20px',
                    borderRadius: '10px',
                    height: '80%',
                    width: '80%',
                    maxWidth: '500px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Typography variant="h6" gutterBottom>
                    Pick a Card
                </Typography>
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        flexWrap: 'wrap',
                        gap: '10px',
                        width: '100%',
                        height: '100%',
                        overflowY: 'auto',
                    }}
                >
                    {cards && cards.map((card, index) => (
                        <Box
                            key={index}
                            sx={{
                                width: '80px',
                                height: '120px',
                                cursor: 'pointer',
                                border: '2px solid transparent',
                                borderRadius: '10px',
                                overflow: 'hidden',
                                '&:hover': {
                                    borderColor: '#d14a5b',
                                },
                            }}
                            onClick={() => {
                                onCardSelect(card.image);
                                onClose(); // Close modal after card selection
                            }}
                        >
                            <img src={card.image} alt={`Card ${index + 1}`} style={{ width: '100%', height: '100%' }} />
                        </Box>
                    ))}
                </Box>
                <IconButton
                    onClick={onClose}
                    sx={{
                        position: 'absolute',
                        top: '10px',
                        right: '10px',
                        color: '#fff',
                    }}
                >
                    <Close />
                </IconButton>
            </Box>
        </Modal>
    );
};

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

const LogDetail = ({ log, onClose, cards, currentUser, deck }) => {
    const { eventName, eventDate, eventCaption, country, rounds, selectedCardUrl } = log;
    const [viewType, setViewType] = useState('MATCHUP');

    // State to store the selected card URL
    const [chosenCardUrl, setChosenCardUrl] = useState(selectedCardUrl);

    // State to control the modal visibility
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Function to open modal
    const handlePickingImage = () => {
        setIsModalOpen(true);
    };

    // Handle card selection and update Firebase
    const handleCardSelect = async (cardUrl) => {
        setChosenCardUrl(cardUrl); // Set the selected card's image URL

        // Update the Firebase document
        const logDocRef = doc(db, `users/${currentUser.uid}/decks/${deck.id}/logs`, log.id); // Use the log `id` to get the correct document
        try {
            await updateDoc(logDocRef, { selectedCardUrl: cardUrl }); // Update `selectedCardUrl` field
            console.log('Firebase document updated successfully.');
        } catch (error) {
            console.error('Error updating Firebase document:', error);
        }
    }
    const [processedCards, setProcessedCards] = useState([]);

    useEffect(() => {
        const processImages = async () => {
            const processed = await Promise.all(cards.map(async (uacard) => {
                const processedImage = await processImage(uacard.image, 0.7); // Adjust quality as needed
                return { ...uacard, image: processedImage };
            }));
            setProcessedCards(processed);
        };

        if (cards.length > 0) {
            processImages();
        }
    }, [cards]);


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

    const renderResult = (result) => {
        switch (result) {
            case 'Win':
                return <Box sx={{fontSize:'12px',display:'flex',justifyContent:'center'}}>✅</Box>;
            case 'Lose':
                return <Box sx={{fontSize:'12px',display:'flex',justifyContent:'center'}}>❌</Box>;
            case 'Draw':
                return <Box sx={{fontSize:'12px',display:'flex',justifyContent:'center'}}>TIE</Box>;
            default:
                return <Box sx={{fontSize:'12px',display:'flex',justifyContent:'center'}}>NA</Box>;
        }
    };

    return (
        <Box
            sx={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: 'calc(100vw - 40px)',
                maxWidth:'600px',
                height: 'calc(100vh - 40px)',
                bgcolor: '#26262d',
                color: '#f2f3f8',
                display: 'flex',
                flexDirection: 'column',
                padding: '20px',
                overflow: 'auto',
                zIndex: 1200, // Ensure it appears on top of other content
            }}
        >
            <Box
                sx={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingBottom: '20px'
                }}
            >
                <Box sx={{ width: '100%', height: '100%' }}>
                    <Box
                        sx={{
                            position: 'relative',
                            textAlign: 'left',
                            height: '200px',
                            width: '100%',
                            borderRadius: '8px',
                            backgroundImage: `url('${chosenCardUrl}')`,
                            backgroundSize: 'cover', // Changed to cover for better background scaling
                            backgroundPosition: '0% 25%', // Changed to center for better alignment
                            overflow: 'hidden',
                            '&::before': {
                                content: '""',
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: '100%',
                                height: '100%',
                                background: 'linear-gradient(to top, rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0))',
                                zIndex: 1, // Ensure overlay is above the background image
                            },
                        }}
                        onClick={handlePickingImage}
                    >
                        <Box sx={{ position: 'relative', zIndex: 2, height: '100%', paddingLeft: '10px', paddingBottom: '10px', paddingRight: '10px', display: 'flex', flexDirection: 'row', alignItems: 'end', justifyContent: 'space-between' }}>
                            <Box sx={{ display: 'flex', flexDirection: 'column', width:'100%' }}>
                                <Typography variant="h5"><strong>{eventName}</strong></Typography>
                                <Typography variant="subtitle1">{country}</Typography>
                                <Typography variant="subtitle1">{eventDate}</Typography>
                            </Box>
                            <Box sx={{position:'absolute',bottom:'15px',right:'10px'}}>
                                <strong style={{ fontSize: '22px', opacity: '0.5', padding: '5px',color:'#F2F3F8',textShadow:'-1px -1px 0 #7C4FFF,1px -1px 0 #7C4FFF,-1px 1px 0 #7C4FFF,1px 1px 0 #7C4FFF' }}>GEEKSTACK</strong>
                            </Box>
                        </Box>
                    </Box>
                    {viewType === "MATCHUP" ?
                        <Box
                            sx={{
                                marginTop: '5px',
                                width: '100%',
                                maxWidth: '800px',
                                overflowX: 'auto',
                            }}
                        >
                            {rounds && rounds.length > 0 ? (
                                rounds.map((round, index) => (
                                    <Box
                                        key={index}
                                        sx={{
                                            marginBottom: 1,
                                            padding: 1,
                                            bgcolor: '#1e1e1e',
                                            borderRadius: 2,
                                            boxShadow: 2,
                                            display: 'flex',
                                            flexDirection: 'row',
                                            justifyContent: 'space-between',
                                        }}
                                    >
                                        <Box sx={{ display: 'flex', flexDirection: 'row', gap: '5px' }}>
                                            {[0, 1, 2].map((pos) => (
                                                <Box
                                                    key={pos}
                                                    sx={{
                                                        width: '50px',
                                                        height: '50px',
                                                        display: 'flex',
                                                        justifyContent: 'center',
                                                        alignItems: 'center',
                                                        border: '1px solid #26262d',
                                                        borderRadius: '8px',
                                                        overflow: 'hidden',
                                                    }}
                                                >
                                                    {round.cards[pos] ? (
                                                        <img src={round.cards[pos]} style={{ width: '120%', marginTop: '40%' }} alt="Card" />
                                                    ) : (
                                                        <Person />
                                                    )}
                                                </Box>
                                            ))}
                                        </Box>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: '30px', marginRight: '10px' }}>
                                            <Box>{round.goFirst}</Box>
                                            <Box sx={{display:'flex',flexDirection:'column',gap:'0px'}}>
                                                <Typography>RND {index + 1}</Typography>
                                                {renderResult(round.result)}
                                            </Box>
                                        </Box>
                                    </Box>
                                ))
                            ) : (
                                <Typography variant="body2">No rounds available.</Typography>
                            )}
                        </Box> : null}
                    {viewType === "DECKLIST" ? (
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'row',
                                flexWrap: 'wrap',  // This allows the items to wrap into multiple rows
                                width: '100%',
                                marginTop:'10px',
                                justifyContent: 'center',
                                alignItems: 'start',
                            }}
                        >
                            {sortedCards.map((uacard) => (
                                [...Array(uacard.count || 1)].map((_, index) => (
                                    <Box
                                        key={uacard.cardId + index + "EXPORT"}
                                        sx={{
                                            flexBasis: 'calc(100% / 10)',
                                        }}
                                    >
                                        <img
                                            loading="lazy"
                                            src={uacard.image}
                                            draggable="false"
                                            alt={uacard.cardId}
                                            style={{
                                                width: '100%',  // Make the image take up the entire Box width
                                                height: 'auto',
                                            }}
                                        />
                                    </Box>
                                ))
                            ))}
                        </Box>
                    ) : null}
                </Box>
                <Box sx={{ width: '80%', display: 'flex', gap: '10px' }}>
                    <Box
                        onClick={() => {
                            setViewType(prevViewType => prevViewType === "DECKLIST" ? "MATCHUP" : "DECKLIST");
                        }}
                        sx={{
                            bgcolor: '#7c4fff',
                            padding: '3px',
                            width: '80%',
                            textAlign: 'center',
                            borderRadius: '10px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >
                        CHANGE VIEW
                    </Box>
                    <Box
                        onClick={onClose}
                        sx={{ bgcolor: '#d14a5b', padding: '3px', width: '40%', textAlign: 'center', borderRadius: '10px' }}
                    >
                        <Close sx={{ fontSize: '30px' }} />
                    </Box>
                </Box>
            </Box>

            {/* Modal for selecting a card */}
            <CardPickerModal
                open={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                cards={cards}
                onCardSelect={handleCardSelect}
            />
        </Box>
    );
};

export default LogDetail;
