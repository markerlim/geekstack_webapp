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

const HotkeysNav = ({isNavVisible}) => {
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
        height: '60px',
        position: { xs: 'fixed', sm: 'fixed', md: 'static' },
        width: '100%',
        bgcolor: '#101418',
        color: '#7C4FFF',
        boxShadow: { xs: 1, sm: 1, md: 0 },
        transition: 'transform 0.3s ease',
        transform: `translateY(${isNavVisible ? '0px' : 'calc(100%)'})`,
        bottom: 0,
        paddingBottom: isIOS() ? '80px' : '70px',
        zIndex: { xs: 99, sm: 99, md: 'auto' },
      }}
    >
      <ThemeProvider theme={customTheme}>
        <BottomNavigation disablePadding sx={{ bgcolor: '#101418', height: '60px', gap:'0px', borderTop:'0.5px solid #29333e',justifyContent:'start' }}>
          <BottomNavigationAction
            disableRipple
            component={Link}
            to="/unionarena"
            icon={
              <img
                src="/images/uatcgbutton.webp"
                alt="home"
                style={{
                  width: "80%",
                  filter: isActive(['/stacks','/unionarena']) ? 'none' : 'grayscale(10)', // Adjust this filter as needed
                  transition: 'filter 0.3s ease-in-out',
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
            to="/onepiece"
            icon={
              <img
                src="/images/optcgbutton.webp"
                alt="library"
                style={{
                  width: "80%",
                  filter: isActive(['/stacks','/onepiece']) ? 'none' : 'grayscale(10)', // Adjust this filter as needed
                  transition: 'filter 0.3s',
                  marginLeft:'-40px'
                }}
              />
            }
            sx={{
              padding:0,
              minWidth:'42px',
              color: isActive(['/list', '/unionarena', '/onepiece']) ? '#7C4FFF' : '#555555',
            }}
          />
        </BottomNavigation>
      </ThemeProvider>
    </Box>
  );
};

export default HotkeysNav;
