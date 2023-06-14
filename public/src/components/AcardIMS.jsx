import React, { useEffect, useState } from "react";
import { db } from "../Firebase";
import { collection, getDocs } from "firebase/firestore";
import { Box, Grid, Select, MenuItem, FormControl, Button } from "@mui/material";
import { setToLocalStorage, getFromLocalStorage } from "./LocalStorage/localStorageHelper";
import { CardModal } from "./CardModal";
import { ResponsiveImage } from "./ResponsiveImage";
import { Refresh } from "@mui/icons-material";
import searchMatch from "./searchUtils";


const AcardIMS = (props) => {
    const [documents, setDocuments] = useState([]);
    const [openModal, setOpenModal] = useState(false);
    const [selectedCard, setSelectedCard] = useState(null);

    const [boosterFilter, setBoosterFilter] = useState("");
    const [colorFilter, setColorFilter] = useState("");
    const [animeFilter, setAnimeFilter] = useState("Idolmaster Shiny Colors");

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
        setAnimeFilter("Idolmaster Shiny Colors");
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
        const searchFilterMatch = searchMatch(document, currentSearchQuery);

        return boosterFilterMatch && colorFilterMatch && animeFilterMatch && searchFilterMatch;
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


    return (
        <div>
            <Box sx={{ display: "flex", justifyContent: "center", marginBottom: 2, alignItems: "center" }}>
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
                        <MenuItem value="UA04BT">UA04BT</MenuItem>
                        <MenuItem value="UA04ST">UA04ST</MenuItem>
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
                        <MenuItem value="Blue">Blue</MenuItem>
                        <MenuItem value="Green">Green</MenuItem>
                        <MenuItem value="Yellow">Yellow</MenuItem>
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
            </Box>
            <div style={{ overflowY: "auto", height: "86vh" }} className="hide-scrollbar">
                <Grid container spacing={2} justifyContent="center">
                    {filteredDocuments.map((document) => (
                        <Grid item key={document.cardId}>
                            <Box onClick={() => handleOpenModal(document)}>
                                <ResponsiveImage
                                    loading="lazy"
                                    src={document.image}
                                    draggable="false"
                                    alt="loading..."
                                />
                            </Box>
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

export default AcardIMS;

