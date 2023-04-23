import {AppBar, styled, Toolbar, Typography, Box, InputBase, Avatar, Menu, MenuItem} from '@mui/material'
import React, { useContext, useState } from 'react'
import { Style} from '@mui/icons-material'
import { signOut } from 'firebase/auth';
import { auth } from '../Firebase';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const StyledToolbar = styled(Toolbar)({
    display:'flex',
    backgroundColor:"#240052",
    justifyContent:'space-between',
});

const Search = styled("div")(({theme}) => ({
    backgroundColor:"white",
    padding:"0 10px",
    borderRadius: theme.shape.borderRadius,
    width:"40%",
}));
const Icons = styled(Box)(({theme}) => ({
    display:"none",
    alignItems:"center",
    gap:"20px",
    [theme.breakpoints.up("sm")]:{
        display:"flex"
    }
}));
const UserBox = styled(Box)(({theme}) =>({
    display:"flex",
    alignItems:"center",
    gap:"10px",
    [theme.breakpoints.up("sm")]:{
        display:"none"
    }
}));

const Navbar = (handleSearchInputChange) => {
    const [open, setOpen] = useState(false)
    const {currentUser} =useContext(AuthContext)    

    return(
        <AppBar position="sticky">
            <StyledToolbar>
                <Typography variant="h6" sx={{display:{xs:"none",sm:"block"},fontWeight:"900"}}>GEEK STACK</Typography>
                <Style sx={{display:{xs:"block",sm:"none"}}}/>
                <Search>
                    <InputBase placeholder='search..'/>
                    </Search>
                <Icons>
                    <Avatar sx={{width:30, height:30}} src={currentUser.photoURL}
                    onClick={e=>setOpen(true)}/>
                    <span onClick={e=>setOpen(true)}>{currentUser.displayName}</span>
                </Icons>
                <UserBox onClick={e=>setOpen(true)}>
                    <Avatar sx={{width:30, height:30}} src=""/>
                    <Typography>User</Typography>
                </UserBox>
            </StyledToolbar>
            <Menu
                id="demo-positioned-menu"
                aria-labelledby="demo-positioned-button"
                open={open}
                onClose={(e)=>setOpen(false)}
                anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
                }}
                transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
                }}
            >
                <MenuItem >Profile</MenuItem>
                <MenuItem >My account</MenuItem>
                <MenuItem component={Link} onClick={()=>signOut(auth)} to="/login">Logout</MenuItem>
            </Menu>
        </AppBar>
    );
};

export default Navbar