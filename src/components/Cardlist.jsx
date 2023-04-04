import React from "react";
import SingleCard from "./SingleCard";
import { Box } from "@mui/material";
import Grid2 from '@mui/material/Unstable_Grid2';

const Cardlist = () => {
 
    return (
        <Box flex={5} p={2} sx={{display:"flex",justifyContent:"center",flexDirection:"row",gap:10}}>
            <SingleCard/>
            <SingleCard/>
            <SingleCard/>
        </Box>
    )
}

export default Cardlist