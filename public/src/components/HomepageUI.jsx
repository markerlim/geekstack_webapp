import React, { useEffect, useState } from "react";
import { db } from "../Firebase";
import { collection, getDocs } from "firebase/firestore";
import { Box, Grid, ButtonBase, Button } from "@mui/material";
import { setToLocalStorage, getFromLocalStorage } from "./LocalStorage/localStorageHelper";
import { CardModal } from "./CardModal";
import { ResponsiveImage } from "./ResponsiveImage";
import { Refresh, ResetTv } from "@mui/icons-material";
import searchMatch from "./searchUtils";
import { Link } from "react-router-dom";

const HomepageUI = (props) => {
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
                        <Link to={{ pathname: `cgh` }} style={{ textDecoration: "none" }}>
                            <ButtonBase sx={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                bgcolor: "#121212",
                                padding: 2,
                                borderRadius: 5,
                                boxShadow: 5,
                                overflow: "hidden",
                                width: { xs: 125, sm: 200 },
                                height: { xs: 188, sm: 300 }
                            }}>
                                <img
                                    src="/images/deckimage1.jpg"
                                    alt="code geass"
                                    style={{ width: "140%", height: "auto" }}
                                />
                            </ButtonBase>
                        </Link>
                        <Link to={{ pathname: `jjk` }} style={{ textDecoration: "none" }}>
                            <ButtonBase sx={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                bgcolor: "#121212",
                                padding: 2,
                                borderRadius: 5,
                                boxShadow: 5,
                                overflow: "hidden",
                                width: { xs: 125, sm: 200 },
                                height: { xs: 188, sm: 300 }
                            }}>
                                <img
                                    src="/images/deckimage2.jpg"
                                    alt="jujutsu no kaisen"
                                    style={{ width: "140%", height: "auto" }}
                                />
                            </ButtonBase>
                        </Link>
                        <Link to={{ pathname: `hxh` }} style={{ textDecoration: "none" }}>
                            <ButtonBase sx={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                bgcolor: "#121212",
                                padding: 2,
                                borderRadius: 5,
                                boxShadow: 5,
                                overflow: "hidden",
                                width: { xs: 125, sm: 200 },
                                height: { xs: 188, sm: 300 }
                            }}>
                                <img
                                    src="/images/deckimage3.jpg"
                                    alt="hunter x hunter"
                                    style={{ width: "140%", height: "auto" }}
                                />
                            </ButtonBase>
                        </Link>
                        <Link to={{ pathname: `ims` }} style={{ textDecoration: "none" }}>
                            <ButtonBase sx={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                bgcolor: "#121212",
                                padding: 2,
                                borderRadius: 5,
                                boxShadow: 5,
                                overflow: "hidden",
                                width: { xs: 125, sm: 200 },
                                height: { xs: 188, sm: 300 }
                            }}>
                                <img
                                    src="/images/deckimage4.jpg"
                                    alt="idolmaster shiny colors"
                                    style={{ width: "140%", height: "auto" }}
                                />
                            </ButtonBase>
                        </Link>
                        <Link to={{ pathname: `kmy` }} style={{ textDecoration: "none" }}>
                            <ButtonBase sx={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                bgcolor: "#121212",
                                padding: 2,
                                borderRadius: 5,
                                boxShadow: 5,
                                overflow: "hidden",
                                width: { xs: 125, sm: 200 },
                                height: { xs: 188, sm: 300 }
                            }}>
                                <img
                                    src="/images/deckimage5.jpg"
                                    alt="demon slayer"
                                    style={{ width: "140%", height: "auto" }}
                                />
                            </ButtonBase>
                        </Link>
                        <Link to={{ pathname: `toa` }} style={{ textDecoration: "none" }}>
                            <ButtonBase sx={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                bgcolor: "#121212",
                                padding: 2,
                                borderRadius: 5,
                                boxShadow: 5,
                                overflow: "hidden",
                                width: { xs: 125, sm: 200 },
                                height: { xs: 188, sm: 300 }
                            }}>
                                <img
                                    src="/images/deckimage6.jpg"
                                    alt="tales of arise"
                                    style={{ width: "140%", height: "auto" }}
                                />
                            </ButtonBase>
                        </Link>
                        <Link to={{ pathname: `tsk` }} style={{ textDecoration: "none" }}>
                            <ButtonBase sx={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                bgcolor: "#121212",
                                padding: 2,
                                borderRadius: 5,
                                boxShadow: 5,
                                overflow: "hidden",
                                width: { xs: 125, sm: 200 },
                                height: { xs: 188, sm: 300 }
                            }}>
                                <img
                                    src="/images/deckimage7.jpg"
                                    alt="that time I reincarnated as a slime"
                                    style={{ width: "140%", height: "auto" }}
                                />
                            </ButtonBase>
                        </Link>
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
                        <span style={{ fontSize: 12}}>Back</span>
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