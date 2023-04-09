import { Box, Button, Dialog, DialogActions, Fab, Grid, List, ListItem, ListItemText, Tooltip, Typography } from '@mui/material';
import { AddCircle, RemoveCircle, Save } from '@mui/icons-material';
import React, { useEffect, useState } from 'react';
import { getLocalStorageItem,setToLocalStorage} from './LocalStorage/localStorageHelper';

const Rightbar = () => {

    const [documents, setDocuments] = useState([]);
    const [openModal, setOpenModal] = useState(false);
    const [countArray, setCountArray] = useState([]);

    useEffect(() => {
        const storedDocuments = getLocalStorageItem('documents');
        if (storedDocuments) {
            setDocuments(storedDocuments);
            const storedCountArray = getLocalStorageItem('countArray');
            if (storedCountArray) {
                setCountArray(storedCountArray);
            } else {
                setCountArray(new Array(storedDocuments.length).fill(0));
            }
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
            setToLocalStorage('countArray', newArray);
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
            setToLocalStorage('countArray', newArray);
            return newArray;
        });
    };

    return (
        <>
            <Tooltip title="Save Deck" sx={{ position: "fixed", bottom: 20, right: { xs: "calc(50% - 25px)", md: 30 } }}>
                <Fab color="primary" aria-label="add">
                    <Save />
                </Fab>
            </Tooltip>
            <Box bgcolor="purple" flex={8} p={2} sx={{ display: { xs: "none", sm: "block" }, height: "100vh" }}>
                <Box position="fixed">
                    <Typography variant='h6'>Deckbuilder</Typography>
                    <Grid container spacing={2} justifyContent="center">
                        {documents.map((document, index) => {
                                    <Grid item key={document.cardId}>
                                        <Box onContextMenu={handleContextMenu}>
                                            <img
                                                loading="lazy"
                                                src={document.image}
                                                draggable="false"
                                                alt="test"
                                                style={{
                                                    width: "200px",
                                                    height: "281.235px",
                                                    borderRadius: "5%",
                                                    border: "2px solid black",
                                                    cursor: "pointer"
                                                }}
                                            />
                                            <Box
                                                display={"flex"}
                                                flexDirection={"row"}
                                                gap={3}
                                                alignItems={"center"}
                                                justifyContent={"center"}
                                            >
                                                <div component={Button} onClick={() => decrease(index)}>
                                                    <RemoveCircle />
                                                </div>
                                                <span>{countArray[index]}</span>
                                                <div component={Button} onClick={() => increase(index)}>
                                                    <AddCircle />
                                                </div>
                                            </Box>
                                        </Box>
                                    </Grid>
                                })};
                    </Grid>
                    {documents.map((document) => (
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
                </Box>
            </Box >
        </>
    )
}

export default Rightbar