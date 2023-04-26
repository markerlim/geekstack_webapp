import React from 'react'
import { Box, List, ListItem, ListItemButton, ListItemIcon} from '@mui/material'
import { Home, Inventory, Stars, Style } from '@mui/icons-material'
import { Link } from 'react-router-dom'


const Sidebar = () => {
    return(
        <Box flex={2} p={0}  sx={{display:{sm:"none",md:"block"},height:"40vh"}}>
            <Box position="fixed" >
                <List >
                    <ListItem disablePadding>
                        <ListItemButton component={Link} href="#home" to="/">
                        <ListItemIcon >
                            <Home sx={{color:"#f2f3f8"}} alt="home" />
                        </ListItemIcon>
                        </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding>
                        <ListItemButton component={Link} href="#cards" to="/deckbuilder">
                        <ListItemIcon>
                            <Style sx={{color:"#f2f3f8"}} alt="deckbuilder" />
                        </ListItemIcon>
                        </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding>
                        <ListItemButton component={Link} href="#decks" to="/deckviewer">
                        <ListItemIcon>
                            <Inventory sx={{color:"#f2f3f8"}} alt="deck views"/>
                        </ListItemIcon>
                        </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding>
                        <ListItemButton component={Link} href="#disclaimer" to="/disclaimer">
                        <ListItemIcon>
                            <Stars sx={{color:"#f2f3f8"}} alt="disclaimer"/>
                        </ListItemIcon>
                        </ListItemButton>
                    </ListItem>
                </List>
            </Box>
        </Box>
    )
}

export default Sidebar