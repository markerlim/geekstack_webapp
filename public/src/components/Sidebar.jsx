import React from 'react'
import { Box, List, ListItem, ListItemButton, ListItemIcon } from '@mui/material'
import { Article, Build, Diversity2, Home, Inventory, Style, VolunteerActivism } from '@mui/icons-material'
import { Link } from 'react-router-dom'


const Sidebar = () => {
    return (
        <Box position="fixed" sx={{ display: { sm: "none", md: "flex" }, height: "100vh", overflow: "hidden", backgroundColor: '#26252D', paddingTop: "100px", width: "100px", marginTop: "-80px", justifyContent: "center", zIndex: 100 }}>
            <Box>
                <List>
                    <ListItem sx={{ bottomMargin: "20px" }} disablePadding>
                        <ListItemButton component={Link} to="/">
                            <ListItemIcon sx={{
                                justifyContent: "center", alignItems: "center", '& svg': { // target the svg within the ListItemIcon
                                    filter: 'drop-shadow(0 0 5px #121212)'
                                }
                            }}>
                                <Home sx={{ color: "#7C4FFF" }} alt="home" />
                            </ListItemIcon>
                        </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding>
                        <ListItemButton component={Link} to="/deckbuilder">
                            <ListItemIcon sx={{
                                justifyContent: "center", alignItems: "center", '& svg': { // target the svg within the ListItemIcon
                                    filter: 'drop-shadow(0 0 5px #121212)'
                                }
                            }}>
                                <Build sx={{ color: "#7C4FFF" }} alt="deckbuilder" />
                            </ListItemIcon>
                        </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding>
                        <ListItemButton sx={{ display: "none" }} component={Link} to="/geekhub">
                            <ListItemIcon sx={{
                                justifyContent: "center", alignItems: "center", '& svg': { // target the svg within the ListItemIcon
                                    filter: 'drop-shadow(0 0 5px #121212)'
                                }
                            }}>
                                <Diversity2 sx={{ color: "#7C4FFF" }} alt="geekhub" />
                            </ListItemIcon>
                        </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding>
                        <ListItemButton component={Link} to="/deckviewer">
                            <ListItemIcon sx={{
                                justifyContent: "center", alignItems: "center", '& svg': { // target the svg within the ListItemIcon
                                    filter: 'drop-shadow(0 0 5px #121212)'
                                }
                            }}>
                                <Inventory sx={{ color: "#7C4FFF" }} alt="deck views" />
                            </ListItemIcon>
                        </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding>
                        <ListItemButton sx={{ display: "none" }} component={Link} to="/articles">
                            <ListItemIcon sx={{
                                justifyContent: "center", alignItems: "center", '& svg': { // target the svg within the ListItemIcon
                                    filter: 'drop-shadow(0 0 5px #121212)'
                                }
                            }}>
                                <Article sx={{ color: "#7C4FFF" }} alt="articles" />
                            </ListItemIcon>
                        </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding>
                        <ListItemButton component={Link} to="/credits">
                            <ListItemIcon sx={{
                                justifyContent: "center", alignItems: "center", '& svg': { // target the svg within the ListItemIcon
                                    filter: 'drop-shadow(0 0 5px #121212)'
                                }
                            }}>
                                <VolunteerActivism sx={{ color: "#7C4FFF" }} alt="disclaimer" />
                            </ListItemIcon>
                        </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding>
                        <ListItemButton component={Link} to="/digimon">
                            <ListItemIcon sx={{ justifyContent: "center", alignItems: "center" }}>
                                <img src="/icons/digivice.png" width="30px" alt="digivice" />
                            </ListItemIcon>
                        </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding>
                        <ListItemButton component={Link} to="/unionarena">
                            <ListItemIcon sx={{ justifyContent: "center", alignItems: "center" }}>
                                <img src="/icons/unionarenaicon.ico" width="30px" alt="unionarena" />
                            </ListItemIcon>
                        </ListItemButton>
                    </ListItem>
                </List>
            </Box>
        </Box>
    )
}

export default Sidebar