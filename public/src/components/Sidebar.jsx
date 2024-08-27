import React from 'react'
import { Box, List, ListItem, ListItemButton, ListItemIcon } from '@mui/material'
import { Article, Inventory} from '@mui/icons-material'
import { Link, useLocation } from 'react-router-dom'


const Sidebar = () => {

    const location = useLocation();

    const isActive = (paths) => {
        if (Array.isArray(paths)) {
            return paths.some(path => location.pathname === path);
        }
        return location.pathname === paths;
    };
    return (
        <Box position="fixed" sx={{ display: { sm: "none", md: "flex" }, height: "100vh", overflow: "hidden", backgroundColor: '#26252D', paddingTop: "100px", width: "100px", marginTop: "-80px", justifyContent: "center", zIndex: 100 }}>
            <Box>
                <List>
                    <ListItem sx={{ bottomMargin: "20px" }} disablePadding>
                        <ListItemButton component={Link} to="/">
                            <ListItemIcon disableRipple sx={{
                                justifyContent: "center", alignItems: "center",
                            }}>
                                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px' }}>
                                    <Box component={'img'} src="https://geekstack.dev/icons/bottomnav/HomeSelected.svg"
                                        alt="home"
                                        sx={{
                                            width: "30px",
                                            filter: isActive('/') ? 'none' : 'grayscale(10)', // Adjust this filter as needed
                                            transition: 'filter 0.3s ease-in-out',
                                            padding: 0,
                                        }}
                                    />
                                    <Box component={'span'} sx={{ color: isActive('/') ? '#7C4FFF' : '#555555', fontSize: '10px' }}>Home</Box>
                                </Box>
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
                                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px' }}>
                                    <Inventory sx={{ color: isActive('/deckviewer') ? '#7C4FFF' : '#555555' }} alt="deck views" />
                                    <Box component={'span'} sx={{ color: isActive('/deckviewer') ? '#7C4FFF' : '#555555', fontSize: '10px' }}>UA Decks</Box>
                                </Box>
                            </ListItemIcon>
                        </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding>
                        <ListItemButton component={Link} to="/unionarena">
                            <ListItemIcon sx={{ justifyContent: "center", alignItems: "center" }}>
                                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px' }}>
                                    <Box component={'img'} src="/icons/unionarenaicon.ico" width="30px" alt="unionarena" sx={{
                                        width: "30px",
                                        filter: isActive('/unionarena') ? 'none' : 'grayscale(10)', // Adjust this filter as needed
                                        transition: 'filter 0.3s ease-in-out',
                                        padding: 0,
                                    }} />
                                    <Box component={'span'} sx={{ color: isActive('/unionarena') ? '#7C4FFF' : '#555555', fontSize: '10px' }}>Union Arena</Box>
                                </Box>
                            </ListItemIcon>
                        </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding>
                        <ListItemButton component={Link} to="/onepiece">
                            <ListItemIcon sx={{ justifyContent: "center", alignItems: "center" }}>
                                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px' }}>
                                    <Box component={'img'} src="/icons/onepieceicon.png" width="30px" alt="onepiece" sx={{
                                        width: "30px",
                                        filter: isActive('/onepiece') ? 'none' : 'grayscale(10)', // Adjust this filter as needed
                                        transition: 'filter 0.3s ease-in-out',
                                        padding: 0,
                                    }} />
                                    <Box component={'span'} sx={{ color: isActive('/onepiece') ? '#7C4FFF' : '#555555', fontSize: '10px' }}>One Piece</Box>
                                </Box>
                            </ListItemIcon>
                        </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding>
                        <ListItemButton component={Link} to="/dragonballz">
                            <ListItemIcon sx={{ justifyContent: "center", alignItems: "center" }}>
                                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px' }}>
                                    <Box component={'img'} src="/icons/dragonballz.ico" width="30px" alt="dragonballz" sx={{
                                        width: "30px",
                                        filter: isActive('/dragonballz') ? 'none' : 'grayscale(10)', // Adjust this filter as needed
                                        transition: 'filter 0.3s ease-in-out',
                                        padding: 0,
                                    }} />
                                    <Box component={'span'} sx={{ color: isActive('/dragonballz') ? '#7C4FFF' : '#555555', fontSize: '10px' }}>Dragonballz FW</Box>
                                </Box>
                            </ListItemIcon>
                        </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding>
                        <ListItemButton component={Link} to="/stacks">
                            <ListItemIcon sx={{
                                justifyContent: "center", alignItems: "center", '& svg': { // target the svg within the ListItemIcon
                                    filter: 'drop-shadow(0 0 5px #121212)'
                                }
                            }}>
                                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px' }}>
                                    <Box component={'img'} src="https://geekstack.dev/icons/bottomnav/NewsSelected.svg"
                                        alt="FAQ"
                                        style={{
                                            width: "30px",
                                            filter: isActive('/stacks') ? 'none' : 'grayscale(10)', // Adjust this filter as needed
                                            transition: 'filter 0.3s'
                                        }} />
                                    <Box component={'span'} sx={{ color: isActive('/stacks') ? '#7C4FFF' : '#555555', fontSize: '10px' }}>Stacks</Box>
                                </Box>
                            </ListItemIcon>
                        </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding>
                        <ListItemButton component={Link} to="/faq">
                            <ListItemIcon sx={{
                                justifyContent: "center", alignItems: "center", '& svg': { // target the svg within the ListItemIcon
                                    filter: 'drop-shadow(0 0 5px #121212)'
                                }
                            }}>
                                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px' }}>
                                    <Box component={'img'} src="https://geekstack.dev/icons/bottomnav/FAQSelected.svg"
                                        alt="FAQ"
                                        style={{
                                            width: "30px",
                                            filter: isActive('/faq') ? 'none' : 'grayscale(10)', // Adjust this filter as needed
                                            transition: 'filter 0.3s'
                                        }} />
                                    <Box component={'span'} sx={{ color: isActive('/faq') ? '#7C4FFF' : '#555555', fontSize: '10px' }}>FAQ</Box>
                                </Box>
                            </ListItemIcon>
                        </ListItemButton>
                    </ListItem>
                </List>
            </Box>
        </Box>
    )
}

export default Sidebar