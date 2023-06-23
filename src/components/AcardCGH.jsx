import React, { useEffect, useState } from "react";
import { db } from "../Firebase";
import { collection, getDocs } from "firebase/firestore";
import { Box, Grid, Select, MenuItem, FormControl, Button, Slider, Switch, FormControlLabel, Typography } from "@mui/material";
import { CardModal } from "./CardModal";
import { ArrowBack, Refresh } from "@mui/icons-material";
import searchMatch from "./searchUtils";
import { Link } from 'react-router-dom'
import { Helmet } from "react-helmet";


const AcardCGH = (props) => {
    const [documents, setDocuments] = useState([]);
    const [openModal, setOpenModal] = useState(false);
    const [selectedCard, setSelectedCard] = useState(null);
    const [imageWidth, setImageWidth] = useState(100); //store value of slider
    const imageHeight = imageWidth * 1.395; 
    const [boosterFilter, setBoosterFilter] = useState("");
    const [colorFilter, setColorFilter] = useState("");
    const [rarityFilter, setRarityFilter] = useState("");
    const [animeFilter, setAnimeFilter] = useState("Code Geass");
    const [altForms, setAltForms] = useState({});
    const [onlyAltForm, setOnlyAltForm] = useState(false);


    const handleOpenModal = (document) => {
        setSelectedCard(document);
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setSelectedCard(null);
        setOpenModal(false);
    };

    const resetFilters = () => {
        setBoosterFilter("");
        setColorFilter("");
        setRarityFilter("");
        setAltForms(false);
        setOnlyAltForm(false);
        setAnimeFilter("Code Geass");
        props.setSearchQuery("");
    };

    useEffect(() => {
        const fetchDocuments = async () => {
            const querySnapshot = await getDocs(collection(db, "unionarenatcg"));
            const documentsArray = [];
            querySnapshot.forEach((doc) => {
                documentsArray.push(doc.data());
            });
            setDocuments(documentsArray);
        };

        fetchDocuments();
    }, []);

    const currentSearchQuery = props.searchQuery;

    const filteredDocuments = documents.filter((document) => {
        const boosterFilterMatch = !boosterFilter || document.booster === boosterFilter;
        const colorFilterMatch = !colorFilter || document.color === colorFilter;
        const animeFilterMatch = !animeFilter || document.anime === animeFilter;
        const rarityFilterMatch = !rarityFilter || document.rarity === rarityFilter;
        const searchFilterMatch = searchMatch(document, currentSearchQuery);
        const altFormFilterMatch = !onlyAltForm || document.altform;

        return boosterFilterMatch && colorFilterMatch && animeFilterMatch && rarityFilterMatch && searchFilterMatch && altFormFilterMatch;
    });


    const handleSwipeLeft = () => {
        const currentIndex = filteredDocuments.findIndex((doc) => doc.cardId === selectedCard.cardId);
        const nextIndex = (currentIndex + 1) % filteredDocuments.length;
        setSelectedCard(filteredDocuments[nextIndex]);
    };

    const handleSwipeRight = () => {
        const currentIndex = filteredDocuments.findIndex((doc) => doc.cardId === selectedCard.cardId);
        const prevIndex = (currentIndex - 1 + filteredDocuments.length) % filteredDocuments.length;
        setSelectedCard(filteredDocuments[prevIndex]);
    };

    const handleSliderChange = (event, newValue) => {
        setImageWidth(newValue);
    };

    const handleAltformToggle = (cardId) => {
        if (!onlyAltForm) {
            setAltForms(prev => {
                const isAlt = prev[cardId];
                return {
                    ...prev,
                    [cardId]: !isAlt,
                };
            });
        }
    };
    
    useEffect(() => {
        if (onlyAltForm) {
            const newAltForms = {};
            documents.forEach((document) => {
                if (document.altform) {
                    newAltForms[document.cardId] = true;
                }
            });
            setAltForms(newAltForms);
        } else {
            setAltForms({});
        }
    }, [onlyAltForm, documents]);
    

    return (
        <div>
            <Helmet>
                <meta name="apple-mobile-web-app-capable" content="yes" />
            </Helmet>
            <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "center", marginBottom: 2, alignItems: "center" }}>
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
                            <MenuItem value="UA01BT">UA01BT</MenuItem>
                            <MenuItem value="UA01ST">UA01ST</MenuItem>
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
                            value={boosterFilter}
                            onChange={(event) => setBoosterFilter(event.target.value)}
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
                            <MenuItem value="Red">Red</MenuItem>
                            <MenuItem value="Green">Green</MenuItem>
                            <MenuItem value="Purple">Purple</MenuItem>
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
                    <FormControlLabel sx={{ bgcolor: "#f2f3f8", borderRadius: "7px", paddingRight: "10px", color: "#121212", height: 22 }}
                        control={
                            <Switch
                                checked={onlyAltForm}
                                onChange={() => setOnlyAltForm((prev) => !prev)}
                                color="primary"
                            />
                        }
                        label={
                            <Typography sx={{ fontSize: 12 }} variant="body2">Alternate Art</Typography>
                        }
                    />
                    <Button
                        sx={{
                            fontSize: 10,
                            height: 20,
                            padding: 1, // Adjust the padding as needed 
                            backgroundColor: "#f2f3f8",
                            color: "#240052",
                            '&:hover': {
                                backgroundColor: "#240052", // Change this to the desired hover background color
                                color: "#f2f3f8", // Change this to the desired hover text color if needed
                            },
                        }}
                        component={Link} href="#home" to="/"
                    >
                        Back <ArrowBack sx={{ fontSize: 15 }} />
                    </Button>
                </Box>
            </Box>
            <div style={{ overflowY: "auto", height: "86vh" }} className="hide-scrollbar">
                <Grid container spacing={2} justifyContent="center">
                    {filteredDocuments.map((document) => (
                        <Grid item key={document.cardId} sx={{ position: "relative" }}>
                            <Box onClick={() => handleOpenModal(document)} sx={{ overflow: "hidden", position: "relative" }} height={imageHeight} width={imageWidth}>
                                <img
                                    loading="lazy"
                                    src={altForms[document.cardId] ? document.altform : document.image}
                                    draggable="false"
                                    alt={document.cardId}
                                    width={imageWidth}
                                    height={imageHeight}
                                />
                                <div className={altForms[document.cardId] ? "card__shine_alt" : ""}>
                                    <div className={altForms[document.cardId] ? "card__shine-shimmer_alt" : ""}></div>
                                </div>
                            </Box>
                            {document.altform && (
                                <Switch
                                    checked={altForms[document.cardId]}
                                    onChange={() => handleAltformToggle(document.cardId)}
                                    color="primary"
                                    sx={{ position: "absolute", bottom: 0, right: 0 }}
                                />
                            )}
                        </Grid>
                    ))}
                    {selectedCard && (
                        <CardModal
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
        </div >
    );
};

export default AcardCGH;

