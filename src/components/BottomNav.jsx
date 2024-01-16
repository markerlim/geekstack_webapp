import React from 'react';
import {
  Box,
  BottomNavigation,
  BottomNavigationAction,
  createTheme,
  ThemeProvider,
} from '@mui/material';
import { Link, useLocation } from 'react-router-dom';


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
  const location = useLocation();

  function isIOS() {
    return /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.userAgent.includes("Mac") && "ontouchend" in document);
  }

  const isActive = (paths) => {
    if (Array.isArray(paths)) {
      return paths.some(path => location.pathname === path);
    }
    return location.pathname === paths;
  };

  return (
    <Box
      p={0}
      sx={{
        display: { xs: 'block', sm: 'block', md: 'none' },
        height: '70px',
        position: { xs: 'fixed', sm: 'fixed', md: 'static' },
        width: '100%',
        justifyContent: 'space-evenly',
        bgcolor: '#101418',
        color: '#7C4FFF',
        boxShadow: { xs: 1, sm: 1, md: 0 },
        bottom: 0,
        paddingBottom: isIOS() ? '10px' : '0px',
        zIndex: { xs: 100, sm: 100, md: 'auto' },
      }}
    >
      <ThemeProvider theme={customTheme}>
        <BottomNavigation sx={{ bgcolor: '#101418',  paddingTop: '5px', borderTop:'0.5px solid #29333e' }}>
          <BottomNavigationAction
            disableRipple
            component={Link}
            to="/"
            icon={
              <img
                src="https://geekstack.dev/icons/bottomnav/HomeSelected.svg"
                alt="home"
                style={{
                  width: "30px",
                  filter: isActive(['/','/stacks']) ? 'none' : 'grayscale(10)', // Adjust this filter as needed
                  transition: 'filter 0.3s ease-in-out'
                }}
              />
            }
            sx={{
              padding:0,
              minWidth:'42px',
              color: isActive('/') ? '#7C4FFF' : '#555555',
            }}
          />
          <BottomNavigationAction
            disableRipple
            component={Link}
            to="/list"
            icon={
              <img
                src="https://geekstack.dev/icons/bottomnav/DecklibrarySelected.svg"
                alt="library"
                style={{
                  width: "30px",
                  filter: isActive(['/list', '/unionarena', '/onepiece']) ? 'none' : 'grayscale(10)', // Adjust this filter as needed
                  transition: 'filter 0.3s'
                }}
              />
            }
            sx={{
              padding:0,
              minWidth:'42px',
              color: isActive(['/list', '/unionarena', '/onepiece']) ? '#7C4FFF' : '#555555',
            }}
          />
          <BottomNavigationAction
            disableRipple
            component={Link}
            to="/deckbuilder"
            icon={
              <img
                src="https://geekstack.dev/icons/bottomnav/DeckcreateSelected.svg"
                alt="create"
                style={{
                  width: "30px",
                  filter: isActive(['/deckbuilder', '/optcgbuilder']) ? 'none' : 'grayscale(10)', // Adjust this filter as needed
                  transition: 'filter 0.3s'
                }}
              />
            }
            sx={{
              padding:0,
              minWidth:'42px',
              color: isActive(['/deckbuilder', '/optcgbuilder']) ? '#7C4FFF' : '#555555',
            }}
          />
          <BottomNavigationAction
            disableRipple
            component={Link}
            to="/news"
            icon={
              <img
                src="https://geekstack.dev/icons/bottomnav/NewsSelected.svg"
                alt="news"
                style={{
                  width: "30px",
                  filter: isActive('/news') ? 'none' : 'grayscale(10)', // Adjust this filter as needed
                  transition: 'filter 0.3s'
                }}
              />
            }
            sx={{
              padding:0,
              minWidth:'42px',
              color: isActive('/news') ? '#7C4FFF' : '#555555',
            }}
          />
          <BottomNavigationAction
            disableRipple
            component={Link}
            to="/Account"
            icon={
              <img
                src="/icons/bottomnav/AccSelected.svg"
                alt="FAQ"
                style={{
                  width: "30px",
                  filter: isActive('/Account') ? 'none' : 'grayscale(10)', // Adjust this filter as needed
                  transition: 'filter 0.3s'
                }}
              />
            }
            sx={{
              padding:0,
              minWidth:'42px',
              color: isActive('/Account') ? '#7C4FFF' : '#555555',
            }}
          />
        </BottomNavigation>
      </ThemeProvider>
    </Box>
  );
};

export default BottomNav;
