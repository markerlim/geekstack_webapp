import React, { useEffect, useState } from "react";
import { db } from "../Firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import { Box, Grid, Select, MenuItem, FormControl, Button, Slider, useMediaQuery } from "@mui/material";
import { CardDrawer } from "./CardDrawer";
import { ArrowBack, Refresh, SwapHoriz } from "@mui/icons-material";
import searchMatch from "./searchUtils";
import { useLocation, useNavigate } from 'react-router-dom'
import { Helmet } from "react-helmet";


const AcardHTR = (props) => {
    const navigate = useNavigate();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const booster = queryParams.get("booster") || "";
    const uppercaseBooster = booster.toUpperCase();
    const [documents, setDocuments] = useState([]);
    const [openModal, setOpenModal] = useState(false);
    const [selectedCard, setSelectedCard] = useState(null);
    const [imageWidth, setImageWidth] = useState(100); //store value of slider
    const imageHeight = imageWidth * 1.395;
    const [boosterFilter, setBoosterFilter] = useState(uppercaseBooster || "");
    const [colorFilter, setColorFilter] = useState("");
    const [rarityFilter, setRarityFilter] = useState("");
    const [animeFilter, setAnimeFilter] = useState("Hunter X Hunter");
    const [altForms, setAltForms] = useState({});
    const [onlyAltForm, setOnlyAltForm] = useState(false);
    const [altFormIndex, setAltFormIndex] = useState({});
    const isMedium = useMediaQuery('(min-width:900px)');

    const goBack = () => {
        navigate(-1);
    };

    const getCurrentImage = (document) => {
        let currentImage = document.image;

        // Check if the alternate form should be used
        if ((onlyAltForm || rarityFilter === "ALT" || altFormIndex[document.cardId] !== undefined) && document.altforms) {
            if (Array.isArray(document.altforms)) {
                currentImage = document.altforms[altFormIndex[document.cardId] || 0];
            } else if (typeof document.altforms === "string") {
                currentImage = document.altforms;
            }
        }

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

        // If rarityFilter is "ALT", skip documents without alternate forms
        if (rarityFilter === "ALT") {
            while (!nextDocument.altforms) {
                nextIndex = (nextIndex + 1) % filteredDocuments.length;
                nextDocument = filteredDocuments[nextIndex];
            }
        }

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

        // If rarityFilter is "ALT", skip documents without alternate forms
        if (rarityFilter === "ALT") {
            while (!prevDocument.altforms) {
                prevIndex = (prevIndex - 1 + filteredDocuments.length) % filteredDocuments.length;
                prevDocument = filteredDocuments[prevIndex];
            }
        }

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
        setAltForms(false);
        setOnlyAltForm(false);
        setAltFormIndex({});
        setAnimeFilter("Hunter X Hunter");
        props.setSearchQuery("");
    };
    useEffect(() => {
        const fetchDocuments = async () => {
            const filteredQuery = query(collection(db, "unionarenatcg"), where("anime", "==", animeFilter));
            const querySnapshot = await getDocs(filteredQuery);
            const documentsArray = [];
            const initialAltForms = {};
            querySnapshot.forEach((doc) => {
                const docData = doc.data();
                documentsArray.push(docData);
                if (docData.altform) {
                    initialAltForms[docData.cardId] = 0;
                }
            });
            setDocuments(documentsArray);
            setAltForms(initialAltForms);
            console.log(`Number of reads: ${documentsArray.length}`);
        };

        fetchDocuments();
    }, [animeFilter]);


    const currentSearchQuery = props.searchQuery;

    const filteredDocuments = documents.filter((document) => {
        const boosterFilterMatch = !boosterFilter || document.booster === boosterFilter;
        const colorFilterMatch = !colorFilter || document.color === colorFilter;
        const animeFilterMatch = !animeFilter || document.anime === animeFilter;
        const searchFilterMatch = searchMatch(document, currentSearchQuery);
        const rarityFilterMatch = rarityFilter === "ALT" ? document.altforms !== undefined : !rarityFilter || document.rarity === rarityFilter;
        const altFormFilterMatch = !onlyAltForm || document.altform;

        return boosterFilterMatch && colorFilterMatch && animeFilterMatch && rarityFilterMatch && searchFilterMatch && altFormFilterMatch;
    });

    const handleSliderChange = (event, newValue) => {
        setImageWidth(newValue);
    };

    const handleFormChange = (event, document) => {
        event.stopPropagation(); // Prevent event from bubbling up
        setAltFormIndex(prev => {
            // Check if the document.cardId exists in the prev state
            if (prev[document.cardId] === undefined) {
                return {
                    ...prev,
                    [document.cardId]: 0
                };
            }
    
            let altFormsLength = 0;
            if (Array.isArray(document.altforms)) {
                altFormsLength = document.altforms.length;
            } else if (typeof document.altforms === "string") {
                altFormsLength = 1; // Consider the original form and the alt form
            }
            const currentFormIndex = prev[document.cardId];
            const newFormIndex = (currentFormIndex + 1) % (altFormsLength + 1); // Add 1 to account for the original form
    
            return {
                ...prev,
                [document.cardId]: newFormIndex,
            };
        });
    };    

    useEffect(() => {
        if (onlyAltForm) {
            setAltForms(prev => {
                const newAltForms = { ...prev };
                for (let cardId in newAltForms) {
                    const document = documents.find(doc => doc.cardId === cardId);
                    newAltForms[cardId] = (newAltForms[cardId] + 1) % document.altforms.length;
                }
                return newAltForms;
            });
            setAltFormIndex(prev => {
                const newAltFormIndex = { ...prev };
                for (let cardId in documents) {
                    if (documents[cardId].altforms) {
                        newAltFormIndex[cardId] = (newAltFormIndex[cardId] || 0 + 1) % documents[cardId].altforms.length;
                    }
                }
                return newAltFormIndex;
            });
        } else {
            setAltForms(prev => {
                const newAltForms = { ...prev };
                for (let cardId in newAltForms) {
                    newAltForms[cardId] = 0;
                }
                return newAltForms;
            });
            setAltFormIndex(prev => {
                const newAltFormIndex = { ...prev };
                for (let cardId in newAltFormIndex) {
                    newAltFormIndex[cardId] = 0;
                }
                return newAltFormIndex;
            });
        }
    }, [onlyAltForm, documents]);

    function isIOS() {
        return /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.userAgent.includes("Mac") && "ontouchend" in document);
      }

    return (
        <div style={{position:'relative'}}>
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
                            value={boosterFilter}
                            onChange={(event) => setBoosterFilter(event.target.value)}
                            displayEmpty // Add this prop to display the placeholder when the value is empty
                            renderValue={(selectedValue) => selectedValue || 'BT/ST'} // Add this prop to display the placeholder text when the value is empty
                        >
                            <MenuItem value="">
                                <em>None</em>
                            </MenuItem>
                            <MenuItem value="UA03BT">UA03BT</MenuItem>
                            <MenuItem value="UA03ST">UA03ST</MenuItem>
                            <MenuItem value="EX01BT">EX01BT</MenuItem>
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
                            value={rarityFilter}
                            onChange={(event) => setRarityFilter(event.target.value)}
                            displayEmpty // Add this prop to display the placeholder when the value is empty
                            renderValue={(selectedValue) => selectedValue || 'Rarity'} // Add this prop to display the placeholder text when the value is empty
                        >
                            <MenuItem value="">
                                <em>None</em>
                            </MenuItem>
                            <MenuItem value="ALT">Alt ART</MenuItem>
                            <MenuItem value="SR">SR</MenuItem>
                            <MenuItem value="R">R</MenuItem>
                            <MenuItem value="U">U</MenuItem>
                            <MenuItem value="C">C</MenuItem>
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
                            <MenuItem value="Blue">Blue</MenuItem>
                            <MenuItem value="Green">Green</MenuItem>
                            <MenuItem value="Purple">Purple</MenuItem>
                            <MenuItem value="Yellow">Yellow</MenuItem>
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
                    <span>Hunter X Hunter</span>
                </Box>
                <Grid container spacing={2} justifyContent="center">
                    {filteredDocuments
                        .filter(document => !(rarityFilter === 'ALT' && (!document.altforms || document.altforms.length === 0 || document.altforms === '')))
                        .map((document) => {
                            if (rarityFilter === 'ALT' && document.altforms) {
                                const altForms = Array.isArray(document.altforms) ? document.altforms : typeof document.altforms === "string" ? [document.altforms] : [];
                                return altForms.map((form, index) => (
                                    <Grid item key={`${document.cardId}-${index}`} sx={{ position: "relative" }}>
                                        <Box onClick={() => handleOpenModal(document)} sx={{ overflow: "hidden", position: "relative", cursor: "pointer" }} height={imageHeight} width={imageWidth}>
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
                                                alt={document.cardName}
                                                width={imageWidth}
                                                height={imageHeight}
                                            />
                                        </Box>
                                        {((Array.isArray(document.altforms) && document.altforms.length > 0) || (typeof document.altforms === "string" && document.altforms !== '')) ? (
                                            <button
                                                onClick={(event) => handleFormChange(event, document)}
                                                style={{
                                                    position: "absolute", backgroundColor: "#7C4FFF",
                                                    border: "3px #934fff solid", borderRadius: "100px",
                                                    cursor: "pointer", bottom: 15, right: 5, width: `${imageWidth * 0.3}px`, height: `${imageWidth * 0.3}px`,
                                                    display: "flex", justifyContent: "center", alignItems: "center", overflow: "hidden"
                                                }}
                                            >
                                                <SwapHoriz sx={{ fontSize: "20px", color:'#F2f3f8' }} />
                                            </button>
                                        ) : null}
                                    </Grid>
                                )
                            }
                        })}
                    {selectedCard && (
                        <CardDrawer
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
                        value={boosterFilter}
                        onChange={(event) => setBoosterFilter(event.target.value)}
                        displayEmpty // Add this prop to display the placeholder when the value is empty
                        renderValue={(selectedValue) => selectedValue || 'BT/ST'} // Add this prop to display the placeholder text when the value is empty
                    >
                        <MenuItem value="">
                            <em>None</em>
                        </MenuItem>
                        <MenuItem value="UA03BT">UA03BT</MenuItem>
                        <MenuItem value="UA03ST">UA03ST</MenuItem>
                        <MenuItem value="EX01BT">EX01BT</MenuItem>
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
                        value={rarityFilter}
                        onChange={(event) => setRarityFilter(event.target.value)}
                        displayEmpty // Add this prop to display the placeholder when the value is empty
                        renderValue={(selectedValue) => selectedValue || 'Rarity'} // Add this prop to display the placeholder text when the value is empty
                    >
                        <MenuItem value="">
                            <em>None</em>
                        </MenuItem>
                        <MenuItem value="ALT">Alt ART</MenuItem>
                        <MenuItem value="SR">SR</MenuItem>
                        <MenuItem value="R">R</MenuItem>
                        <MenuItem value="U">U</MenuItem>
                        <MenuItem value="C">C</MenuItem>
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
                        <MenuItem value="Blue">Blue</MenuItem>
                        <MenuItem value="Green">Green</MenuItem>
                        <MenuItem value="Purple">Purple</MenuItem>
                        <MenuItem value="Yellow">Yellow</MenuItem>
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

export default AcardHTR;

