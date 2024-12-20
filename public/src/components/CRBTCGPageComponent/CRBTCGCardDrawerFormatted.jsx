import { ArrowLeft, ArrowRight} from "@mui/icons-material";
import { Box,Modal } from "@mui/material";
import React from "react";


export const CRBTCGCardDrawerNF = ({ open, onClose, selectedCard, onSwipeLeft, onSwipeRight }) => {
  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="full-size-image"
      aria-describedby="click-to-close"
    >
      <Box sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        boxShadow: 24,
        display:'flex',
        gap:'5px',
        alignItems:'center'
      }}>
        <Box sx={{ bgcolor: '#7C4FFF', display: 'flex', justifyContent: 'center', alignItems: 'center', borderRadius: '4px' }} onClick={() => onSwipeRight()}><ArrowLeft sx={{ color: '#f2f3f8', fontSize: '30px' }} /></Box>
        <Box
          component='img'
          src={selectedCard.urlimage}
          alt="Full Size"
          sx={{ width: { xs: '80vw', sm: '400px' }, cursor: "pointer" }}
        />
        <Box sx={{ bgcolor: '#7C4FFF', display: 'flex', justifyContent: 'center', alignItems: 'center', borderRadius: '4px' }} onClick={() => onSwipeLeft()}><ArrowRight sx={{ color: '#f2f3f8', fontSize: '30px' }} /></Box>

      </Box>
    </Modal>
  );
};