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
                <Box width={500} height={400} bgcolor="white" p={3} borderRadius={5} sx={{display:'flex',flexDirection:'row',gap:5}}>
                    <Box><img loading="lazy" src="/Images/UAPR_CGH-1-035.png" 
                    draggable="false" alt="test" style={{width: "200px", height: "281.235px", borderRadius: "5%", border: "2px solid black"}}
                    /></Box>
                    <Box>
                        <List>
                            <ListItem disablePadding>
                                <ListItemText primary="Cardname"/>
                            </ListItem>
                            <ListItem disablePadding>
                                <ListItemText primary="Card No."/>
                            </ListItem>
                            <ListItem disablePadding>
                                <ListItemText primary="Color"/>
                            </ListItem>
                            <ListItem disablePadding>
                                <ListItemText primary="Effect"/>
                            </ListItem>
                            <ListItem disablePadding>
                                <ListItemText primary="Trigger"/>
                            </ListItem>
                        </List>
                    </Box>
                </Box>
            </StyledModal>
        </>
    )
}

export default SingleCard