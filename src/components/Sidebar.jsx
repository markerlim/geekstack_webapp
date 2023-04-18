import React from 'react'
import { Box, List, ListItem, ListItemButton, ListItemIcon} from '@mui/material'
import { Group, Home, Inventory, Settings, Style } from '@mui/icons-material'
import { Link } from 'react-router-dom'


const Sidebar = () => {
    return(
        <Box flex={2} p={0}  sx={{display:{xs:"none",sm:"block"},height:"100vh"}}>
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
                        <ListItemButton component={Link} href="#community" to="/community">
                        <ListItemIcon>
                            <Group sx={{color:"#f2f3f8"}} alt="community"/>
                        </ListItemIcon>
                        </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding>
                        <ListItemButton component="a" href="#settings">
                        <ListItemIcon>
                            <Settings sx={{color:"#f2f3f8"}} alt="settings" />
                        </ListItemIcon>
                        </ListItemButton>
                    </ListItem>
                </List>
            </Box>
        </Box>
    )
}

export default Sidebar