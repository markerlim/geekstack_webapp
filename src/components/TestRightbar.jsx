import React, { useEffect, useState } from "react";
import { db } from "../Firebase";
import { collection, getDocs } from "firebase/firestore";
import { Box, Button, Dialog, DialogActions, Grid, List, ListItem, ListItemText, Typography } from "@mui/material";
import { AddCircle, RemoveCircle } from "@mui/icons-material";
import { setToLocalStorage, getFromLocalStorage } from "./LocalStorage/localStorageHelper";

const TestRightbar = () => {
    const [documents, setDocuments] = useState([]);
    const [openModal, setOpenModal] = useState(false);
    const [countArray, setCountArray] = useState(() => {
        const storedCountArray = getFromLocalStorage("countArray");
        return storedCountArray ? storedCountArray : new Array(documents.length).fill(0);
    });

    useEffect(() => {
        const storedCountArray = getFromLocalStorage("countArray");
        if (storedCountArray) {
            setCountArray(storedCountArray);
        }
    }, []);
    
    function handleContextMenu(event) {
        event.preventDefault();
        setOpenModal(true);
    }

    const handleCloseModal = () => {
        setOpenModal(false);
    };
    const MAX_COUNT = 4;

    //adding of card
    const increase = (index) => {
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
    const decrease = (index) => {
        setCountArray(prevCountArray => {
            const newArray = [...prevCountArray];
            if (newArray[index] > 0) {
                newArray[index] = newArray[index] ? newArray[index] - 1 : 0;
            }
            setToLocalStorage("countArray", newArray);
            return newArray;
        });
    };
    useEffect(() => {
        const fetchDocuments = async () => {
            const querySnapshot = await getDocs(collection(db, "unionarenatcg"));
            const documentsArray = [];
            querySnapshot.forEach((doc) => {
                documentsArray.push(doc.data());
            });
            setDocuments(documentsArray);

            //Set the fetched data in local storage
            setToLocalStorage("documents", documentsArray);

            //Update countArray with new length
            setCountArray(Array(documentsArray.length).fill(0));
        };
        

    }, []);

    return (
        <Box flex={8} p={2} sx={{ display: { xs: "none", sm: "block" }, height: "100vh" }}>
            <Box position="fixed" bgcolor="purple" sx={{display:{height:"100vh"}}}> 
                <Typography variant='h6' marginTop={2} marginLeft={1} marginBottom={3}>Deckbuilder</Typography>
                <Grid container spacing={2} justifyContent="center">
                    {documents.map((document, index) => (
                        <Grid item key={document.cardId}>
                            <Box onContextMenu={handleContextMenu} >
                                <img loading="lazy" src={document.image}
                                    draggable="false" alt="test" style={{ width: "200px", height: "281.235px", borderRadius: "5%", border: "2px solid black", cursor: "pointer" }}
                                />
                                <Box display={"flex"} flexDirection={"row"} gap={3} alignItems={"center"} justifyContent={"center"}>
                                    <div component={Button} onClick={() => decrease(index)}><RemoveCircle /></div>
                                    <span>{countArray[index]}</span>
                                    <div component={Button} onClick={() => increase(index)}><AddCircle /></div>
                                </Box>
                            </Box>
                        </Grid>
                    ))}
                    {documents.map((document, index) => (
                        <Dialog open={openModal} onClose={handleCloseModal}>
                            <Box width={500} height={600} bgcolor="primary" p={3} borderRadius={5} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                                <Box><img loading="lazy" src={document.image}
                                    draggable="false" alt="test" style={{ width: "200px", height: "281.235px", borderRadius: "5%", border: "2px solid black" }}
                                />
                                </Box>
                                <Box>
                                    <List>
                                        <ListItem disablePadding>
                                            <ListItemText primary="Cardname:" secondary={document.cardName} style={{ display: 'flex', flexDirection: "row", gap: 3, alignItems: 'center' }} />
                                        </ListItem>
                                        <ListItem disablePadding>
                                            <ListItemText primary="Card No.:" secondary={document.cardId} style={{ display: 'flex', flexDirection: "row", gap: 3, alignItems: 'center' }} />
                                        </ListItem>
                                        <ListItem disablePadding>
                                            <ListItemText primary="Color:" secondary={document.color} style={{ display: 'flex', flexDirection: "row", gap: 3, alignItems: 'center' }} />
                                        </ListItem>
                                        <ListItem disablePadding>
                                            <ListItemText primary="Effect:" secondary={document.effect} style={{ display: 'flex', flexDirection: "row", gap: 3, alignItems: 'center' }} />
                                        </ListItem>
                                        <ListItem disablePadding>
                                            <ListItemText primary="Trigger:" secondary={document.trigger} style={{ display: 'flex', flexDirection: "row", gap: 3, alignItems: 'center' }} />
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
            </Box>
        </Box>
    );
}

export default TestRightbar