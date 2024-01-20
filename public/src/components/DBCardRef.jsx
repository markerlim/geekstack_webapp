import React, { useEffect, useState } from "react";
import { db } from "../Firebase";
import { collection, getDocs } from "firebase/firestore";
import { Box, Button, FormControl, Grid, MenuItem, Select } from "@mui/material";
import { setToLocalStorage } from "./LocalStorage/localStorageHelper";
import { AddCircle, ArrowBack, Refresh, RemoveCircle } from "@mui/icons-material";
import { useCardState } from "../context/useCardState";
import { ResponsiveImage } from "./ResponsiveImage";
import { CardDrawerNF } from "./CardDrawerFormatted";

const DBCardRef = (props) => {
    const [documents, setDocuments] = useState([]);
    const [openModal, setOpenModal] = useState(false);
    const [selectedCard, setSelectedCard] = useState(null);
    const { countArray, setCountArray, setFilteredCards, animeFilter, setAnimeFilter } = useCardState(); // Use useCardState hook

    const [boosterFilter, setBoosterFilter] = useState("");
    const [colorFilter, setColorFilter] = useState("");

    const resetFilters = () => {
        setBoosterFilter("");
        setColorFilter("");
        props.setSearchQuery("");
    };

    const resetAnimeFilters = () => {
        setAnimeFilter("");
    }

    const handleOpenModal = (document) => {
        let currentImage = document.image
        setSelectedCard({
            ...document,
            currentImage: currentImage
        });
        setOpenModal(true);
    }

    const handleCloseModal = () => {
        setSelectedCard(null);
        setOpenModal(false);
    };

    const updateFilteredCards = (updatedCountArray) => {
        const newFilteredCards = documents.filter((doc) => updatedCountArray[doc.cardId] > 0)
            .map((doc) => ({ ...doc, count: updatedCountArray[doc.cardId] }));
        setFilteredCards(newFilteredCards);
        setToLocalStorage("filteredCards", newFilteredCards);
    };

    const increase = (cardId) => {
        setCountArray((prevCountArray) => {
            const newArray = { ...prevCountArray };

            // Get the specific card's banRatio
            const card = documents.find(doc => doc.cardId === cardId);
            const cardMaxCount = card ? card.banRatio : 0;  // default to 0 if card is not found

            if (!newArray[cardId]) {
                newArray[cardId] = 0;
            }
            if (newArray[cardId] < cardMaxCount) {
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

    const filteredDocuments = documents.filter((document) => {
        const boosterFilterMatch = !boosterFilter || document.booster === boosterFilter;
        const colorFilterMatch = !colorFilter || document.color === colorFilter;
        const animeFilterMatch = !animeFilter || document.anime === animeFilter;

        return boosterFilterMatch && colorFilterMatch && animeFilterMatch;
    });

    useEffect(() => {
        const fetchDocuments = async () => {
            if (boosterFilter === "" && colorFilter === "" && animeFilter === "") {
                return;
            }
            let docRef = collection(db, "unionarenatcg");

            const querySnapshot = await getDocs(docRef);
            const documentsArray = [];
            querySnapshot.forEach((doc) => {
                documentsArray.push(doc.data());
            });
            setDocuments(documentsArray);
        };

        fetchDocuments();
    }, [animeFilter]);



    useEffect(() => {
        if (animeFilter !== "") {
            return;
        }

        const initialCountArray = documents.reduce((accumulator, document) => {
            accumulator[document.cardId] = 0;
            return accumulator;
        }, {});

        setCountArray(initialCountArray);
    }, [documents, animeFilter]);

    const animeData = [
        { filter: 'Code Geass', sets: ['UA01BT', 'UA01ST','EX02BT'], colorsets: ['Red', 'Green','Blue','Purple'] },
        { filter: 'Jujutsu No Kaisen', sets: ['UA02BT', 'UA02ST', 'UA02NC'], colorsets: ['Blue', 'Yellow', 'Purple'] },
        { filter: 'Hunter X Hunter', sets: ['UA03BT', 'UA03ST', 'EX01BT'], colorsets: ['Blue', 'Green', 'Purple', 'Yellow'] },
        { filter: 'Idolmaster Shiny Colors', sets: ['UA04BT', 'UA04ST', 'EX03BT'], colorsets: ['Red', 'Blue', 'Yellow', 'Purple'] },
        { filter: 'Demon Slayer', sets: ['UA05BT', 'UA05ST', 'UA01NC'], colorsets: ['Red', 'Yellow', 'Purple'] },
        { filter: 'Tales of Arise', sets: ['UA06BT', 'UA06ST'], colorsets: ['Red', 'Blue', 'Green'] },
        { filter: 'That Time I Got Reincarnated as a Slime', sets: ['UA07BT', 'UA07ST'], colorsets: ['Blue', 'Green', 'Yellow'] },
        { filter: 'Bleach: Thousand-Year Blood War', sets: ['UA08BT', 'UA08ST'], colorsets: ['Green', 'Purple', 'Yellow'] },
        { filter: 'Me & Roboco', sets: ['UA09BT', 'UA09ST'], colorsets: ['Green', 'Blue', 'Yellow'] },
        { filter: 'My Hero Academia', sets: ['UA10BT', 'UA10ST'], colorsets: ['Red', 'Green', 'Purple'] },
        { filter: 'Gintama', sets: ['UA11BT', 'UA11ST'], colorsets: ['Red', 'Purple', 'Yellow'] },
        { filter: 'Bluelock', sets: ['UA12BT', 'UA12ST'], colorsets: ['Red', 'Blue', 'Yellow'] },
        { filter: 'Tekken 7', sets: ['UA13BT', 'UA13ST'], colorsets: ['Red', 'Blue', 'Purple'] },
        { filter: 'Dr. Stone', sets: ['UA14BT', 'UA14ST'], colorsets: ['Green', 'Purple', 'Yellow'] },
        { filter: 'Sword Art Online', sets: ['UA15BT', 'UA15ST'], colorsets: ['Yellow', 'Blue', 'Green'] },
    ]

    return (
        <div>
            <Box sx={{ display: "flex", justifyContent: "center", marginBottom: 2, alignItems: "center" }}>
                {animeFilter === "" && (
                    <>
                        <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "center", flexWrap: "wrap", gap: 1 }}>
                            <br></br>
                            {animeData.map((anime) => (
                                <Button
                                    variant={animeFilter === anime.filter ? "contained" : "outlined"}
                                    sx={{ backgroundColor: "#222032", color: "#9930f3" }}
                                    onClick={() => setAnimeFilter(anime.filter)}>
                                    {anime.filter}
                                </Button>
                            ))}
                        </Box>
                    </>
                )}
                {animeFilter !== "" && (
                    <>
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
                                {animeData
                                    .filter(anime => anime.filter === animeFilter) // Get the anime that matches the current filter
                                    .flatMap(anime => anime.sets) // Get the sets for the matched anime and flatten the result
                                    .map(set => (
                                        <MenuItem key={set} value={set}>{set}</MenuItem>
                                    ))
                                }
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
                                {animeData
                                    .filter(anime => anime.filter === animeFilter) // Get the anime that matches the current filter
                                    .flatMap(anime => anime.colorsets) // Get the sets for the matched anime and flatten the result
                                    .map(colorset => (
                                        <MenuItem key={colorset} value={colorset}>{colorset}</MenuItem>
                                    ))
                                }
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
                            onClick={resetAnimeFilters}
                        >
                            <ArrowBack sx={{ fontSize: 15 }} />
                        </Button>
                    </>
                )}
            </Box>
            <Grid container spacing={2} justifyContent="center">
                {animeFilter !== "" && filteredDocuments.map((document, index) => (
                    <Grid item key={document.cardId}>
                        <Box sx={{ position: 'relative' }} >
                            <ResponsiveImage
                                loading="lazy"
                                src={document.image}
                                draggable="false"
                                alt="loading..."
                                onClick={() => handleOpenModal(document)}
                            />
                            {
                                document.banRatio !== "4" && (
                                    <Box sx={{ width: '25px',color:'#f2f3f8', height: '25px', borderRadius: '12.5px', backgroundColor: '#240056', position: 'absolute', display: 'flex', justifyContent: 'center', alignItems: 'center', top: '5px', right: '5px' }}>
                                        {document.banRatio}
                                    </Box>
                                )
                            }
                            <Box display={"flex"} flexDirection={"row"} gap={1} alignItems={"center"} justifyContent={"center"} sx={{ color: '#C8A2C8' }}>
                                <div component={Button} onClick={() => decrease(document.cardId)} style={{ cursor: "pointer" }}>
                                    <RemoveCircle sx={{ fontSize: 20 }} />
                                </div>
                                <div style={{ fontSize: 15 }}>{countArray[document.cardId] || 0}</div>
                                <div component={Button} onClick={() => increase(document.cardId)} style={{ cursor: "pointer" }}>
                                    <AddCircle sx={{ fontSize: 20 }} />
                                </div>
                            </Box>
                        </Box>
                    </Grid>
                ))}
                {selectedCard && (
                    <CardDrawerNF
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