import React, { useEffect, useState } from "react";
import { db } from "../../Firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import { Box, Grid, Select, MenuItem, FormControl, Button, Slider, useMediaQuery } from "@mui/material";
import { ArrowBack, Refresh } from "@mui/icons-material";
import searchMatch from "../searchUtils";
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { Helmet } from "react-helmet";
import { OPTCGCardDrawer } from "./OPTCGCardDrawer";


const OPTCGcardFormat = ({ searchQuery, setSearchQuery }) => {
    const [carddata, setCarddata] = useState([]);
    const { booster: rawBooster } = useParams();
    const boostercode = rawBooster.toUpperCase();
    const [listOfColors, setListofColors] = useState([]);
    const [listOfRarities, setListofRarities] = useState([]);
    const [documents, setDocuments] = useState([]);
    const [openModal, setOpenModal] = useState(false);
    const [selectedCard, setSelectedCard] = useState(null);
    const [imageWidth, setImageWidth] = useState(100); //store value of slider
    const imageHeight = imageWidth * 1.395;
    const [boosterFilter, setBoosterFilter] = useState("");
    const [colorFilter, setColorFilter] = useState("");
    const [rarityFilter, setRarityFilter] = useState("");
    const [onlyAltForm, setOnlyAltForm] = useState(false);
    const [altFormIndex, setAltFormIndex] = useState({});
    const isMedium = useMediaQuery('(min-width:900px)');
    const navigate = useNavigate();
    const location = useLocation();

    const goBack = () => {
        navigate(-1);
    };
    const getCurrentImage = (document) => {
        let currentImage = document.image;

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
        let currentIndex = filteredDocuments.findIndex((doc) => doc.cardId === selectedCard.cardId);
        let nextIndex = (currentIndex + 1) % filteredDocuments.length;
        let nextDocument = filteredDocuments[nextIndex];

        const currentImage = getCurrentImage(nextDocument);
        setSelectedCard({
            ...nextDocument,
            currentImage: currentImage
        });
    };
    const handleSwipeRight = () => {
        let currentIndex = filteredDocuments.findIndex((doc) => doc.cardId === selectedCard.cardId);
        let prevIndex = (currentIndex - 1 + filteredDocuments.length) % filteredDocuments.length;
        let prevDocument = filteredDocuments[prevIndex];

        const currentImage = getCurrentImage(prevDocument);
        setSelectedCard({
            ...prevDocument,
            currentImage: currentImage
        });
    };
    const handleCloseModal = () => {
        setSelectedCard(null);
        setOpenModal(false);
        setAltFormIndex({});
    };
    const resetFilters = () => {
        setBoosterFilter("");
        setColorFilter("");
        setRarityFilter("");
        setOnlyAltForm(false);
        setAltFormIndex({});
        setDetailsByBoosterCode(boostercode);
        setSearchQuery("");
    };
    const currentSearchQuery = searchQuery;
    const filteredDocuments = documents.filter((document) => {
        const boosterFilterMatch = !boosterFilter || document.booster === boosterFilter;
        const colorFilterMatch = !colorFilter || document.color === colorFilter;
        const searchFilterMatch = searchMatch(document, currentSearchQuery);
        const altFormFilterMatch = !onlyAltForm || document.altform;

        return boosterFilterMatch && colorFilterMatch && searchFilterMatch && altFormFilterMatch;
    });
    const handleSliderChange = (event, newValue) => {
        setImageWidth(newValue);
    };

    function isIOS() {
        return /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.userAgent.includes("Mac") && "ontouchend" in document);
    }
    const setDetailsByBoosterCode = (boostercode) => {
        const boosterDetails = carddata.find(data => data.booster === boostercode);

        if (boosterDetails) {
            setBoosterFilter(boosterDetails.boostercode);
            setListofColors(boosterDetails.listofcolors || []);
            setListofRarities(boosterDetails.listofrarities || []);
        } else {
            console.error(`No anime details found for code: ${boostercode}`);
        }
    };
    useEffect(() => {
        const fetchDocuments = async () => {
            try {
                const filteredQuery = query(collection(db, "onepiececardgame"), where("booster", "==", boostercode));
                const querySnapshot = await getDocs(filteredQuery);
                const documentsArray = [];
                const initialAltForms = {};

                querySnapshot.forEach((doc) => {
                    const docData = doc.data();
                    documentsArray.push(docData);
                    if (docData.altforms) {
                        initialAltForms[docData.cardId] = 0;
                    }
                });

                setDocuments(documentsArray);
                console.log(`Number of reads: ${documentsArray.length}`);

                const queryParams = new URLSearchParams(window.location.search);
                const boosterParam = queryParams.get('booster');

                if (boosterParam) {
                    setBoosterFilter(boosterParam.toUpperCase());
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchDocuments();
    }, [boostercode]);



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
                            value={rarityFilter}
                            onChange={(event) => setRarityFilter(event.target.value)}
                            displayEmpty // Add this prop to display the placeholder when the value is empty
                            renderValue={(selectedValue) => selectedValue || 'Rarity'} // Add this prop to display the placeholder text when the value is empty
                        >
                            <MenuItem value="">
                                <em>None</em>
                            </MenuItem>
                            {listOfRarities.map(rarity => (
                                <MenuItem key={rarity} value={rarity}>
                                    {rarity}
                                </MenuItem>
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
                            value={colorFilter}
                            onChange={(event) => setColorFilter(event.target.value)}
                            displayEmpty // Add this prop to display the placeholder when the value is empty
                            renderValue={(selectedValue) => selectedValue || 'Color'}
                        >
                            <MenuItem value="">
                                <em>None</em>
                            </MenuItem>
                            {listOfColors.map(color => (
                                <MenuItem key={color} value={color}>
                                    {color}
                                </MenuItem>
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
                <Grid container spacing={2} justifyContent="center">
                    {filteredDocuments
                        .filter(document => !(rarityFilter === 'ALT' && (!document.altforms || document.altforms.length === 0 || document.altforms === '')))
                        .map((document) => {
                            if (rarityFilter === 'ALT' && document.altforms) {
                                const altForms = Array.isArray(document.altforms) ? document.altforms : typeof document.altforms === "string" ? [document.altforms] : [];
                                return altForms.map((form, index) => (
                                    <Grid item key={`${document.cardId}-${index}`} sx={{ position: "relative" }}>
                                        <Box onClick={() => handleOpenModal(document)}
                                            sx={{ overflow: "hidden", position: "relative", cursor: "pointer" }} height={imageHeight} width={imageWidth}>
                                            <img
                                                loading="lazy"
                                                src={form}
                                                draggable="false"
                                                alt={`${document.cardId}-${index}`}
                                                width={imageWidth}
                                                height={imageHeight}
                                            />
                                        </Box>
                                    </Grid>
                                ))
                            } else {
                                return (
                                    <Grid item key={document.cardId} sx={{ position: "relative" }}>
                                        <Box onClick={() => handleOpenModal(document)} sx={{ overflow: "hidden", position: "relative", cursor: "pointer" }} height={imageHeight} width={imageWidth}>
                                            <img
                                                loading="lazy"
                                                src={
                                                    (Array.isArray(document.altforms) && altFormIndex[document.cardId] < document.altforms.length) ? document.altforms[altFormIndex[document.cardId]] :
                                                        (typeof document.altforms === "string" && altFormIndex[document.cardId] === 1) ? document.altforms :
                                                            document.image
                                                }
                                                draggable="false"
                                                alt={`Card of ${document.cardName} from ${document.anime}`}
                                                width={imageWidth}
                                                height={imageHeight}
                                            />
                                        </Box>
                                    </Grid>
                                )
                            }
                        })}
                    {selectedCard && (
                        <OPTCGCardDrawer
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
                        value={rarityFilter}
                        onChange={(event) => setRarityFilter(event.target.value)}
                        displayEmpty // Add this prop to display the placeholder when the value is empty
                        renderValue={(selectedValue) => selectedValue || 'Rarity'} // Add this prop to display the placeholder text when the value is empty
                    >
                        <MenuItem value="">
                            <em>None</em>
                        </MenuItem>
                        {listOfRarities.map(rarity => (
                            <MenuItem key={rarity} value={rarity}>
                                {rarity}
                            </MenuItem>
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
                        value={colorFilter}
                        onChange={(event) => setColorFilter(event.target.value)}
                        displayEmpty // Add this prop to display the placeholder when the value is empty
                        renderValue={(selectedValue) => selectedValue || 'Color'}
                    >
                        <MenuItem value="">
                            <em>None</em>
                        </MenuItem>
                        {listOfColors.map(color => (
                            <MenuItem key={color} value={color}>
                                {color}
                            </MenuItem>
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
        </div >
    );
};

export default OPTCGcardFormat;

