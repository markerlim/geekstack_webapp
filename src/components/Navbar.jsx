import { AppBar, styled, Toolbar, Box, Avatar, Menu, MenuItem } from '@mui/material'
import React, { useContext, useState } from 'react'
import { signOut } from 'firebase/auth';
import { auth } from '../Firebase';
import { AuthContext } from '../context/AuthContext';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ArrowBack } from '@mui/icons-material';

const StyledToolbar = styled(Toolbar)({
    display: 'flex',
    '&.MuiToolbar-root': {
        background: 'linear-gradient(to right,rgb(44, 25, 80), rgb(15, 23, 42))',
    }
});

const Icons = styled(Box)(({ theme }) => ({
    display: "none",
    alignItems: "center",
    gap: "10px",
    paddingLeft: "10px",
    [theme.breakpoints.down("sm")]: {
        display: "flex"
    }
}));
const UserBox = styled(Box)(({ theme }) => ({
    display: "flex",
    alignItems: "center",
    gap: "10px",
    [theme.breakpoints.down("sm")]: {
        display: "none"
    }
}));

const Navbar = (props) => {
    const [open, setOpen] = useState(false)
    const { currentUser } = useContext(AuthContext)
    const navigate = useNavigate();
    const location = useLocation();

    const goBack = () => {
        console.log('clicked back')
        navigate(-1);
    };
    const handleLogout = () => {
        signOut(auth);
        localStorage.clear();
    };

    return (
        <AppBar position="fixed">
            <StyledToolbar sx={{ position: 'relative' }}>
                <Box p={1} sx={{ display: { xs: 'none', sm: "none", md: "flex" }, position: 'absolute', left: '20px', fontFamily: 'League Spartan', flexDirection: 'row', alignItems: 'center', gap: '10px' }}>
                    <img style={{ width: "auto", height: "50px" }} alt="uniondeck" src="/icons/geekstackicon.svg" />
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                        <strong style={{ fontSize: '22px', }}>GEEKSTACK</strong>
                        <span>A Geek's Crib</span>
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
                <Box position={'absolute'} sx={{ right: '20px',zIndex:850 }}>
                    <Icons>
                        <Avatar sx={{ width: 30, height: 30 }} src={currentUser.photoURL}
                            onClick={e => setOpen(true)} />
                    </Icons>
                    <UserBox onClick={e => setOpen(true)}>
                        <Avatar sx={{ width: 30, height: 30 }} src={currentUser.photoURL}
                            onClick={e => setOpen(true)} />
                        <span onClick={e => setOpen(true)}>{currentUser.displayName}</span>
                    </UserBox>
                </Box>
            </StyledToolbar>
            <Menu
                id="demo-positioned-menu"
                aria-labelledby="demo-positioned-button"
                open={open}
                onClose={(e) => setOpen(false)}
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
                <MenuItem component={Link} onClick={handleLogout} to="/login">Logout</MenuItem>
            </Menu>
        </AppBar>
    );
};

export default Navbar