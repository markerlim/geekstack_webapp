import React, { useEffect, useState } from "react";
import {db} from "../Firebase";
import {collection, getDocs} from "firebase/firestore";
import { Box,Button,Grid } from "@mui/material";
import { setToLocalStorage, getFromLocalStorage } from "./LocalStorage/localStorageHelper";
import { CardModal } from "./CardModal";
import { AddCircle, RemoveCircle } from "@mui/icons-material";

const DBCardRef = () => {
    const [documents, setDocuments] = useState([]);
    const [openModal, setOpenModal] = useState(false);
    const [selectedCard, setSelectedCard] = useState(null);
    const [countArray, setCountArray] = useState(getFromLocalStorage("countArray") || []);

    const handleOpenModal = (document) => {
        setSelectedCard(document);
        setOpenModal(true);
    }

    const handleCloseModal = () => {
        setSelectedCard(null);
        setOpenModal(false);
    };
    const MAX_COUNT = 4;
    //adding of card
    const increase = (index) =>{
        setCountArray(prevCountArray => {
            const newArray = [...prevCountArray];
            if (newArray[index] < MAX_COUNT) {
            newArray[index] = newArray[index] ? newArray[index] + 1 : 1;
            }
            setToLocalStorage("countArray", newArray);
            return newArray;
        });
    };
    //taking away of card
    const decrease = (index) =>{
        setCountArray(prevCountArray => {
            const newArray = [...prevCountArray];
            if (newArray[index] > 0) {
            newArray[index] = newArray[index] ? newArray[index] - 1 : 0;
            }
            setToLocalStorage("countArray", newArray);
            return newArray;
        });
    };


    useEffect(()=>{
        const fetchDocuments = async() =>{
            const querySnapshot = await getDocs(collection(db,"unionarenatcg"));
            const documentArray = [];
            querySnapshot.forEach((doc)=>{
                documentArray.push(doc.data());
            });
            setDocuments(documentArray);
            setCountArray(new Array(documentArray.length).fill(0));

            //Set the fetched data in local storage
            setToLocalStorage("documents", documentArray); 
        };

        //Check if the data exists in local storage
        const localDocuments = getFromLocalStorage("documents");
        if(localDocuments){
            setDocuments(localDocuments);
            setCountArray(new Array(localDocuments.length).fill(0));
        }else{
            fetchDocuments();
        }
    },[]);

    // Define index outside of the map function
    return (
        <Grid container spacing={2}  justifyContent="center">
            {documents.map((document,index) => (
            <Grid item key={document.cardId}>
                <Box onContextMenu={(event)=> {event.preventDefault(); handleOpenModal(document);}} >
                    <img loading="lazy" src={document.image} 
                    draggable="false" alt="test" style={{width: "200px", height: "281.235px", borderRadius: "5%", border: "2px solid black",cursor:"pointer"}}
                    />
                    <Box display={"flex"} flexDirection={"row"} gap={3} alignItems={"center"} justifyContent={"center"}>
                        <div component={Button} onClick={() => decrease(index)}><RemoveCircle/></div>
                        <span>{countArray[index]}</span>
                        <div component={Button} onClick={() => increase(index)}><AddCircle/></div>
                    </Box>
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

export default DBCardRef