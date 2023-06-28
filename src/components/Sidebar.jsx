import React from 'react'
import { Box, List, ListItem, ListItemButton, ListItemIcon } from '@mui/material'
import { Article, Diversity2, Home, Inventory, Stars, Style } from '@mui/icons-material'
import { Link } from 'react-router-dom'


const Sidebar = () => {
    return (
        <Box position="fixed" sx={{ display: { sm: "none", md: "flex" }, height: "100vh",overflow:"hidden",backgroundColor:"#210449",paddingTop:"100px",width:"100px",marginTop:"-80px",justifyContent:"center",zIndex:100}}>
            <Box>
                <List>
                    <ListItem sx={{bottomMargin:"20px"}} disablePadding>
                        <ListItemButton component={Link} href="#home" to="/">
                            <ListItemIcon sx={{justifyContent:"center",alignItems:"center"}}>
                                <Home sx={{ color: "#10c5a3" }} alt="home" />
                            </ListItemIcon>
                        </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding>
                        <ListItemButton component={Link} href="#cards" to="/deckbuilder">
                            <ListItemIcon sx={{justifyContent:"center",alignItems:"center"}}>
                                <Style sx={{ color: "#10c5a3" }} alt="deckbuilder" />
                            </ListItemIcon>
                        </ListItemButton>
                    </ListItem>
                    <ListItem sx={{display:"none"}} disablePadding>
                        <ListItemButton component={Link} href="#geekhub" to="/geekhub">
                            <ListItemIcon sx={{justifyContent:"center",alignItems:"center"}}>
                                <Diversity2 sx={{ color: "#10c5a3" }} alt="geekhub" />
                            </ListItemIcon>
                        </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding>
                        <ListItemButton component={Link} href="#decks" to="/deckviewer">
                            <ListItemIcon sx={{justifyContent:"center",alignItems:"center"}}>
                                <Inventory sx={{ color: "#10c5a3" }} alt="deck views" />
                            </ListItemIcon>
                        </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding>
                        <ListItemButton component={Link} href="#articles" to="/articles">
                            <ListItemIcon sx={{justifyContent:"center",alignItems:"center"}}>
                                <Article sx={{ color: "#10c5a3" }} alt="articles" />
                            </ListItemIcon>
                        </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding>
                        <ListItemButton component={Link} href="#disclaimer" to="/disclaimer">
                            <ListItemIcon sx={{justifyContent:"center",alignItems:"center"}}>
                                <Stars sx={{ color: "#10c5a3" }} alt="disclaimer" />
                            </ListItemIcon>
                        </ListItemButton>
                    </ListItem>
                </List>
            </Box>
        </Box>
    )
}

export default Sidebar