import {Box, Fab, Tooltip, Typography } from '@mui/material'
import {Build} from'@mui/icons-material'
import React from 'react'

const Rightbar = () => {
    return(
        <>        
        <Tooltip title="Create Deck" sx={{position:"fixed", bottom:20, right:{xs:"calc(50% - 25px)",md:30}}}>
            <Fab color="primary" aria-label="add">
                <Build />
            </Fab>
        </Tooltip>
        <Box bgcolor="purple"flex={3} p={2} sx={{display:{xs:"none",sm:"block"}}}>
            <Box position="fixed">
                <Typography variant="h6">Deckbuilder</Typography>
            </Box>
        </Box>
        </>
    )
}

export default Rightbar