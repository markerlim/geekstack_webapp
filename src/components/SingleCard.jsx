import {Box, List, ListItem, ListItemText, Modal, styled } from '@mui/material'
import React, { useState } from "react";

const StyledModal = styled(Modal)({
    display:"flex",
    alignItems:"center",
    justifyContent:"center"
})

const SingleCard = () => {
    const [open, setOpen] = useState(false)
    return (
        <>
        <Box onClick={e=>setOpen(true)}>
            <img loading="lazy" src="/Images/UAPR_CGH-1-035.png" 
            draggable="false" alt="test" style={{width: "200px", height: "281.235px", borderRadius: "5%", border: "2px solid black",cursor:"pointer"}}
            />
        </Box>
        <StyledModal
                open={open}
                onClose={(e)=>setOpen(false)}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box width={500} height={600} bgcolor="white" p={3} borderRadius={5} sx={{display:'flex',flexDirection:'column',gap:3}}>
                    <Box><img loading="lazy" src="/Images/UAPR_CGH-1-035.png" 
                    draggable="false" alt="test" style={{width: "200px", height: "281.235px", borderRadius: "5%", border: "2px solid black"}}
                    />
                    </Box>
                    <Box>
                        <List>
                            <ListItem disablePadding>
                                <ListItemText primary="Cardname:" secondary="Suzaku" style={{display:'flex',flexDirection:"row",gap:3,alignItems:'center'}}/>
                            </ListItem>
                            <ListItem disablePadding>
                                <ListItemText primary="Card No.:" secondary="CGH-1-035" style={{display:'flex',flexDirection:"row",gap:3,alignItems:'center'}}/>
                            </ListItem>
                            <ListItem disablePadding>
                                <ListItemText primary="Color:" secondary="Green" style={{display:'flex',flexDirection:"row",gap:3,alignItems:'center'}}/>
                            </ListItem>
                            <ListItem disablePadding>
                                <ListItemText primary="Effect:" secondary="<img src=> Draw 1" style={{display:'flex',flexDirection:"row",gap:3,alignItems:'center'}}/>
                            </ListItem>
                            <ListItem disablePadding>
                                <ListItemText primary="Trigger:" secondary="<img src=> Play a card from your hand that has 2 or less energy and 1 or less action point" style={{display:'flex',flexDirection:"row",gap:3,alignItems:'center'}}/>
                            </ListItem>     
                        </List>
                    </Box>
                </Box>
            </StyledModal>
        </>
    )
}

export default SingleCard