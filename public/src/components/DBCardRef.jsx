import React, { useEffect, useState } from "react";
import { db } from "../Firebase";
import { collection, getDocs } from "firebase/firestore";
import { Box, Button, FormControl, Grid, MenuItem, Select } from "@mui/material";
import { AddCircle, ArrowBack, Refresh, RemoveCircle } from "@mui/icons-material";
import { useCardState } from "../context/useCardState";
import { ResponsiveImage } from "./ResponsiveImage";
import { CardDrawerNF } from "./CardDrawerFormatted";
import GSearchBarUADB from "./ChipSearchBarUADBCardRef";
import { toInteger } from "lodash";

const DBCardRef = ({ filters, isButtonClicked, setIsButtonClicked, setChangeClick }) => {
    const [documents, setDocuments] = useState([]);
    const [openModal, setOpenModal] = useState(false);
    const [selectedCard, setSelectedCard] = useState(null);
    const { filteredCards, setFilteredCards, animeFilter, setAnimeFilter } = useCardState(); // Use useCardState hook
    const [boosterFilter, setBoosterFilter] = useState("");
    const [colorFilter, setColorFilter] = useState("");
    const [rarityFilter, setRarityFilter] = useState("");
    const [costFilter, setCostFilter] = useState("");
    const [triggerFilter, setTriggerFilter] = useState("");
    const [searchQuery, setSearchQuery] = useState(""); // State to hold the search query


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
        const fetchDocuments = async () => {
            if (boosterFilter === "" && colorFilter === "" && animeFilter === "") {
                return;
            }
            let docRef = collection(db, "unionarenatcgnew");

            const querySnapshot = await getDocs(docRef);
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


    const animeData = [
        { filter: 'Code Geass', sets: ['UA01BT', 'UA01ST', 'EX02BT'], colorsets: ['Red', 'Green', 'Blue', 'Purple'], raritysets: ['ALT', 'SR', 'C', 'U', 'R'] },
        { filter: 'Jujutsu No Kaisen', sets: ['UA02BT', 'UA02ST', 'UA02NC', 'EX04BT'], colorsets: ['Blue', 'Yellow', 'Purple', 'Red'], raritysets: ['ALT', 'SP', 'SR', 'C', 'U', 'R'] },
        { filter: 'Hunter X Hunter', sets: ['UA03BT', 'UA03ST', 'EX01BT', 'PROMO'], colorsets: ['Blue', 'Green', 'Purple', 'Yellow'], raritysets: ['ALT', 'PR', 'SR', 'C', 'U', 'R'] },
        { filter: 'Idolmaster Shiny Colors', sets: ['UA04BT', 'UA04ST', 'EX03BT', 'PROMO'], colorsets: ['Red', 'Blue', 'Yellow', 'Purple'], raritysets: ['ALT', 'PR', 'SR', 'C', 'U', 'R'] },
        { filter: 'Demon Slayer', sets: ['UA05BT', 'UA05ST', 'UA01NC', 'EX05BT'], colorsets: ['Red', 'Yellow', 'Purple', 'Blue'], raritysets: ['ALT', 'SP', 'SR', 'C', 'U', 'R'] },
        { filter: 'Tales of Arise', sets: ['UA06BT', 'UA06ST'], colorsets: ['Red', 'Blue', 'Green'], raritysets: ['ALT', 'SR', 'C', 'U', 'R'] },
        { filter: 'That Time I Got Reincarnated as a Slime', sets: ['UA07BT', 'UA07ST', 'PROMO'], colorsets: ['Blue', 'Green', 'Yellow'], raritysets: ['ALT', 'PR', 'SR', 'C', 'U', 'R'] },
        { filter: 'Bleach: Thousand-Year Blood War', sets: ['UA08BT', 'UA08ST', 'EX07BT'], colorsets: ['Green', 'Purple', 'Yellow', 'Blue'], raritysets: ['ALT', 'SR', 'C', 'U', 'R'] },
        { filter: 'Me & Roboco', sets: ['UA09BT', 'UA09ST'], colorsets: ['Green', 'Blue', 'Yellow'], raritysets: ['ALT', 'SR', 'C', 'U', 'R'] },
        { filter: 'My Hero Academia', sets: ['UA10BT', 'UA10ST', 'EX06BT'], colorsets: ['Red', 'Green', 'Purple', 'Yellow'], raritysets: ['ALT', 'SR', 'C', 'U', 'R'] },
        { filter: 'Gintama', sets: ['UA11BT', 'UA11ST', 'PROMO'], colorsets: ['Red', 'Purple', 'Yellow'], raritysets: ['ALT', 'PR', 'SR', 'C', 'U', 'R'] },
        { filter: 'Bluelock', sets: ['UA12BT', 'UA12ST','UA03NC'], colorsets: ['Red', 'Blue', 'Yellow'], raritysets: ['ALT','SP','SR', 'C', 'U', 'R'] },
        { filter: 'Tekken 7', sets: ['UA13BT', 'UA13ST'], colorsets: ['Red', 'Blue', 'Purple'], raritysets: ['ALT', 'SR', 'C', 'U', 'R'] },
        { filter: 'Dr. Stone', sets: ['UA14BT', 'UA14ST'], colorsets: ['Green', 'Purple', 'Yellow'], raritysets: ['ALT', 'SR', 'C', 'U', 'R'] },
        { filter: 'Sword Art Online', sets: ['UA15BT', 'UA15ST'], colorsets: ['Yellow', 'Blue', 'Green'], raritysets: ['ALT', 'SR', 'C', 'U', 'R'] },
        { filter: 'Synduality Noir', sets: ['UA16BT', 'UA16ST'], colorsets: ['Red', 'Yellow', 'Purple'], raritysets: ['ALT', 'SR', 'C', 'U', 'R'] },
        { filter: 'Toriko', sets: ['UA17BT', 'UA17ST'], colorsets: ['Blue', 'Yellow', 'Purple'], raritysets: ['ALT', 'SR', 'C', 'U', 'R'] },
        { filter: 'Goddess of Victory : Nikke', sets: ['UA18BT', 'UA18ST'], colorsets: ['Green', 'Yellow', 'Purple'], raritysets: ['ALT', 'SR', 'C', 'U', 'R'] },
        { filter: 'Haikyu!!', sets: ['UA19BT', 'UA19ST'], colorsets: ['Red', 'Blue', 'Yellow'], raritysets: ['ALT', 'SR', 'C', 'U', 'R'] },
        { filter: 'Black Clover', sets: ['UA20BT', 'UA20ST'], colorsets: ['Red', 'Green', 'Purple'], raritysets: ['ALT', 'SR', 'C', 'U', 'R'] },
        { filter: 'YuYu Hakusho', sets: ['UA21BT', 'UA21ST'], colorsets: ['Red', 'Green', 'Purple'], raritysets: ['ALT', 'SR', 'C', 'U', 'R'] },
        { filter: 'GAMERA -Rebirth-', sets: ['UA22BT'], colorsets: ['Green', 'Blue'], raritysets: ['ALT', 'SR', 'C', 'U', 'R'] },
        { filter: 'Attack On Titan', sets: ['UA23BT', 'UA23ST'], colorsets: ['Green', 'Blue', 'Red'], raritysets: ['ALT', 'SR', 'C', 'U', 'R'] },
        { filter: 'SHY', sets: ['UA24BT'], colorsets: ['Blue', 'Red'], raritysets: ['ALT', 'SR', 'C', 'U', 'R'] },
        { filter: 'Undead Unluck', sets: ['UA25BT'], colorsets: ['Purple', 'Red'], raritysets: ['ALT', 'SR', 'C', 'U', 'R'] },
        { filter: 'The 100 Girlfriends Who Really, Really, Really, Really, Really Love You', sets: ['UA26BT'], colorsets: ['Green', 'Yellow'], raritysets: ['ALT', 'SR', 'C', 'U', 'R'] },
    ]
    const triggerStateSet = ["Draw", "Active", "Color", "Blank", "Raid", "Special", "Final"];
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
                                        .filter(anime => anime.filter === animeFilter) // Get the anime that matches the current filter
                                        .flatMap(anime => anime.raritysets) // Get the sets for the matched anime and flatten the result
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
                                            .filter(anime => anime.filter === animeFilter) // Get the anime that matches the current filter
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
                                            .filter(anime => anime.filter === animeFilter) // Get the anime that matches the current filter
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
                                src={document.image}
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
                    />
                )}
            </Grid>
        </div>
    );
}

export default DBCardRef