import React, { useEffect, useState } from 'react';
import {
  Box,
  BottomNavigation,
  BottomNavigationAction,
  createTheme,
  ThemeProvider,
  Modal,
} from '@mui/material';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import LoginModal from './LoginModal';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../Firebase';


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
  const navigate = useNavigate();
  const [isLoginModalOpen, setLoginModalOpen] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, []);

  function isIOS() {
    return /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.userAgent.includes("Mac") && "ontouchend" in document);
  }

  const isActive = (paths) => {
    if (Array.isArray(paths)) {
      return paths.some(path => location.pathname === path);
    }
    return location.pathname === paths;
  };

  const handleAccountClick = () => {
    if (!user) {
      console.log('not logged in')
      setLoginModalOpen(true);
    } else {
      console.log('logged in')
      navigate('/account'); // You may adjust this based on your routing logic
    }
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
        <BottomNavigation sx={{ bgcolor: '#101418', paddingTop: '5px', borderTop: '0.5px solid #29333e' }}>
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
                  filter: isActive(['/']) ? 'none' : 'grayscale(10)', // Adjust this filter as needed
                  transition: 'filter 0.3s ease-in-out'
                }}
              />
            }
            sx={{
              padding: 0,
              minWidth: '42px',
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
              padding: 0,
              minWidth: '42px',
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
              padding: 0,
              minWidth: '42px',
              color: isActive(['/deckbuilder', '/optcgbuilder']) ? '#7C4FFF' : '#555555',
            }}
          />
          <BottomNavigationAction
            disableRipple
            component={Link}
            to="/stacks"
            icon={
              <img
                src="https://geekstack.dev/icons/bottomnav/NewsSelected.svg"
                alt="content"
                style={{
                  width: "30px",
                  filter: isActive('/stacks') ? 'none' : 'grayscale(10)', // Adjust this filter as needed
                  transition: 'filter 0.3s'
                }}
              />
            }
            sx={{
              padding: 0,
              minWidth: '42px',
              color: isActive('/stacks') ? '#7C4FFF' : '#555555',
            }}
          />
          <BottomNavigationAction
            disableRipple
            to="/account"
            component={Link}
            icon={
              <img
                src="/icons/bottomnav/AccSelected.svg"
                alt="account"
                style={{
                  width: "30px",
                  filter: isActive('/account') ? 'none' : 'grayscale(10)', // Adjust this filter as needed
                  transition: 'filter 0.3s'
                }}
              />
            }
            sx={{
              padding: 0,
              minWidth: '42px',
              color: isActive('/account') ? '#7C4FFF' : '#555555',
            }}
            onClick={handleAccountClick}
          />
        </BottomNavigation>
      </ThemeProvider>
      <Modal open={isLoginModalOpen} onClose={() => setLoginModalOpen(false)} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <LoginModal />
      </Modal>
    </Box>
  );
};

export default BottomNav;
