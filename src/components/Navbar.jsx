import { AppBar, styled, Toolbar, Box, InputBase, Avatar, Menu, MenuItem, Button } from '@mui/material'
import React, { useContext, useRef, useState } from 'react'
import { signOut } from 'firebase/auth';
import { auth } from '../Firebase';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { SearchOutlined } from '@mui/icons-material';

const StyledToolbar = styled(Toolbar)({
    display: 'flex',
    backgroundColor: "#240052",
    justifyContent: 'space-between',
});

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
            <Box sx={{padding:"5px",textAlign:"center"}}>Hi do note that there are certain features that are new and may have bugs, we seek your kind understanding</Box>
            <StyledToolbar>
                <Box p={1} sx={{ display: { xs: "none", sm: "block" } }}><img style={{ width: "auto", height: "50px" }} alt="uniondeck" src="/icons/uniondecklogosmall.png" /></Box>
                <Box p={1} sx={{ display: { xs: "block", sm: "none" } }}><img style={{ width: "auto", height: "30px" }} alt="uniondeck" src="/icons/uniondecklogosmall.png" /></Box>
                <Box sx={{display:"flex",flexDirection:"row",backgroundColor:"#f2f3f8",borderRadius:"5px",paddingTop:"5px",paddingBottom:"5px",paddingLeft:"10px",paddingRight:"10px",marginLeft:"2px",marginRight:"2px"}}>
                    <InputBase
                        placeholder='search...'
                        inputRef={searchInputRef}
                    />
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleSearchInputChanged}
                        sx={{textAlign:"center",justifySelf:"flex-end",overflow:'hidden',borderRadius:"20px"}}
                    >
                        <SearchOutlined sx={{width:"25px"}}/>
                    </Button>
                </Box>
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