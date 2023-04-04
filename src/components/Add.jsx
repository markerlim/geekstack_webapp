import {Box, Fab, Modal, Tooltip, styled } from '@mui/material'
import {Build} from'@mui/icons-material'
import React from 'react'
import { useState } from 'react'

const StyledModal = styled(Modal)({
    display:"flex",
    alignItems:"center",
    justifyContent:"center"
})

const Add = () => {
    const [open, setOpen] = useState(false)
    return (
        <>
        <Tooltip onClick={e=>setOpen(true)} title="Create Deck" sx={{position:"fixed", bottom:20, left:{xs:"calc(50% - 25px)",md:30}}}>
            <Fab color="primary" aria-label="add">
                <Build />
            </Fab>
        </Tooltip>
        <StyledModal
            open={open}
            onClose={(e)=>setOpen(false)}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box width={400} height={200} bgcolor="white" p={3} borderRadius={5}>
                hello
            </Box>
        </StyledModal>
        </>
    )
}
export default Add