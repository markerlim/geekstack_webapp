import React, { useEffect, useState } from "react";
import { db } from "../Firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import { Box, Button, FormControl, Grid, MenuItem, Select } from "@mui/material";
import { AddCircle, ArrowBack, Refresh, RemoveCircle } from "@mui/icons-material";
import { useCardState } from "../context/useCardState";
import { ResponsiveImage } from "./ResponsiveImage";
import { CardDrawerNF } from "./CardDrawerFormatted";
import GSearchBarUADB from "./ChipSearchBarUADBCardRef";
import axios from 'axios';


const DBCardRef = ({ filters, isButtonClicked, setIsButtonClicked, setChangeClick }) => {
    const [documents, setDocuments] = useState([]);
    const [openModal, setOpenModal] = useState(false);
    const [selectedCard, setSelectedCard] = useState(null);
    const { filteredCards, setFilteredCards, animeFilter, setAnimeFilter } = useCardState(); // Use useCardState hook
    const [animeData, setAnimeData] = useState([]);
    const [boosterFilter, setBoosterFilter] = useState("");
    const [colorFilter, setColorFilter] = useState("");
    const [rarityFilter, setRarityFilter] = useState("");
    const [costFilter, setCostFilter] = useState("");
    const [triggerFilter, setTriggerFilter] = useState("");
    const [searchQuery, setSearchQuery] = useState(""); // State to hold the search query


    const getCurrentImage = (document) => {
        let currentImage = document.urlimage;
        return currentImage;
    };

    const resetFilters = () => {
        setBoosterFilter("");
        setColorFilter("");
        setCostFilter("");
        setRarityFilter("");
        setTriggerFilter("");
    };

    const resetAnimeFilters = () => {
        setAnimeFilter("");
    }

    const handleSwipeLeft = () => {
        let currentIndex = filteredDocuments.findIndex((doc) => doc.cardUid === selectedCard.cardUid);
        let nextIndex = (currentIndex + 1) % filteredDocuments.length;
        let nextDocument = filteredDocuments[nextIndex];
        const currentImage = getCurrentImage(nextDocument);
        setSelectedCard({
            ...nextDocument,
            currentImage: currentImage
        });
    };
    const handleSwipeRight = () => {
        let currentIndex = filteredDocuments.findIndex((doc) => doc.cardUid === selectedCard.cardUid);
        let prevIndex = (currentIndex - 1 + filteredDocuments.length) % filteredDocuments.length;
        let prevDocument = filteredDocuments[prevIndex];
        const currentImage = getCurrentImage(prevDocument);
        setSelectedCard({
            ...prevDocument,
            currentImage: currentImage
        });
    };

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

    const modifyCardCount = (cardId, cardUid, change) => {
        // Filter cards with the same cardId
        const cardsWithSameId = filteredCards.filter(card => card.cardId === cardId);
        // Count the total number of cards with the same cardId
        const countOfSameId = cardsWithSameId.reduce((total, card) => total + card.count, 0);
        // Get the banRatio for the cardId
        const banRatio = cardsWithSameId.length > 0 ? cardsWithSameId[0].banRatio : 4;
        console.log(banRatio)
        // Check if adding 'change' cards would exceed the limit of 4 cards with the same cardId
        if (countOfSameId + change <= banRatio) {
            // Find the index of the existing card in filteredCards based on cardUid
            const existingCardIndex = filteredCards.findIndex(card => card.cardUid === cardUid);

            // If the card with cardUid exists
            if (existingCardIndex !== -1) {
                const existingCard = filteredCards[existingCardIndex];
                const newCount = Math.max(0, existingCard.count + change);

                // If newCount becomes 0, remove the card from filteredCards
                if (newCount === 0) {
                    setFilteredCards(prevFilteredCards => prevFilteredCards.filter(card => card.cardUid !== cardUid));
                } else {
                    // Update the count of the existing card
                    setFilteredCards(prevFilteredCards => {
                        const updatedCards = [...prevFilteredCards];
                        updatedCards[existingCardIndex] = { ...existingCard, count: newCount };
                        return updatedCards;
                    });
                }
            } else if (change > 0) {
                // If the card with cardUid doesn't exist and change is positive, add a new card
                const newCard = documents.find(onepiece => onepiece.cardUid === cardUid);
                if (newCard) {
                    setFilteredCards(prevFilteredCards => [...prevFilteredCards, { ...newCard, count: 1 }]);
                }
            }
        }
        // Toggle the state of changeClick
        setChangeClick(prevState => !prevState);
    };

    const increase = (cardId, cardUid) => modifyCardCount(cardId, cardUid, 1);
    const decrease = (cardId, cardUid) => modifyCardCount(cardId, cardUid, -1);


    // Event handler for search input change
    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    };

    const filteredDocuments = documents.filter((document) => {
        const boosterFilterMatch = !boosterFilter || document.booster === boosterFilter;
        const colorFilterMatch = !colorFilter || document.color === colorFilter;
        const rarityFilterMatch = !rarityFilter || document.rarity === rarityFilter;
        const costFilterMatch = !costFilter || document.energycost === costFilter;
        const triggerFilterMatch = !triggerFilter || document.triggerState === triggerFilter;
        const animeFilterMatch = !animeFilter || document.anime === animeFilter;
        const searchQueryMatch = !searchQuery || document.cardNameTokens.map(token => token.toLowerCase()).join(' ').includes(searchQuery.toLowerCase());

        return boosterFilterMatch && colorFilterMatch && rarityFilterMatch && triggerFilterMatch && costFilterMatch && animeFilterMatch && searchQueryMatch;
    });

    useEffect(() => {
        const fetchAnimeData = async () => {
          try {
            const response = await axios.get("https://ap-southeast-1.aws.data.mongodb-api.com/app/data-fwguo/endpoint/getUABoosterDatabase");
            
            // Sort the animeData array based on the first element in listofboosters for each entry
            const sortedData = response.data.sort((a, b) => {
              // Assuming listofboosters is an array and we are comparing the first element
              return a.listofboosters[0] > b.listofboosters[0] ? 1 : -1;
            });
      
            setAnimeData(sortedData.reverse());  // Store the sorted data in state
            console.log(sortedData);
          } catch (error) {
            console.error("Error fetching anime data:", error);
          }
        };
      
        fetchAnimeData(); // Call the function to fetch the data
      }, []);      

    useEffect(() => {
        const fetchDocuments = async () => {
            if (boosterFilter === "" && colorFilter === "" && animeFilter === "") {
                return;
            }
            let docRef = collection(db, "unionarenatcgV2");
            const q = query(docRef, where("anime", "==", animeFilter));

            const querySnapshot = await getDocs(q);
            let documentsArray = [];
            querySnapshot.forEach((doc) => {
                documentsArray.push(doc.data());
            });
            documentsArray = documentsArray.map(document => ({
                ...document,
                count: document.count || 0
            }));
            setDocuments(documentsArray);

        };

        fetchDocuments();
    }, [animeFilter]);

    useEffect(() => {
        setDocuments(prevDoc => {
            return prevDoc.map(document => {
                const cardFromFiltered = filteredCards.find(card => card.cardUid === document.cardUid);
                if (cardFromFiltered) {
                    return {
                        ...document,
                        count: cardFromFiltered.count
                    };
                }
                return {
                    ...document,
                    count: 0
                };
            });
        });
    }, [filteredCards]);
    const triggerStateSet = ["Draw", "Active", "Color", "Blank", "Raid", "Special", "Final","Get"];
    const costSet = ["0","1","2","3","4","5","6","7","8","9","10"]

    return (
        <div>
            <Box sx={{ display: "flex", justifyContent: "center", marginBottom: 2, alignItems: "center" }}>
                {animeFilter === "" && (
                    <>
                        <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "center", flexWrap: "wrap", gap: 1 }}>
                            <br></br>
                            {animeData.map((anime) => (
                                <Button
                                    variant={animeFilter === anime.currentAnime ? "contained" : "outlined"}
                                    sx={{ backgroundColor: "#222032", color: "#9930f3" }}
                                    onClick={() => setAnimeFilter(anime.currentAnime)}>
                                    {anime.currentAnime}
                                </Button>
                            ))}
                        </Box>
                    </>
                )}
                {animeFilter !== "" && (
                    <Box sx={{ paddingTop: '10px', display:'flex',flexDirection:'column',alignItems:'center' }}>
                        <Box sx={{display:'flex', justifyContent:'center', flexWrap:'wrap'}}>
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
                                        .filter(anime => anime.currentAnime === animeFilter) // Get the anime that matches the current filter
                                        .flatMap(anime => anime.listofboosters) // Get the sets for the matched anime and flatten the result
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
                                        .filter(anime => anime.currentAnime === animeFilter) // Get the anime that matches the current filter
                                        .flatMap(anime => anime.listofcolors) // Get the sets for the matched anime and flatten the result
                                        .map(colorset => (
                                            <MenuItem key={colorset} value={colorset}>{colorset}</MenuItem>
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
                                    value={rarityFilter}
                                    onChange={(event) => setRarityFilter(event.target.value)}
                                    displayEmpty // Add this prop to display the placeholder when the value is empty
                                    renderValue={(selectedValue) => selectedValue || 'Rarity'}
                                >
                                    <MenuItem value="">
                                        <em>None</em>
                                    </MenuItem>
                                    {animeData
                                        .filter(anime => anime.currentAnime === animeFilter) // Get the anime that matches the current filter
                                        .flatMap(anime => anime.listofrarities) // Get the sets for the matched anime and flatten the result
                                        .map(rarityset => (
                                            <MenuItem key={rarityset} value={rarityset}>{rarityset}</MenuItem>
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
                                    value={costFilter}
                                    onChange={(event) => setCostFilter(event.target.value)}
                                    displayEmpty // Add this prop to display the placeholder when the value is empty
                                    renderValue={(selectedValue) => selectedValue || 'Cost'}
                                >
                                    <MenuItem value="">
                                        <em>None</em>
                                    </MenuItem>
                                    {
                                        animeData
                                            .filter(anime => anime.currentAnime === animeFilter) // Get the anime that matches the current filter
                                            .flatMap(() => costSet) // Use flatMap to integrate the costSet
                                            .map(cost => (
                                                <MenuItem key={cost} value={cost}>{cost}</MenuItem>
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
                                    value={triggerFilter}
                                    onChange={(event) => setTriggerFilter(event.target.value)}
                                    displayEmpty // Add this prop to display the placeholder when the value is empty
                                    renderValue={(selectedValue) => selectedValue || 'Trigger'}
                                >
                                    <MenuItem value="">
                                        <em>None</em>
                                    </MenuItem>
                                    {
                                        animeData
                                            .filter(anime => anime.currentAnime === animeFilter) // Get the anime that matches the current filter
                                            .flatMap(() => triggerStateSet) // Use flatMap to integrate the costSet
                                            .map(triggerState => (
                                                triggerState === "Blank" ? (
                                                    <MenuItem key="-" value="-">Blank</MenuItem>
                                                ) : (
                                                    <MenuItem key={triggerState} value={triggerState}>{triggerState}</MenuItem>
                                                )
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
                        </Box>
                        <GSearchBarUADB handleSearchChange={handleSearchChange} />
                    </Box>
                )}
            </Box>
            <Grid container spacing={2} justifyContent="center">
                {animeFilter !== "" && filteredDocuments.map((document, index) => (
                    <Grid item key={document.cardUid + index}>
                        <Box sx={{ position: 'relative' }} >
                            <ResponsiveImage
                                loading="lazy"
                                src={document.urlimage}
                                draggable="false"
                                alt="loading..."
                                onClick={() => handleOpenModal(document)}
                            />
                            {
                                document.banRatio !== "4" && (
                                    <Box sx={{ width: '25px', color: '#f2f3f8', height: '25px', borderRadius: '12.5px', backgroundColor: '#240056', position: 'absolute', display: 'flex', justifyContent: 'center', alignItems: 'center', top: '5px', right: '5px' }}>
                                        {document.banRatio}
                                    </Box>
                                )
                            }
                            <Box display={"flex"} flexDirection={"row"} gap={1} alignItems={"center"} justifyContent={"center"} sx={{ color: '#C8A2C8' }}>
                                <div component={Button} onClick={() => decrease(document.cardId, document.cardUid)} style={{ cursor: "pointer" }}>
                                    <RemoveCircle sx={{ fontSize: 20 }} />
                                </div>
                                <div style={{ fontSize: 15 }}>{document.count || 0}</div>
                                <div component={Button} onClick={() => increase(document.cardId, document.cardUid)} style={{ cursor: "pointer" }}>
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
                        onSwipeLeft={handleSwipeLeft}
                        onSwipeRight={handleSwipeRight}
                    />
                )}
            </Grid>
        </div>
    );
}

export default DBCardRef