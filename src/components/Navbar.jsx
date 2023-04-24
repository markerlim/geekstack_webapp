import { AppBar, styled, Toolbar, Box, InputBase, Avatar, Menu, MenuItem } from '@mui/material'
import React, { useContext, useRef, useState } from 'react'
import { signOut } from 'firebase/auth';
import { auth } from '../Firebase';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const StyledToolbar = styled(Toolbar)({
    display: 'flex',
    backgroundColor: "#240052",
    justifyContent: 'space-between',
});

const Search = styled("div")(({ theme }) => ({
    backgroundColor: "white",
    padding: "0 10px",
    borderRadius: theme.shape.borderRadius,
    width: "40%",
}));
const Icons = styled(Box)(({ theme }) => ({
    display: "none",
    alignItems: "center",
    gap: "20px",
    [theme.breakpoints.up("sm")]: {
        display: "flex"
    }
}));
const UserBox = styled(Box)(({ theme }) => ({
    display: "flex",
    alignItems: "center",
    gap: "10px",
    [theme.breakpoints.up("sm")]: {
        display: "none"
    }
}));

const Navbar = (props) => {
    const [open, setOpen] = useState(false)
    const { currentUser } = useContext(AuthContext)
    const handleLogout = () => {
        signOut(auth);
        localStorage.clear();
    };

    const searchInputRef = useRef(null);

    const handleSearchInputChanged = () => {
        const searchValue = searchInputRef.current.value;
        props.onSearch(searchValue);
    };

    return (
        <AppBar position="sticky">
            <StyledToolbar>
                <Box p={1} sx={{ display: { xs: "none", sm: "block" }}}><img style={{width:"auto",height:"50px"}} alt="uniondeck" src="/icons/uniondecklogosmall.png"/></Box>
                <Box p={1} sx={{ display: { xs: "block", sm: "none" } }}><img style={{width:"auto",height:"30px"}} alt="uniondeck" src="/icons/uniondecklogosmall.png" /></Box>
                <Search>
                    <InputBase placeholder='search..' 
                    inputRef={searchInputRef}
                    onChange={handleSearchInputChanged} />
                </Search>
                <Icons>
                    <Avatar sx={{ width: 30, height: 30 }} src={currentUser.photoURL}
                        onClick={e => setOpen(true)} />
                    <span onClick={e => setOpen(true)}>{currentUser.displayName}</span>
                </Icons>
                <UserBox onClick={e => setOpen(true)}>
                    <Avatar sx={{ width: 30, height: 30 }} src={currentUser.photoURL}
                        onClick={e => setOpen(true)} />
                    <span onClick={e => setOpen(true)}>{currentUser.displayName}</span>
                </UserBox>
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
                <MenuItem component={Link} onClick={handleLogout} to="/login">Logout</MenuItem>
            </Menu>
        </AppBar>
    );
};

export default Navbar