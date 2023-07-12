import React, { useEffect, useState } from "react";
import { db } from "../Firebase";
import { collection, getDocs } from "firebase/firestore";
import { Box, Grid, ButtonBase, Button, IconButton } from "@mui/material";
import { CardModal } from "./CardModal";
import { ResponsiveImage } from "./ResponsiveImage";
import searchMatch from "./searchUtils";
import { Link } from "react-router-dom";
import { Favorite } from "@mui/icons-material";
import ButtonList from "./UnionArenaBoosterButton";

const HomepageUI = (props) => {
    const [documents, setDocuments] = useState([]);
    const [openModal, setOpenModal] = useState(false);
    const [selectedCard, setSelectedCard] = useState(null);
    const [isFavorited, setIsFavorited] = useState(false);

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
        props.setSearchQuery("");
    };

    const handleFavorite = (event) => {
        setIsFavorited(!isFavorited);
        event.stopPropagation();
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

    const filteredDocuments = currentSearchQuery ? documents.filter((document) => {
        const boosterFilterMatch = !boosterFilter || document.booster === boosterFilter;
        const colorFilterMatch = !colorFilter || document.color === colorFilter;
        const animeFilterMatch = !animeFilter || document.anime === animeFilter;
        const searchFilterMatch = searchMatch(document, currentSearchQuery);

        return boosterFilterMatch && colorFilterMatch && animeFilterMatch && searchFilterMatch;
    }) : [];


    return (
        <div>
            {props.searchQuery === "" && (
                <div style={{ height: "86vh", overflowY: "auto" }} className="hide-scrollbar">
                    <Box sx={{ display: "flex", flexDirection: "row", flexWrap: "wrap", gap: "20px", justifyContent: "center" }}>
                        <ButtonList/>
                    </Box>
                    <div style={{ height: "200px" }} />
                </div>
            )}
            {props.searchQuery !== "" && (
                <div style={{ textAlign: "center" }}>
                    <Button
                        sx={{
                            minWidth: 0, // Set the minimum width to 0 to allow the button to shrink
                            width: 80, // Change this value to adjust the width
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
                        <span style={{ fontSize: 12 }}>Back</span>
                    </Button>
                </div>
            )}
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
                        />
                    )}
                </Grid>
                <div style={{ height: '200px' }} />
            </div>
        </div >
    );
}

export default HomepageUI