import { Box, SwipeableDrawer } from "@mui/material";
import React from "react";

const PostDrawer = ({setPostDrawerOpen, postDrawerOpen}) => {
    const handleDrawerClose = () => {
        setPostDrawerOpen(false);
    };

    return (
        <SwipeableDrawer
        anchor="bottom"
        open={postDrawerOpen}
        onClose={handleDrawerClose}
        disableSwipeToOpen
        >
            <Box sx={{height:'200px',bgcolor:'#f2f3f8',width:'100vw'}}>
                Test
            </Box>
        </SwipeableDrawer>
    )
}

export default PostDrawer;