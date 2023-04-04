import React from 'react'
import { Box, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Switch} from '@mui/material'
import { Build, Group, Home, ModeNight, People, Settings } from '@mui/icons-material'
const Sidebar = ({mode,setMode}) => {
    return(
        <Box flex={1} p={2} sx={{display:{xs:"none",sm:"block"}}}>
            <Box position="fixed">
                <List>
                    <ListItem disablePadding>
                        <ListItemButton component="a" href="#home">
                        <ListItemIcon>
                            <Home />
                        </ListItemIcon>
                        <ListItemText primary="Homepage" />
                        </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding>
                        <ListItemButton component="a" href="#profile">
                        <ListItemIcon>
                            <People />
                        </ListItemIcon>
                        <ListItemText primary="Profile" />
                        </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding>
                        <ListItemButton component="a" href="#cards">
                        <ListItemIcon>
                            <Build />
                        </ListItemIcon>
                        <ListItemText primary="Deckbuilder" />
                        </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding>
                        <ListItemButton component="a" href="#community">
                        <ListItemIcon>
                            <Group />
                        </ListItemIcon>
                        <ListItemText primary="Community" />
                        </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding>
                        <ListItemButton component="a" href="#settings">
                        <ListItemIcon>
                            <Settings />
                        </ListItemIcon>
                        <ListItemText primary="Settings" />
                        </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding>
                        <ListItemButton component="a" href="#settings">
                        <ListItemIcon>
                            <ModeNight />
                        </ListItemIcon>
                            <Switch onChange={e=>setMode(mode === "light" ? "dark" : "light")}/>
                        </ListItemButton>
                    </ListItem>
                </List>
            </Box>
        </Box>
    )
}

export default Sidebar