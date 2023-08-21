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
import { Build, Home, Inventory, Style, VolunteerActivism } from '@mui/icons-material';
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
        bgcolor: '#222032',
        color: '#9930f3',
        boxShadow: { xs: 1, sm: 1, md: 0 },
        bottom: 0,
        zIndex: { xs: 100, sm: 100, md: 'auto' },
      }}
    >
      <ThemeProvider theme={customTheme}>
        <BottomNavigation sx={{ bgcolor: '#222032', gap: "0px" }}>
          <BottomNavigationAction
            onClick={handleClick}
            icon={<Style />}
            sx={{
              color: '#9930f3',
              '@media (max-width:400px)': {
                // put your styling here
                minWidth: 'auto', // this will override the default minWidth: 80
                padding: '6px 3px', // decrease padding
                '& .MuiBottomNavigationAction-label': {
                  fontSize: '0.6rem', // decrease font size
                },
              }
            }}
          />
          <BottomNavigationAction
            component={Link}
            to="/deckbuilder"
            icon={<Build />}
            sx={{
              color: '#9930f3',
              '@media (max-width:400px)': {
                // put your styling here
                minWidth: 'auto', // this will override the default minWidth: 80
                padding: '6px 3px', // decrease padding
                '& .MuiBottomNavigationAction-label': {
                  fontSize: '0.6rem', // decrease font size
                },
              }
            }}
          />
          <BottomNavigationAction
            component={Link}
            to="/"
            icon={<Home />}
            sx={{
              color: '#9930f3',
              '@media (max-width:400px)': {
                // put your styling here
                minWidth: 'auto', // this will override the default minWidth: 80
                padding: '6px 3px', // decrease padding
                '& .MuiBottomNavigationAction-label': {
                  fontSize: '0.6rem', // decrease font size
                },
              }
            }}
          />
          <BottomNavigationAction
            component={Link}
            to="/deckviewer"
            icon={<Inventory />}
            sx={{
              color: '#9930f3',
              '@media (max-width:400px)': {
                // put your styling here
                minWidth: 'auto', // this will override the default minWidth: 80
                padding: '6px 3px', // decrease padding
                '& .MuiBottomNavigationAction-label': {
                  fontSize: '0.6rem', // decrease font size
                },
              }
            }}
          />
          <BottomNavigationAction
            component={Link}
            to="/credits"
            icon={<VolunteerActivism/>}
            sx={{
              color: '#9930f3',
              '@media (max-width:400px)': {
                // put your styling here
                minWidth: 'auto', // this will override the default minWidth: 80
                padding: '6px 3px', // decrease padding
                '& .MuiBottomNavigationAction-label': {
                  fontSize: '0.6rem', // decrease font size
                },
              }
            }}
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
          <MenuItem onClick={handleClose} component={Link} to="/onepiece"><img src="/icons/onepieceicon.png" width="30px" alt="digivice" />  Onepiece</MenuItem>
        </Menu>
      </ThemeProvider>
    </Box>
  );
};

export default BottomNav;
