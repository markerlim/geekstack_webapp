import React, { useState } from 'react';
import {
  Box,
  BottomNavigation,
  BottomNavigationAction,
  createTheme,
  ThemeProvider,
  Menu,
  MenuItem,
  Slide,
} from '@mui/material';
import { Gamepad, Home, Inventory, Stars, Style } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { TransitionProps } from '@mui/material/transitions';

const customTheme = createTheme({
  components: {
    MuiBottomNavigation: {
      defaultProps: {
        showLabels: true,
      },
    },
  },
});
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const BottomNav = () => {

  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

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
        bgcolor: '#240056',
        color: '#10c5a3',
        boxShadow: { xs: 1, sm: 1, md: 0 },
        bottom: 0,
        zIndex: { xs: 100, sm: 100, md: 'auto' },
      }}
    >
      <ThemeProvider theme={customTheme}>
        <BottomNavigation sx={{ bgcolor: '#210449'}}>
          <BottomNavigationAction
            onClick={handleClick}
            label="Games"
            icon={<Gamepad />}
            sx={{ color: '#10c5a3' }}
          />
          <BottomNavigationAction
            component={Link}
            to="/deckbuilder"
            label="Builder"
            icon={<Style />}
            sx={{ color: '#10c5a3' }}
          />
          <BottomNavigationAction
            component={Link}
            to="/"
            label="Home"
            icon={<Home />}
            sx={{ color: '#10c5a3' }}
          />
          <BottomNavigationAction
            component={Link}
            to="/deckviewer"
            label="Decks"
            icon={<Inventory />}
            sx={{ color: '#10c5a3' }}
          />
          <BottomNavigationAction
            component={Link}
            to="/credits"
            label="Support"
            icon={<Stars />}
            sx={{ color: '#10c5a3' }}
          />
        </BottomNavigation>
        <Menu
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={handleClose}
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            transformOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            TransitionComponent={Transition}
          >
            <MenuItem onClick={handleClose} component={Link} to="/unionarena"><img src="/icons/unionarenaicon.ico" width="30px" alt="unionarena" />  Union Arena</MenuItem>
            <MenuItem onClick={handleClose} component={Link} to="/digimon"><img src="/icons/digivice.png" width="30px" alt="digivice" />  Digimon</MenuItem>
          </Menu>
      </ThemeProvider>
    </Box>
  );
};

export default BottomNav;
