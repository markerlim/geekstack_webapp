import React, { useContext, useEffect, useState } from 'react';
import { AppBar, styled, Toolbar, Box, Avatar, Menu, MenuItem, Modal } from '@mui/material';
import { signOut } from 'firebase/auth';
import { auth } from '../Firebase';
import { AuthContext } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowBack } from '@mui/icons-material';
import LoginModal from './LoginModal'; // Import the LoginModal component

const StyledToolbar = styled(Toolbar)({
    display: 'flex',
    height: '64px',
    '&.MuiToolbar-root': {
        background: '#101418',
    },
});

const Icons = styled(Box)(({ theme }) => ({
    display: 'none',
    alignItems: 'center',
    gap: '10px',
    paddingLeft: '10px',
    [theme.breakpoints.down('sm')]: {
        display: 'flex',
    },
}));
const UserBox = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    [theme.breakpoints.down('sm')]: {
        display: 'none',
    },
}));

const NavbarPrompt = () => {
    const [open, setOpen] = useState(false);
    const { currentUser } = useContext(AuthContext);
    const navigate = useNavigate();

    const goBack = () => {
        console.log('clicked back');
        navigate(-1);
    };

    const handleLogout = () => {
        signOut(auth);
        localStorage.clear();
    };

    const handleClose = () => {
        // Check if the user is logged in before allowing the modal to be closed
        if (currentUser) {
            setOpen(false);
        }
    };

    useEffect(() => {
        // Check if the user is not logged in
        if (!currentUser) {
            setOpen(true);
        }
    }, [currentUser]);

    return (
        <AppBar position="fixed">
            <StyledToolbar sx={{ position: 'relative' }}>
                <Box p={1} sx={{ display: { xs: 'none', sm: "none", md: "flex" }, position: 'absolute', left: '20px', fontFamily: 'League Spartan', flexDirection: 'row', alignItems: 'center', gap: '10px' }}>
                    <img style={{ width: "auto", height: "50px" }} alt="uniondeck" src="/icons/geekstackicon.svg" />
                    <Box sx={{ display: 'flex', flexDirection: 'column', paddingTop: "5px", paddingBottom: "5px", }}>
                        <strong style={{ fontSize: '22px', }}>GEEKSTACK</strong>
                        <span>Everything Cards</span>
                    </Box>
                </Box>
                <Box sx={{ display: { xs: 'block', sm: 'block', md: 'none' }, cursor: 'pointer', position: 'absolute', left: '20px', zIndex: 850 }} onClick={goBack}>
                    <ArrowBack />
                </Box>
                <Box p={1} sx={{ display: { xs: 'flex', sm: "none" }, width: '100vw', justifyContent: 'center', zIndex: 800 }}>
                    <img style={{ width: "auto", height: "40px" }} alt="uniondeck" src="/icons/geekstackicon.svg" />
                </Box>
                <Box sx={{ display: { xs: 'none', sm: 'flex', md: "none" }, justifyContent: 'center', width: '100vw', zIndex: 800, flexDirection: "row", borderRadius: "5px", marginLeft: '-25px' }}>
                    <img style={{ width: "auto", height: "40px" }} alt="uniondeck" src="/icons/geekstackicon.svg" />
                </Box>
                <Box position={'absolute'} sx={{ right: '20px', zIndex: 850 }}>
                    {currentUser ? (
                        // User is logged in
                        <>
                            <Icons>
                                {currentUser.photoURL ? (
                                    <Avatar sx={{ width: 30, height: 30 }} src={currentUser.photoURL} onClick={e => setOpen(true)} />
                                ) : (
                                    <Avatar sx={{ width: 30, height: 30 }}>{/* Default avatar or placeholder */}</Avatar>
                                )}
                            </Icons>
                            <UserBox onClick={e => setOpen(true)}>
                                {currentUser.photoURL ? (
                                    <Avatar sx={{ width: 30, height: 30 }} src={currentUser.photoURL} onClick={e => setOpen(true)} />
                                ) : (
                                    <Avatar sx={{ width: 30, height: 30 }}>{/* Default avatar or placeholder */}</Avatar>
                                )}
                                {currentUser.displayName && (
                                    <span onClick={e => setOpen(true)}>{currentUser.displayName}</span>
                                )}
                            </UserBox>
                            {/* Render the Menu only for logged-in state */}
                            <Menu
                                id="demo-positioned-menu"
                                aria-labelledby="demo-positioned-button"
                                open={open}
                                onClose={() => setOpen(false)}
                                anchorOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'left',
                                }}
                            >
                                <MenuItem component={Link} to="/account">Account</MenuItem>
                                <MenuItem component={Link} onClick={handleLogout}>Logout</MenuItem>
                            </Menu>
                        </>
                    ) : (
                        // User is not logged in
                        <>
                            <span style={{ cursor: 'pointer' }} onClick={() => setOpen(true)}>Login</span>
                            {/* Render the LoginModal for unlogged-in state */}
                            <Modal open={open} onClose={handleClose} sx={{display:'flex',justifyContent:'center',alignItems:'center'}}>
                                <LoginModal />
                            </Modal>
                        </>
                    )}
                </Box>
            </StyledToolbar>
        </AppBar>
    );
};

export default NavbarPrompt;
