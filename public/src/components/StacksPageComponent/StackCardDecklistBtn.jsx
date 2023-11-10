import { ArrowForward } from "@mui/icons-material";
import { Box } from "@mui/material";
import React from "react";

const StackCardDecklistBtn = () => {
    return (
        <Box sx={{backgroundColor:'#26262d',padding:'20px',border:'1px solid #5e5e61',width:'calc(100vw - 150px)',display:'flex',flexDirection:'row',alignItems:'center',borderRadius:'10px',height:'20px',justifyContent:'space-between'}}>
            <Box>Test</Box>
            <Box><ArrowForward/></Box>
        </Box>
    )
}

export default StackCardDecklistBtn
