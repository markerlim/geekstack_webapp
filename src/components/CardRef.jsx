import React, { useEffect, useState } from "react";
import {db} from "../Firebase";
import {collection, getDocs} from "firebase/firestore";
import { Box, Grid, useMediaQuery} from "@mui/material";
import { setToLocalStorage, getFromLocalStorage } from "./LocalStorage/localStorageHelper";
import {CardModal} from "./CardModal"

const CardRef = () => {
    const [documents, setDocuments] = useState([]);
    const [openModal, setOpenModal] = useState(false);
    const [selectedCard, setSelectedCard] = useState(null);

    const handleOpenModal = (document) => {
        setSelectedCard(document);
        setOpenModal(true);
    }

    const handleCloseModal = () => {
        setSelectedCard(null);
        setOpenModal(false);
    };

    useEffect(()=>{
        const fetchDocuments = async() =>{
            const querySnapshot = await getDocs(collection(db,"unionarenatcg"));
            const documentsArray = [];
            querySnapshot.forEach((doc)=>{
                documentsArray.push(doc.data());
            });
            setDocuments(documentsArray);

            //Set the fetched data in local storage
            setToLocalStorage("documents", documentsArray); 
        };

        //Check if the data exists in local storage
        const localDocuments = getFromLocalStorage("documents");
        if(localDocuments){
            setDocuments(localDocuments);
        }else{
            fetchDocuments();
        }
    },[]);

    return (
        <Grid container spacing={2}  justifyContent="center">
            {documents.map((document) => (
            <Grid item key={document.cardId}>
                <Box onClick={()=> handleOpenModal(document)} >
                    <img loading="lazy" src={document.image} 
                    draggable="false" alt="test" style={{
                        width:"200px",
                        height:"281.235px",
                        gap:1,
                        borderRadius: "5%",
                        border: "2px solid black",cursor:"pointer"}}
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
    );
}

export default CardRef