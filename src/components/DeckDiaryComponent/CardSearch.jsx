import { Box, Modal, TextField, Button, Autocomplete, Snackbar, Alert } from "@mui/material";
import { collection, getDocs, query, where, limit, startAfter } from "firebase/firestore";
import { useState, useEffect } from "react";
import { db } from "../../Firebase";
import axios from 'axios';

const CardSearch = ({ openSearchbar, setOpenSearchbar, handleCardSelection, content }) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [lastVisible, setLastVisible] = useState(null);
    const [hasMoreResults, setHasMoreResults] = useState(true);
    const [selectedBooster, setSelectedBooster] = useState(null); // Track selected booster
    const [selectedRarity, setSelectedRarity] = useState(null); // Track selected rarity
    const [selectedColor, setSelectedColor] = useState(null); // Track selected color
    const [boostersOptions, setBoostersOptions] = useState({
        unionarena: [],
        onepiece: [],
        dragonballzfw: []
    });
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");

    // Function to handle snackbar close
    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    // Fetch booster options from the API
    useEffect(() => {
        const getBoosterOptions = async () => {
            try {
                const response = await axios.get("https://ap-southeast-1.aws.data.mongodb-api.com/app/data-fwguo/endpoint/getUABoosterDatabase");
                const data = response.data;

                const boostersOptions = {
                    unionarena: [],
                    onepiece: [],  // Placeholder, can be updated
                    dragonballzfw: []  // Placeholder, can be updated
                };

                // Fill unionarena booster codes from the fetched data
                data.forEach(item => {
                    if (item.currentAnime) {
                        boostersOptions.unionarena.push(item.currentAnime); // Directly push the string
                    }
                });

                // Remove duplicate booster options (e.g., "PROMO")
                boostersOptions.unionarena = [...new Set(boostersOptions.unionarena)];

                setBoostersOptions(boostersOptions); // Update state with filtered boosters
            } catch (error) {
                console.error("Error fetching boosters:", error);
            }
        };

        getBoosterOptions();
    }, []);


    // Color options based on content type
    const colorOptions = {
        unionarena: ['Red', 'Blue', 'Green', 'Yellow', 'Purple'],
        onepiece: ['Red', 'Blue', 'Green', 'Yellow', 'Purple', 'Black'],
        dragonballzfw: ['Red', 'Blue', 'Green', 'Yellow', 'Black']
    };

    // Color options based on content type
    const rarityOptions = {
        unionarena: ['ALT', 'SR', 'C', 'U', 'R', 'SP', 'P'],
        onepiece: ['Red', 'Blue', 'Green', 'Yellow', 'Purple', 'Black'],
        dragonballzfw: ['Red', 'Blue', 'Green', 'Yellow', 'Black']
    };

    const rarity = rarityOptions[content] || [];
    const colors = colorOptions[content] || [];
    const boosters = boostersOptions[content] || [];

    // Firebase collection references based on content type
    const databaseref = content ? (
        content === 'unionarena' ? `unionarenatcgV2` :
            content === 'onepiece' ? `onepiececardgame` :
                content === 'dragonballzfw' ? `dragonballzfw` :
                    `unionarenatcgV2`
    ) : `unionarenatcgV2`;

    const databasefieldref = content ? (
        content === 'unionarena' ? `cardNameTokens` :
            content === 'onepiece' ? `cardname_lower_token` :
                content === 'dragonballzfw' ? `cardNameTokens` :
                    `unionarenatcgV2`
    ) : `unionarenatcgV2`;

    const databasefieldrefbooster = content ? (
        content === 'unionarena' ? `anime` :
            content === 'onepiece' ? `booster` :
                content === 'dragonballzfw' ? `booster` :
                    `unionarenatcgV2`
    ) : `unionarenatcgV2`;

    const PAGE_LIMIT = 12;

    // Function to search cards based on the input
    const searchCards = async (searchTerm, lastDoc = null) => {

        if (!selectedBooster && !searchTerm) {
            setSnackbarMessage("Please select a booster or enter a search term.");
            setSnackbarOpen(true);  // Open the snackbar with the message
            return;
        }

        try {
            let cardQuery;

            // If a booster is selected, filter only by booster
            if (selectedBooster) {
                cardQuery = query(
                    collection(db, `${databaseref}`),
                    where(`${databasefieldrefbooster}`, '==', selectedBooster),
                    limit(PAGE_LIMIT)
                );
            } else if (searchTerm) {
                // If no booster is selected but there is a search term
                const lowerCaseSearchTerm = searchTerm.toLowerCase();
                cardQuery = query(
                    collection(db, `${databaseref}`),
                    where(`${databasefieldref}`, "array-contains", lowerCaseSearchTerm),
                    limit(PAGE_LIMIT)
                );
            } else {
                // If neither is set, clear results
                setSearchResults([]);
                return;
            }

            if (lastDoc) {
                cardQuery = query(cardQuery, startAfter(lastDoc));
            }

            // Add filtering by color if selected
            if (selectedColor) {
                cardQuery = query(cardQuery, where('color', '==', selectedColor));
            }

            // Add filtering by color if selected
            if (selectedRarity) {
                cardQuery = query(cardQuery, where('rarity', '==', selectedRarity));
            }

            const querySnapshot = await getDocs(cardQuery);
            const results = querySnapshot.docs.map((doc) => doc.data());

            if (results.length < PAGE_LIMIT) {
                setHasMoreResults(false);
            }

            if (lastDoc) {
                setSearchResults((prevResults) => [...prevResults, ...results]);
            } else {
                setSearchResults(results);
            }

            setLastVisible(querySnapshot.docs[querySnapshot.docs.length - 1]);

        } catch (error) {
            console.error("Error fetching cards: ", error);
        }
    };

    const handleSearchInputChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleKeyPress = (e) => {
        if (e.key === "Enter") {
            setHasMoreResults(true);
            setLastVisible(null);
            searchCards(searchTerm);
        }
    };

    const loadNextPage = () => {
        if (hasMoreResults && lastVisible) {
            searchCards(searchTerm, lastVisible);
        }
    };

    const selectCard = (card) => {
        handleCardSelection({ urlimage: card.image });
        setOpenSearchbar(false);
    };

    return (
        <>
            <Modal open={openSearchbar} onClose={() => setOpenSearchbar(false)}>
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 'calc(100vw - 60px)',
                        maxWidth:'800px',
                        height: '600px',
                        bgcolor: '#121212',
                        color: '#fff',
                        borderRadius: 2,
                        border:'5px solid #000000',
                        boxShadow: 24,
                        display: 'flex',
                        flexDirection: 'column',
                        paddingBottom:'10px'
                    }}
                >
                    <Snackbar
                        open={snackbarOpen}
                        autoHideDuration={3000}  // Automatically hide after 3 seconds
                        onClose={handleSnackbarClose}
                        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                    >
                        <Alert onClose={handleSnackbarClose} severity="warning" sx={{ width: '100%' }}>
                            {snackbarMessage}
                        </Alert>
                    </Snackbar>
                    {/* Search Results */}
                    <Box
                        sx={{
                            flex: 1,
                            overflowY: "auto",
                            display: 'flex',
                            flexDirection: 'row',
                            flexWrap: 'wrap',
                            padding: '10px',
                            justifyContent: 'center'
                        }}
                    >
                        {searchResults.length > 0 ? (
                            searchResults.map((card, index) => (
                                <Box
                                    key={index}
                                    sx={{ padding: '5px' }}
                                    onClick={() => selectCard(card)}
                                >
                                    <img
                                        style={{
                                            width: "75px",
                                            transition: '0.3s ease-in-out',
                                        }}
                                        src={card.image}
                                        alt={card.id}
                                    />
                                </Box>
                            ))
                        ) : (
                            searchResults.length === 0 && <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>No results</Box>
                        )}
                    </Box>

                    {/* Pagination */}
                    {hasMoreResults && (
                        <Box sx={{ display: 'flex', justifyContent: 'center', padding: '5px' }}>
                            <Box
                                onClick={loadNextPage}
                                sx={{
                                    backgroundColor: '#7C4FFF',
                                    color: '#121212',
                                    '&:hover': {
                                        backgroundColor: '#c5c6cb',
                                    },padding:'8px',borderRadius:'5px'
                                }}
                            >
                                Load More
                            </Box>
                        </Box>
                    )}

                    {/* Filter Dropdowns */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', padding: '10px', gap:'20px', width: 'calc(100% - 20px)' }}>
                        <Autocomplete
                            options={[...boosters, '']} // Adding a blank option
                            onChange={(e, value) => setSelectedBooster(value)}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Booster"
                                    variant="outlined"
                                    sx={{
                                        bgcolor: '#26252D',
                                        borderRadius: '10px',
                                        '& input': {
                                            color: '#fff', // Text color for input
                                        },
                                        '& label': {
                                            color: '#fff', // Label color
                                        },
                                        '& label.Mui-focused': {
                                            color: '#fff', // Focused label color
                                        },
                                        '& .MuiOutlinedInput-root': {
                                            '& fieldset': {
                                                borderColor: 'transparent',
                                            },
                                            '&:hover fieldset': {
                                                borderColor: 'transparent',
                                            },
                                            '&.Mui-focused fieldset': {
                                                borderColor: 'transparent',
                                            },
                                        },
                                    }}
                                />
                            )}
                            sx={{ width: '40%' }} // Set a fixed width for the Autocomplete
                        />
                        <Autocomplete
                            options={[...rarity, '']} // Adding a blank option
                            onChange={(e, value) => setSelectedRarity(value)}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Rarity"
                                    variant="outlined"
                                    sx={{
                                        bgcolor: '#26252D',
                                        borderRadius: '10px',
                                        '& input': {
                                            color: '#fff', // Text color for input
                                        },
                                        '& label': {
                                            color: '#fff', // Label color
                                        },
                                        '& label.Mui-focused': {
                                            color: '#fff', // Focused label color
                                        },
                                        '& .MuiOutlinedInput-root': {
                                            '& fieldset': {
                                                borderColor: 'transparent',
                                            },
                                            '&:hover fieldset': {
                                                borderColor: 'transparent',
                                            },
                                            '&.Mui-focused fieldset': {
                                                borderColor: 'transparent',
                                            },
                                        },
                                    }}
                                />
                            )}
                            sx={{ width: '25%' }} // Set a fixed width for the Autocomplete
                        />
                        <Autocomplete
                            options={[...colors, '']} // Adding a blank option
                            onChange={(e, value) => setSelectedColor(value)}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Color"
                                    variant="outlined"
                                    sx={{
                                        bgcolor: '#26252D',
                                        borderRadius: '10px',
                                        '& input': {
                                            color: '#fff', // Text color for input
                                        },
                                        '& label': {
                                            color: '#fff', // Label color
                                        },
                                        '& label.Mui-focused': {
                                            color: '#fff', // Focused label color
                                        },
                                        '& .MuiOutlinedInput-root': {
                                            '& fieldset': {
                                                borderColor: 'transparent',
                                            },
                                            '&:hover fieldset': {
                                                borderColor: 'transparent',
                                            },
                                            '&.Mui-focused fieldset': {
                                                borderColor: 'transparent',
                                            },
                                        },
                                    }}
                                />
                            )}
                            sx={{ width: '25%' }} // Set a fixed width for the Autocomplete
                        />
                    </Box>

                    {/* Search Field */}
                    <Box sx={{ padding: '10px', bgcolor: '#121212' }}>
                        <TextField
                            label="Search Card"
                            value={searchTerm}
                            onChange={handleSearchInputChange}
                            onKeyPress={handleKeyPress}
                            fullWidth
                            sx={{
                                backgroundColor: '#26252D',
                                borderRadius: '10px',
                                '& input': {
                                    color: '#f2f3f8',
                                },
                                '& label': {
                                    color: '#f2f3f8',
                                },
                                '& label.Mui-focused': {
                                    color: '#f2f3f8',
                                },
                                '& .MuiOutlinedInput-root': {
                                    '& fieldset': {
                                        borderColor: 'transparent',
                                    },
                                    '&:hover fieldset': {
                                        borderColor: 'transparent',
                                    },
                                    '&.Mui-focused fieldset': {
                                        borderColor: 'transparent',
                                    },
                                },
                            }}
                        />
                    </Box>
                    {/* Search Button */}
                    <Box sx={{ display: 'flex', justifyContent: 'center', padding: '10px' }}>
                        <Button
                            variant="contained"
                            onClick={() => {
                                setHasMoreResults(true);
                                setLastVisible(null);
                                searchCards(searchTerm); // Call the search function
                            }}
                            sx={{
                                backgroundColor: '#7C4FFF',
                                color: '#121212',
                                '&:hover': {
                                    backgroundColor: '#c5c6cb',
                                }
                            }}
                        >
                            Search
                        </Button>
                    </Box>
                </Box>
            </Modal>

        </>
    );
};

export default CardSearch;
