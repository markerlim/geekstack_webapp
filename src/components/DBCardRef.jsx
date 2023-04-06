import React, { useEffect, useState } from "react";
import {db} from "../Firebase";
import {collection, getDocs} from "firebase/firestore";
import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid, List, ListItem, ListItemText, Typography } from "@mui/material";
import { AddCircle, RemoveCircle } from "@mui/icons-material";



const DBCardRef = () => {
    const [documents, setDocuments] = useState([]);
    const [openModal, setOpenModal] = useState(false);
    const [counter,setCounter] = useState(0);

    function handleContextMenu(event){
        event.preventDefault();
        setOpenModal(true);
    }

    const handleCloseModal = () => {
        setOpenModal(false);
    };
//adding of card
    const increase = () =>{
        setCounter(count => count + 1)
    };
//taking away of card
    const decrease = () =>{
        setCounter(count => count - 1);
    };

    useEffect(()=>{
        const fetchDocuments = async() =>{
            const querySnapshot = await getDocs(collection(db,"unionarenatcg"));
            const documentsArray = [];
            querySnapshot.forEach((doc)=>{
                documentsArray.push(doc.data());
            });
            setDocuments(documentsArray);
        };
        fetchDocuments();
    },[db]);

    return (
        <Grid container spacing={2}  justifyContent="center">
            {documents.map((document) => (
            <Grid item key={document.cardId}>
                <Box onContextMenu={handleContextMenu} >
                    <img loading="lazy" src={document.image} 
                    draggable="false" alt="test" style={{width: "200px", height: "281.235px", borderRadius: "5%", border: "2px solid black",cursor:"pointer"}}
                    />
                    <Box display={"flex"} flexDirection={"row"} gap={3} alignItems={"center"} justifyContent={"center"}>
                        <div component={Button} onClick={decrease}><RemoveCircle/></div>
                        <span>{counter}</span>
                        <div component={Button} onClick={increase}><AddCircle/></div>
                    </Box>
                </Box>
            </Grid>
            ))}
            {documents.map((document) => (
            <Dialog open={openModal} onClose={handleCloseModal}>
            <Box width={500} height={600} bgcolor="primary" p={3} borderRadius={5} sx={{display:'flex',flexDirection:'column',gap:3}}>
                    <Box><img loading="lazy" src={document.image}  
                    draggable="false" alt="test" style={{width: "200px", height: "281.235px", borderRadius: "5%", border: "2px solid black"}}
                    />
                    </Box>
                    <Box>
                        <List>
                            <ListItem disablePadding>
                                <ListItemText primary="Cardname:" secondary={document.cardName}  style={{display:'flex',flexDirection:"row",gap:3,alignItems:'center'}}/>
                            </ListItem>
                            <ListItem disablePadding>
                                <ListItemText primary="Card No.:" secondary={document.cardId}  style={{display:'flex',flexDirection:"row",gap:3,alignItems:'center'}}/>
                            </ListItem>
                            <ListItem disablePadding>
                                <ListItemText primary="Color:" secondary={document.color}  style={{display:'flex',flexDirection:"row",gap:3,alignItems:'center'}}/>
                            </ListItem>
                            <ListItem disablePadding>
                                <ListItemText primary="Effect:" secondary={document.effect}  style={{display:'flex',flexDirection:"row",gap:3,alignItems:'center'}}/>
                            </ListItem>
                            <ListItem disablePadding>
                                <ListItemText primary="Trigger:" secondary={document.trigger}  style={{display:'flex',flexDirection:"row",gap:3,alignItems:'center'}}/>
                            </ListItem>     
                        </List>
                    </Box>
                </Box>
            <DialogActions>
                <Button onClick={handleCloseModal}>Close</Button>
            </DialogActions>
            </Dialog>
            ))}
      </Grid>
    );
}

export default DBCardRef