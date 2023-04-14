import React from 'react'
import { Box, List, ListItem, ListItemButton, ListItemIcon, Switch} from '@mui/material'
import { AccountBox, Group, Home, Inventory, ModeNight, Settings, Style } from '@mui/icons-material'
import { Link } from 'react-router-dom'


const Sidebar = ({mode,setMode}) => {
    return(
        <Box flex={2} p={0} sx={{display:{xs:"none",sm:"block"},height:"100vh"}}>
            <Box position="fixed" >
                <List>
                    <ListItem disablePadding>
                        <ListItemButton component={Link} href="#home" to="/">
                        <ListItemIcon>
                            <Home alt="home" />
                        </ListItemIcon>
                        </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding>
                        <ListItemButton component="a" href="#profile">
                        <ListItemIcon>
                            <AccountBox />
                        </ListItemIcon>
                        </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding>
                        <ListItemButton component={Link} href="#cards" to="/deckbuilder">
                        <ListItemIcon>
                            <Style />
                        </ListItemIcon>
                        </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding>
                        <ListItemButton component={Link} href="#decks" to="/deckviewer">
                        <ListItemIcon>
                            <Inventory />
                        </ListItemIcon>
                        </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding>
                        <ListItemButton component={Link} href="#community" to="/community">
                        <ListItemIcon>
                            <Group />
                        </ListItemIcon>
                        </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding>
                        <ListItemButton component="a" href="#settings">
                        <ListItemIcon>
                            <Settings />
                        </ListItemIcon>
                        </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding>
                        <ModeNight/>
                        <Switch onChange={e=>setMode(mode === "light" ? "dark" : "light")}/>
                    </ListItem>
                </List>
            </Box>
        </Box>
    )
}

export default Sidebar