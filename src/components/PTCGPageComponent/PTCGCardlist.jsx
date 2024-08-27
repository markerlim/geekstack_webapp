import React, { useEffect, useState } from "react";
import { Box, Grid } from "@mui/material";
import { CircularProgress } from '@mui/material';
import { db } from "../../Firebase";
import { ResponsiveImage } from "../ResponsiveImage";
import { collection, doc, getDoc, getDocs, query, where } from "firebase/firestore";
import PTCGButtonList from "./PTCGBoosterButton";
import { PTCGCardDrawerNF } from "./PTCGCardDrawerFormatted";


const keysToSearch = ['cardNameLower', 'colorLower', 'cardtypeLower', 'cardNameTokens', 'boosterLower', 'featuresToken', 'cardId'];

const PTCGCardlist = ({ filters }) => {
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
        let isMounted = true; // Flag to track component mounting state

        const fetchDocuments = async () => {
            setLoading(true);
            setSlowFetch(false); // Reset slow fetch indicator
            if (filters.length === 0) {
                // If filters are empty, immediately clear the documents
                if (isMounted) {
                    setDocuments([]);
                    setLoading(false);
                }
                return;
            }
            // Combine filters into a single lowercase string for efficiency
            const combinedFilter = filters.join(" ").toLowerCase();

            let finalDocSet = new Set();
            const arrayFields = ['cardNameTokens', 'featuresToken'];

            try {
                for (let key of keysToSearch) {
                    let docsRef;

                    if (arrayFields.includes(key)) {
                        docsRef = query(collection(db, "dragonballzfw"), where(key, "array-contains-any", filters));
                    } else {
                        docsRef = query(collection(db, "dragonballzfw"), where(key, ">=", combinedFilter), where(key, "<", combinedFilter + "zzzz"));
                    }

                    const querySnapshot = await getDocs(docsRef);

                    for (let doc of querySnapshot.docs) {
                        const docData = doc.data();
                        const lowerCaseData = JSON.stringify(docData).toLowerCase();

                        if (lowerCaseData.includes(combinedFilter)) {
                            finalDocSet.add(doc.id);
                        }
                    }
                }

                const matchedDocs = await Promise.all(
                    Array.from(finalDocSet).map(docId =>
                        getDoc(doc(db, "dragonballzfw", docId)).then(doc => doc.data())
                    )
                );

                if (isMounted) { // Update state only if the component is still mounted
                    setDocuments(matchedDocs);
                    console.log(`Number of reads: ${matchedDocs.length}`);
                    setLoading(false);
                }

                // Check if fetch took longer than 1 second and set slowFetch accordingly
                const elapsedTime = performance.now() - startTime;
                if (elapsedTime > 1000 && isMounted) {
                    setSlowFetch(true);
                }
            } catch (error) {
                console.error("Error fetching documents:", error);
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        const startTime = performance.now();
        fetchDocuments();

        return () => {
            isMounted = false; // Cleanup: set flag to false when component unmounts
        };
    }, [filters]);


    return (
        <div>
            {filters.length === 0 && (
                <Box sx={{ display: "flex", flexDirection: "row", flexWrap: "wrap", gap: "20px", justifyContent: "center" }}>
                    <PTCGButtonList />
                </Box>
            )}
            <div className="hide-scrollbar">
                {loading ? (
                    <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", marginTop: '-30vh', height: "86vh" }}>
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
                            <PTCGCardDrawerNF
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

export default PTCGCardlist;
