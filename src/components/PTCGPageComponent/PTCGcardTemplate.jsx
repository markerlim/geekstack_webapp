import React, { useEffect, useState } from "react";
import { Box, Grid, Select, MenuItem, FormControl, Button, Slider, useMediaQuery } from "@mui/material";
import { ArrowBack, Refresh } from "@mui/icons-material";
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { Helmet } from "react-helmet";
import { PTCGCardDrawerNF } from "./PTCGCardDrawerFormatted";
import axios from 'axios'; // Import axios if not already imported

const PTCGcardFormat = ({ searchQuery, setSearchQuery }) => {
    const [carddata, setCarddata] = useState([]);
    const { booster: rawBooster } = useParams();
    const boostercode = rawBooster;
    const ptcgboosterurl = `https://api.pokemontcg.io/v2/cards?q=set.id:${boostercode}`; // Inject boostercode into the URL
    const [openModal, setOpenModal] = useState(false);
    const [boosterLogo, setBoosterLogo] = useState('');
    const [selectedCard, setSelectedCard] = useState(null);
    const [imageWidth, setImageWidth] = useState(100); //store value of slider
    const imageHeight = imageWidth * 1.395;
    const isMedium = useMediaQuery('(min-width:900px)');
    const [selectedType, setSelectedType] = useState('');
    const [selectedRarity, setSelectedRarity] = useState('');
    const navigate = useNavigate();
    const location = useLocation();

    const listoftypes = ["Colorless", "Darkness", "Dragon", "Fairy", "Fighting", "Fire", "Grass", "Lightning", "Metal", "Psychic", "Water"]
    const listofrarities = ["ACE SPEC Rare","Amazing Rare","Classic Collection","Common","Double Rare","Hyper Rare","Illustration Rare","LEGEND","Promo","Radiant Rare","Rare","Rare ACE","Rare BREAK","Rare Holo","Rare Holo EX","Rare Holo GX","Rare Holo LV.X","Rare Holo Star","Rare Holo V","Rare Holo VMAX","Rare Holo VSTAR","Rare Prime","Rare Prism Star","Rare Rainbow","Rare Secret","Rare Shining","Rare Shiny","Rare Shiny GX","Rare Ultra","Shiny Rare","Shiny Ultra Rare","Special Illustration Rare","Trainer Gallery Rare Holo","Ultra Rare","Uncommon"]
    const goBack = () => {
        navigate(-1);
    };
    const getCurrentImage = (document) => {
        let currentImage = document.images.large;
        return currentImage;
    };
    const handleOpenModal = (document) => {
        const currentImage = getCurrentImage(document);
        setSelectedCard({
            ...document,
            currentImage: currentImage
        });
        setOpenModal(true);
    };

    const handleSwipeLeft = () => {
        let currentIndex = filteredCards.findIndex((doc) => doc.id === selectedCard.id);
        let nextIndex = (currentIndex + 1) % filteredCards.length;
        let nextDocument = filteredCards[nextIndex];
        const currentImage = getCurrentImage(nextDocument);
        setSelectedCard({
            ...nextDocument,
            currentImage: currentImage
        });
    };
    const handleSwipeRight = () => {
        let currentIndex = filteredCards.findIndex((doc) => doc.id === selectedCard.id);
        let prevIndex = (currentIndex - 1 + filteredCards.length) % filteredCards.length;
        let prevDocument = filteredCards[prevIndex];
        const currentImage = getCurrentImage(prevDocument);
        setSelectedCard({
            ...prevDocument,
            currentImage: currentImage
        });
    };

    const handleCloseModal = () => {
        setSelectedCard(null);
        setOpenModal(false);
    };
    const resetFilters = () => {
        setSelectedRarity("");
        setSelectedType("");
    };

    const handleSliderChange = (event, newValue) => {
        setImageWidth(newValue);
    };

    function isIOS() {
        return /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.userAgent.includes("Mac") && "ontouchend" in document);
    }

    useEffect(() => {
        axios.get(ptcgboosterurl) // Use axios with the dynamic URL that already includes the booster filter
            .then(response => {
                const data = response.data.data; // Assuming response structure
                const sortedData = data.sort((a, b) => {
                    const numA = parseInt(a.id.split('-').pop(), 10); // Extract number after dash
                    const numB = parseInt(b.id.split('-').pop(), 10); // Extract number after dash
                    return numA - numB; // Sort based on the extracted number
                });                
                setCarddata(data);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
        axios.get(`https://api.pokemontcg.io/v2/sets/${boostercode}`)
        .then(response => {
            const data = response.data.data;
            setBoosterLogo(data.images.logo);
        })
    }, [ptcgboosterurl]); // Ensure that the effect re-runs if the URL changes

    const filteredCards = carddata.filter(card => {
        return (selectedType ? (card.types && card.types.includes(selectedType)) : true) &&
            (selectedRarity ? card.rarity === selectedRarity : true);
    });
    

    return (
        <div style={{ position: 'relative' }}>
            <Helmet>
                <meta name="apple-mobile-web-app-capable" content="yes" />
            </Helmet>
            <Box sx={{ display: { xs: 'none', sm: 'none', md: 'flex' }, flexDirection: "column", justifyContent: "center", marginBottom: 2, alignItems: "center" }}>
                <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                    <FormControl sx={{ margin: 1 }}>
                        <Select
                            sx={{
                                display: "flex", flexDirection: "column", justifyContent: "center", textAlign: "center",
                                whiteSpace: 'nowrap', backgroundColor: "#f2f3f8", borderRadius: "5px",
                                fontSize: 11, width: "60px", height: "30px",
                                '& .MuiSelect-icon': {
                                    display: "none",
                                    position: "absolute"
                                },
                            }}
                            value={selectedType}
                            onChange={(e) => setSelectedType(e.target.value)}
                            displayEmpty
                            renderValue={(selectedValue) => selectedValue || 'Type'}
                        >
                            <MenuItem value="">
                                <em>All Types</em>
                            </MenuItem>
                            {listoftypes.map((type) => (
                                <MenuItem value={type}>{type}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <FormControl sx={{ margin: 1 }}>
                        <Select
                            sx={{
                                display: "flex", flexDirection: "column", justifyContent: "center", textAlign: "center",
                                whiteSpace: 'nowrap', backgroundColor: "#f2f3f8", borderRadius: "5px",
                                fontSize: 11, width: "60px", height: "30px",
                                '& .MuiSelect-icon': {
                                    display: "none",
                                    position: "absolute"
                                },
                            }}
                            value={selectedRarity}
                            onChange={(e) => setSelectedRarity(e.target.value)}
                            displayEmpty
                            renderValue={(selectedValue) => selectedValue || 'Rarity'}
                        >
                            <MenuItem value="">
                                <em>All Rarities</em>
                            </MenuItem>
                            {listofrarities.map((type) => (
                                <MenuItem value={type}>{type}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <Button
                        sx={{
                            minWidth: 0, // Set the minimum width to 0 to allow the button to shrink
                            width: 30, // Change this value to adjust the width
                            height: 20,
                            margin: 1,
                            padding: 1, // Adjust the padding as needed 
                            backgroundColor: "#f2f3f8",
                            color: "#240052",
                            '&:hover': {
                                backgroundColor: "#240052", // Change this to the desired hover background color
                                color: "#f2f3f8", // Change this to the desired hover text color if needed
                            },
                        }}
                        onClick={resetFilters}
                    >
                        <Refresh sx={{ fontSize: 15 }} />
                    </Button>
                    <Box sx={{ width: 100 }}>
                        <Slider
                            value={imageWidth}
                            onChange={handleSliderChange}
                            aria-labelledby="continuous-slider"
                            valueLabelDisplay="auto"
                            min={75}
                            max={250}
                            sx={{
                                '& .MuiSlider-thumb': {
                                    color: '#F2F3F8', // color of the thumb
                                },
                                '& .MuiSlider-track': {
                                    color: '#F2F3F8', // color of the track
                                },
                                '& .MuiSlider-rail': {
                                    color: '#F2F3F8', // color of the rail
                                },
                                margin: 1,
                            }}
                        />
                    </Box>
                </Box>
                <Box>
                    <Button
                        sx={{
                            fontSize: 10,
                            height: 20,
                            padding: 1, // Adjust the padding as needed 
                            backgroundColor: "#f2f3f8",
                            color: "#240052",
                            display: isMedium ? 'normal' : 'none',
                            '&:hover': {
                                backgroundColor: "#240052", // Change this to the desired hover background color
                                color: "#f2f3f8", // Change this to the desired hover text color if needed
                            },
                        }}
                        onClick={goBack}
                    >
                        Back <ArrowBack sx={{ fontSize: 15 }} />
                    </Button>
                </Box>
            </Box>
            <div style={{ overflowY: "auto", height: "86vh" }} className="hide-scrollbar">
                <Box sx={{ paddingTop: '20px', paddingBottom: '20px', textAlign: 'center', display: { xs: 'block', sm: 'block', md: 'none' } }}>
                    <img src={boosterLogo} style={{width:'150px'}}/>
                </Box>
                <Grid container spacing={2} justifyContent="center">
                    {filteredCards.map((document) => {
                        return (
                            <Grid item key={document.id} sx={{ position: "relative" }}>
                                <Box onClick={() => handleOpenModal(document)} sx={{ overflow: "hidden", position: "relative", cursor: "pointer" }} height={imageHeight} width={imageWidth}>
                                    <img
                                        loading="lazy"
                                        src={document.images.large}
                                        draggable="false"
                                        alt={`Card of ${document.name}`}
                                        width={imageWidth}
                                        height={imageHeight}
                                    />
                                </Box>
                            </Grid>
                        )
                    })}
                    {selectedCard && (
                        <PTCGCardDrawerNF
                            open={openModal}
                            onClose={handleCloseModal}
                            selectedCard={selectedCard}
                            onSwipeLeft={handleSwipeLeft}
                            onSwipeRight={handleSwipeRight}
                        />
                    )}
                </Grid>
                <div style={{ height: '200px' }} />
            </div>
            <Box sx={{
                display: { xs: 'flex', sm: 'flex', md: 'none' }, position: 'fixed', backgroundColor: '#121212',
                width: '100vw', bottom: isIOS() ? '80px' : '70px', justifyContent: "center", alignItems: "center"
            }}>
                <FormControl sx={{ margin: 1 }}>
                    <Select
                        sx={{
                            display: "flex", flexDirection: "column", justifyContent: "center", textAlign: "center",
                            whiteSpace: 'nowrap', backgroundColor: "#f2f3f8", borderRadius: "5px",
                            fontSize: 11, width: "60px", height: "30px",
                            '& .MuiSelect-icon': {
                                display: "none",
                                position: "absolute"
                            },
                        }}
                        value={selectedType}
                        onChange={(e) => setSelectedType(e.target.value)}
                        displayEmpty
                        renderValue={(selectedValue) => selectedValue || 'Type'}
                    >
                        <MenuItem value="">
                            <em>All Types</em>
                        </MenuItem>
                        {listoftypes.map((type) => (
                            <MenuItem value={type}>{type}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <FormControl sx={{ margin: 1 }}>
                    <Select
                        sx={{
                            display: "flex", flexDirection: "column", justifyContent: "center", textAlign: "center",
                            whiteSpace: 'nowrap', backgroundColor: "#f2f3f8", borderRadius: "5px",
                            fontSize: 11, width: "60px", height: "30px",
                            '& .MuiSelect-icon': {
                                display: "none",
                                position: "absolute"
                            },
                        }}
                        value={selectedRarity}
                        onChange={(e) => setSelectedRarity(e.target.value)}
                        displayEmpty
                        renderValue={(selectedValue) => selectedValue || 'Rarity'}
                    >
                        <MenuItem value="">
                            <em>All Rarities</em>
                        </MenuItem>
                        {listofrarities.map((type) => (
                                <MenuItem value={type}>{type}</MenuItem>
                            ))}
                    </Select>
                </FormControl>
                <Button
                    sx={{
                        minWidth: 0, // Set the minimum width to 0 to allow the button to shrink
                        width: 30, // Change this value to adjust the width
                        height: 20,
                        margin: 1,
                        padding: 1, // Adjust the padding as needed 
                        backgroundColor: "#f2f3f8",
                        color: "#240052",
                        '&:hover': {
                            backgroundColor: "#240052", // Change this to the desired hover background color
                            color: "#f2f3f8", // Change this to the desired hover text color if needed
                        },
                    }}
                    onClick={resetFilters}
                >
                    <Refresh sx={{ fontSize: 15 }} />
                </Button>
                <Box sx={{ width: 100 }}>
                    <Slider
                        value={imageWidth}
                        onChange={handleSliderChange}
                        aria-labelledby="continuous-slider"
                        valueLabelDisplay="auto"
                        min={75}
                        max={250}
                        sx={{
                            '& .MuiSlider-thumb': {
                                color: '#F2F3F8', // color of the thumb
                            },
                            '& .MuiSlider-track': {
                                color: '#F2F3F8', // color of the track
                            },
                            '& .MuiSlider-rail': {
                                color: '#F2F3F8', // color of the rail
                            },
                            margin: 1,
                        }}
                    />
                </Box>
            </Box>
        </div>
    );
};

export default PTCGcardFormat;
