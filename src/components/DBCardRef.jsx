import React, { useEffect, useState } from "react";
import { db } from "../Firebase";
import { collection, getDocs } from "firebase/firestore";
import { Box, Button, FormControl, Grid, MenuItem, Select } from "@mui/material";
import { setToLocalStorage, getFromLocalStorage } from "./LocalStorage/localStorageHelper";
import { CardModal } from "./CardModal";
import { AddCircle, Refresh, RemoveCircle } from "@mui/icons-material";
import { useCardState } from "../context/useCardState";
import { ResponsiveImage } from "./ResponsiveImage";
import searchMatch from "./searchUtils";

const DBCardRef = (props) => {
    const [documents, setDocuments] = useState([]);
    const [openModal, setOpenModal] = useState(false);
    const [selectedCard, setSelectedCard] = useState(null);
    const { countArray, setCountArray, filteredCards, setFilteredCards } = useCardState(); // Use useCardState hook

    const [boosterFilter, setBoosterFilter] = useState("");
    const [colorFilter, setColorFilter] = useState("");
    const [animeFilter, setAnimeFilter] = useState("");

    const resetFilters = () => {
        setBoosterFilter("");
        setColorFilter("");
        setAnimeFilter("");
    };

    const handleOpenModal = (document) => {
        setSelectedCard(document);
        setOpenModal(true);
    }

    const handleCloseModal = () => {
        setSelectedCard(null);
        setOpenModal(false);
    };

    const MAX_COUNT = 4;

    const updateFilteredCards = (updatedCountArray) => {
        const newFilteredCards = documents.filter((doc) => updatedCountArray[doc.cardId] > 0)
            .map((doc) => ({ ...doc, count: updatedCountArray[doc.cardId] }));
        setFilteredCards(newFilteredCards);
        setToLocalStorage("filteredCards", newFilteredCards);
    };

    const increase = (cardId) => {
        setCountArray((prevCountArray) => {
            const newArray = { ...prevCountArray };
            if (!newArray[cardId]) {
                newArray[cardId] = 0;
            }
            if (newArray[cardId] < MAX_COUNT) {
                newArray[cardId]++;
            }
            setToLocalStorage("countArray", newArray);
            updateFilteredCards(newArray);
            return newArray;
        });
    };

    const decrease = (cardId) => {
        setCountArray((prevCountArray) => {
            const newArray = { ...prevCountArray };
            if (newArray[cardId] > 0) {
                newArray[cardId]--;
            }
            setToLocalStorage("countArray", newArray);
            updateFilteredCards(newArray);
            return newArray;
        });
    };

    const currentSearchQuery = props.searchQuery;
    
    const filteredDocuments = documents.filter((document) => {
        const boosterFilterMatch = !boosterFilter || document.booster === boosterFilter;
        const colorFilterMatch = !colorFilter || document.color === colorFilter;
        const animeFilterMatch = !animeFilter || document.anime === animeFilter;
        const searchFilterMatch = searchMatch(document, currentSearchQuery);

        return boosterFilterMatch && colorFilterMatch && animeFilterMatch && searchFilterMatch;
    });

    useEffect(() => {
        const fetchDocuments = async () => {
            const querySnapshot = await getDocs(collection(db, "unionarenatcg"));
            const documentsArray = [];
            querySnapshot.forEach((doc) => {
                documentsArray.push(doc.data());
            });
            setDocuments(documentsArray);
            setToLocalStorage("documents", documentsArray);
        };

        const localDocuments = getFromLocalStorage("documents");
        if (localDocuments) {
            setDocuments(localDocuments);
        } else {
            fetchDocuments();
        }
    }, []);


    useEffect(() => {
        const initialCountArray = documents.reduce((accumulator, document) => {
            accumulator[document.cardId] = 0;
            return accumulator;
        }, {});

        setCountArray(initialCountArray);
    }, [documents]);

    return (
        <div>
            <Box sx={{ display: "flex", justifyContent: "center", marginBottom: 2,alignItems:"center"}}>
                <FormControl sx={{margin:1}}>
                    <Select
                        sx={{
                            display:"flex",flexDirection:"column",justifyContent:"center",textAlign:"center",
                            whiteSpace: 'nowrap',backgroundColor: "#f2f3f8",borderRadius:"5px",
                            fontSize:11,width:"60px",height:"30px",
                            '& .MuiSelect-icon': {
                                display:"none",
                                position:"absolute"
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
                        <MenuItem value="UA02BT">UA02BT</MenuItem>
                        <MenuItem value="UA03BT">UA03BT</MenuItem>
                        <MenuItem value="UA04BT">UA04BT</MenuItem>
                        <MenuItem value="UA05BT">UA05BT</MenuItem>
                        <MenuItem value="UA01ST">UA01ST</MenuItem>
                        <MenuItem value="UA02ST">UA02ST</MenuItem>
                        <MenuItem value="UA03ST">UA03ST</MenuItem>
                        <MenuItem value="UA04ST">UA04ST</MenuItem>
                        <MenuItem value="UA05ST">UA05ST</MenuItem>
                    </Select>
                </FormControl>
                <FormControl sx={{margin:1}}>
                    <Select
                        sx={{
                            display:"flex",flexDirection:"column",justifyContent:"center",textAlign:"center",
                            whiteSpace: 'nowrap',backgroundColor: "#f2f3f8",borderRadius:"5px",
                            fontSize:11,width:"60px",height:"30px",
                            '& .MuiSelect-icon': {
                                display:"none",
                                position:"absolute"
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
                <FormControl sx={{margin:1}}>
                    <Select 
                        sx={{
                            display:"flex",flexDirection:"column",justifyContent:"center",textAlign:"center",
                            whiteSpace: 'nowrap',backgroundColor: "#f2f3f8",borderRadius:"5px",
                            fontSize:11,width:"60px",height:"30px",
                            '& .MuiSelect-icon': {
                                display:"none",
                                position:"absolute"
                            },
                        }}
                        value={animeFilter}
                        onChange={(event) => setAnimeFilter(event.target.value)}
                        displayEmpty // Add this prop to display the placeholder when the value is empty
                        renderValue={(selectedValue) => selectedValue || 'Anime'}
                    >
                        <MenuItem value="">
                            <em>None</em>
                        </MenuItem>
                        <MenuItem value="Code Geass">Code Geass</MenuItem>
                        <MenuItem value="Jujutsu No Kaisen">Jujutsu No Kaisen</MenuItem>
                        <MenuItem value="Hunter X Hunter">Hunter X Hunter</MenuItem>
                        <MenuItem value="Idolmaster Shiny Colors">Idolmaster Shiny Colors</MenuItem>
                        <MenuItem value="Demon Slayer">Demon Slayer</MenuItem>
                    </Select>
                </FormControl>
                <Button
                    sx={{
                        minWidth: 0, // Set the minimum width to 0 to allow the button to shrink
                        width: 30, // Change this value to adjust the width
                        height:20,
                        margin:1,
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
            <Grid container spacing={2} justifyContent="center">
                {filteredDocuments.map((document, index) => (
                    <Grid item key={document.cardId}>
                        <Box onClick={() => handleOpenModal(document)} >
                            <ResponsiveImage
                                loading="lazy"
                                src={document.image}
                                draggable="false"
                                alt="test"
                            />
                            <Box display={"flex"} flexDirection={"row"} gap={1} alignItems={"center"} justifyContent={"center"}>
                                <div component={Button} onClick={() => decrease(document.cardId)} style={{ cursor: "pointer" }}>
                                    <RemoveCircle sx={{ fontSize: 20 }} />
                                </div>
                                <span sx={{ fontSize: 20 }}>{countArray[document.cardId] || 0}</span>
                                <div component={Button} onClick={() => increase(document.cardId)} style={{ cursor: "pointer" }}>
                                    <AddCircle sx={{ fontSize: 20 }} />
                                </div>
                            </Box>
                        </Box>
                    </Grid>
                ))}
                {selectedCard && (
                    <CardModal
                        open={openModal}
                        onClose={handleCloseModal}
                        selectedCard={selectedCard}
                    />
                )}
            </Grid>
        </div>
    );
}

export default DBCardRef