import React, { useEffect, useState } from "react";
import { db } from "../Firebase";
import { collection, getDocs } from "firebase/firestore";
import { Box, Grid, Select, MenuItem, FormControl, InputLabel, Button } from "@mui/material";
import { setToLocalStorage, getFromLocalStorage } from "./LocalStorage/localStorageHelper";
import { CardModal } from "./CardModal";
import { ResponsiveImage } from "./ResponsiveImage";
import { Refresh } from "@mui/icons-material";

const CardRef = () => {
    const [documents, setDocuments] = useState([]);
    const [openModal, setOpenModal] = useState(false);
    const [selectedCard, setSelectedCard] = useState(null);

    const [boosterFilter, setBoosterFilter] = useState("");
    const [colorFilter, setColorFilter] = useState("");
    const [animeFilter, setAnimeFilter] = useState("");

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
        setAnimeFilter("");
    };

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

    const filteredDocuments = documents.filter((document) => {
        const boosterFilterMatch = !boosterFilter || document.booster === boosterFilter;
        const colorFilterMatch = !colorFilter || document.color === colorFilter;
        const animeFilterMatch = !animeFilter || document.anime === animeFilter;

        return boosterFilterMatch && colorFilterMatch && animeFilterMatch;
    });

    return (
        <div>
            <Box sx={{ display: "flex", justifyContent: "center", marginBottom: 2 }}>
                <FormControl sx={{
                    width: 80, height: 40, marginRight: 2, backgroundColor: "#f2f3f8", borderRadius: "5px",
                    '@media (max-width: 599px)': { // This applies the styles for xs breakpoint (0px - 599px)
                        width: 60, height: 30 // Change this value to adjust the width at the xs breakpoint
                    },
                }}>
                    <Select disableUnderline
                        sx={{
                            width: 80, height: 40, paddingLeft: 1, paddingRight: 1,
                            '@media (max-width: 599px)': { // This applies the styles for xs breakpoint (0px - 599px)
                                width: 60, height: 30 // Change this value to adjust the width at the xs breakpoint
                            },
                            '& .MuiSelect-icon': {
                                display: 'none',
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
                        <MenuItem value="UA01ST">UA01ST</MenuItem>
                        <MenuItem value="UA02ST">UA02ST</MenuItem>
                        <MenuItem value="UA03ST">UA03ST</MenuItem>
                    </Select>
                </FormControl>
                <FormControl sx={{
                    width: 80, height: 40, marginRight: 2, backgroundColor: "#f2f3f8", borderRadius: "5px",
                    '@media (max-width: 599px)': { // This applies the styles for xs breakpoint (0px - 599px)
                        width: 60, height: 30 // Change this value to adjust the width at the xs breakpoint
                    },
                }}>
                    <Select disableUnderline
                        sx={{
                            width: 80, height: 40, fontSize: 15, paddingLeft:1,paddingRight:1,
                            '@media (max-width: 599px)': { // This applies the styles for xs breakpoint (0px - 599px)
                                width: 60, height: 30 // Change this value to adjust the width at the xs breakpoint
                            },
                            '& .MuiSelect-icon': {
                                display: 'none',
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
                <FormControl sx={{
                    width: 80, height: 40, marginRight: 2, backgroundColor: "#f2f3f8", borderRadius: "5px"
                    , '@media (max-width: 599px)': { // This applies the styles for xs breakpoint (0px - 599px)
                        width: 60, height: 30 // Change this value to adjust the width at the xs breakpoint
                    },
                }}>
                    <Select disableUnderline
                        sx={{
                            width: 80, height: 40, fontSize: 15, paddingLeft:1,paddingRight:1,
                            '@media (max-width: 599px)': { // This applies the styles for xs breakpoint (0px - 599px)
                                width: 60, height: 30 // Change this value to adjust the width at the xs breakpoint
                            },
                            '& .MuiSelect-icon': {
                                display: 'none',
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
                    </Select>
                </FormControl>
                <Button
                    sx={{
                        minWidth: 0, // Set the minimum width to 0 to allow the button to shrink
                        width: 30, // Change this value to adjust the width
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
                {filteredDocuments.map((document) => (
                    <Grid item key={document.cardId}>
                        <Box onClick={() => handleOpenModal(document)}>
                            <ResponsiveImage
                                loading="lazy"
                                src={document.image}
                                draggable="false"
                                alt="test"
                            />
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
};

export default CardRef;

