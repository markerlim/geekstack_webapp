import React, { useEffect, useState } from "react";
import { Box, Grid } from "@mui/material";
import { CircularProgress } from '@mui/material';
import { db } from "../../Firebase";
import DBZFWButtonList from "./DBZFWBoosterButton";
import { ResponsiveImage } from "../ResponsiveImage";
import { collection, getDocs, query, where } from "firebase/firestore";
import { DBZCardDrawerNF } from "./DBZCardDrawerFormatted";


const keysToSearch = ['cardNameLower', 'colorLower','cardTypeLower', 'cardNameTokens', 'boosterLower','featuresToken', 'cardId', 'basicpower'];

const DBZFWCardlist = ({ filters }) => {
    const [documents, setDocuments] = useState([]);
    const [openModal, setOpenModal] = useState(false);
    const [selectedCard, setSelectedCard] = useState(null);
    const [loading, setLoading] = useState(true);
    const [slowFetch, setSlowFetch] = useState(false);

    const getCurrentImage = (document) => {
        let currentImage = document.image;
        return currentImage;
    };
    const handleOpenModal = (document) => {
        const currentImage = getCurrentImage(document);
        setSelectedCard({
            ...document,
            currentImage: currentImage
        });
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setSelectedCard(null);
        setOpenModal(false);
    };

    useEffect(() => {
        const fetchDocuments = async () => {
            setLoading(true); // Start loading
            const timeoutId = setTimeout(() => {
                setSlowFetch(true);
            }, 1000); // 1 second timeout
            let finalDocSet = new Set();

            const arrayFields = ['cardNameTokens','featuresToken']; // specify which keys should be treated as arrays

            for (let filter of filters) {
                filter = filter.toLowerCase(); 
                let filterMatches = [];

                for (let key of keysToSearch) {
                    let docsRef;

                    if (arrayFields.includes(key)) {
                        docsRef = query(collection(db, "dragonballzfw"), where(key, "array-contains", filter));
                    } else {
                        docsRef = query(collection(db, "dragonballzfw"), where(key, "==", filter));
                    }

                    const querySnapshot = await getDocs(docsRef);

                    for (let doc of querySnapshot.docs) {
                        filterMatches.push(doc.id);
                    }
                }

                if (finalDocSet.size === 0) {
                    finalDocSet = new Set(filterMatches);
                } else {
                    finalDocSet = new Set([...finalDocSet].filter(x => filterMatches.includes(x)));
                }
            }

            const matchedDocs = [];
            for (let docId of finalDocSet) {
                const docData = (await getDocs(query(collection(db, "dragonballzfw"), where("cardId", "==", docId)))).docs[0].data();
                matchedDocs.push(docData);
            }

            setDocuments(matchedDocs);
            // Logging the number of reads
            console.log(`Number of reads: ${matchedDocs.length}`);
            clearTimeout(timeoutId); // Clear the timeout if fetch completes in less than 1 second
            setLoading(false); // Stop loading after fetching the data
        };

        fetchDocuments();
    }, [filters]);

    return (
        <div>
            {filters.length === 0 && (
                <Box sx={{ display: "flex", flexDirection: "row", flexWrap: "wrap", gap: "20px", justifyContent: "center" }}>
                    <DBZFWButtonList />
                </Box>
            )}
            <div className="hide-scrollbar">
                {loading ? (
                    <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", marginTop:'-30vh', height: "86vh" }}>
                        <CircularProgress sx={{ color: "#74CFFF" }} />
                        {slowFetch && <Box mt={2}>This field has a large amount of data. Please wait a moment.</Box>}
                    </Box>
                ) : (
                    <Grid container spacing={2} justifyContent="center">
                        {documents.map((document) => (
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
                            <DBZCardDrawerNF
                                open={openModal}
                                onClose={handleCloseModal}
                                selectedCard={selectedCard}
                            />
                        )}
                    </Grid>
                )}
            </div>
        </div >
    );
}

export default DBZFWCardlist;
