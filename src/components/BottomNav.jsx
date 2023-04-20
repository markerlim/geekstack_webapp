import React from 'react'
import { Box, BottomNavigation, BottomNavigationAction } from '@mui/material'
import { Group, Home, Inventory, Style } from '@mui/icons-material'
import { Link } from 'react-router-dom'

const BottomNav = () => {
    return (
        <BottomNavigation>
            <BottomNavigationAction component={Link} to="/" label="Home" icon={<Home />} />
            <BottomNavigationAction component={Link} to="/deckbuilder" label="Deckbuilder" icon={<Style />} />
            <BottomNavigationAction component={Link} to="/deckviewer" label="Deck Views" icon={<Inventory />} />
            <BottomNavigationAction component={Link} to="/community" label="Community" icon={<Group />} />
        </BottomNavigation>
    )
}

const Sidebar = () => {
    return(
        <Box flex={2} p={0} sx={{
            display: { xs: 'block', sm: 'none' },
            height: '5vh',
            position: { xs: 'fixed', sm: 'static' },
            bottom: { xs: 0, sm: 'auto' },
            width: '100%',
            justifyContent: 'space-evenly',
            bgcolor: 'primary.main',
            color: 'primary.contrastText',
            boxShadow: { xs: 1, sm: 0 },
            zIndex: { xs: 100, sm: 'auto' }
        }}>
            <BottomNav />
        </Box>
    )
}

export default Sidebar
