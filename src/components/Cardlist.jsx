import React from "react";
import SingleCard from "./SingleCard";
import { Box, Grid } from "@mui/material";

const Cardlist = () => {
 
    return (
        <Box flex={8} p={2}>
            <Grid container spacing={2} display={{justifyContent:"center"}}>
            {Array.from(Array(6)).map((_, index) => (
                <Grid item key={index}>
                <SingleCard/>
                </Grid>
            ))}
            </Grid>
        </Box>
    )
}

export default Cardlist