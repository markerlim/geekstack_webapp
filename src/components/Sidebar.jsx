import React from 'react'
import { Box, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Switch} from '@mui/material'
import { Build, Group, Home, ModeNight, People, Settings } from '@mui/icons-material'
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
                            <People />
                        </ListItemIcon>
                        </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding>
                        <ListItemButton component={Link} href="#cards" to="/deckbuilder">
                        <ListItemIcon>
                            <Build />
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