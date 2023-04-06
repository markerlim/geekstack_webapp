import {Box, Fab, Tooltip, Typography } from '@mui/material'
import {Save} from'@mui/icons-material'
import React from 'react'

const Rightbar = () => {
    return(
        <>        
        <Tooltip title="Save Deck" sx={{position:"fixed", bottom:20, right:{xs:"calc(50% - 25px)",md:30}}}>
            <Fab color="primary" aria-label="add">
                <Save />
            </Fab>
        </Tooltip>
        <Box bgcolor="purple" flex={8} p={2} sx={{display:{xs:"none",sm:"block"},height:"100vh"}}>
            <Box position="fixed">
                <Typography variant="h6" color={'white'}>Deckbuilder</Typography>
            </Box>
        </Box>
        </>
    )
}

export default Rightbar