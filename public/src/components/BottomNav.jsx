import React from 'react';
import {
  Box,
  BottomNavigation,
  BottomNavigationAction,
  createTheme,
  ThemeProvider,
} from '@mui/material';
import { Home, Inventory, Stars, Style } from '@mui/icons-material';
import { Link } from 'react-router-dom';

const customTheme = createTheme({
  components: {
    MuiBottomNavigation: {
      defaultProps: {
        showLabels: true,
      },
    },
  },
});

const BottomNav = () => {
  return (
    <Box
      flex={2}
      p={0}
      sx={{
        display: { xs: 'block', sm: 'block', md: 'none' },
        height: '60px',
        position: { xs: 'fixed', sm: 'fixed', md: 'static' },
        width: '100%',
        justifyContent: 'space-evenly',
        bgcolor: 'white',
        color: 'primary.contrastText',
        boxShadow: { xs: 1, sm: 1, md:0 },
        bottom: 0,
        zIndex: { xs: 100, sm: 100, md:'auto' },
      }}
    >
      <ThemeProvider theme={customTheme}>
        <BottomNavigation>
          <BottomNavigationAction
            component={Link}
            to="/"
            label="Home"
            icon={<Home />}
          />
          <BottomNavigationAction
            component={Link}
            to="/deckbuilder"
            label="Builder"
            icon={<Style />}
          />
          <BottomNavigationAction
            component={Link}
            to="/deckviewer"
            label="Decks"
            icon={<Inventory />}
          />
          <BottomNavigationAction
            component={Link}
            to="/disclaimer"
            label="Disclaimer"
            icon={<Stars />}
          />
        </BottomNavigation>
      </ThemeProvider>
    </Box>
  );
};

export default BottomNav;
