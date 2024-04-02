import React from 'react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { Close } from '@mui/icons-material';

const NotificationModal = ({ open, onClose }) => {
    return (
        <Modal
            open={open}
            onClose={onClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: "80vw", maxWidth: '400px', bgcolor: '#26262d', borderRadius: '20px', boxShadow: 24, p: '20px' }}>
                <div className='hide-scrollbar' style={{color:'#f2f3f8',marginBottom:'10px',height:'300px',overflow:'auto',}}><strong style={{ color:'#f2f3f8' }}>As of 30th March:</strong>
                    <Box sx={{overflow:'hidden',height:'150px',width:'inherit',marginTop:'10px',marginBottom:'10px',borderRadius:'5px'}}>
                        <img src="/images/deckcover.webp" style={{width:'100%'}} alt="screen"/>
                    </Box>
                    <li>Added feature to build with Alternate Arts.</li>
                    <li>However it is important to note that, all previously built decks are no longer "unbuildable". <br/><strong style={{color:'#ff6961'}}>PLEASE DELETE THEM</strong></li>
                    <li>Onepiece Deckbuilder is fully functional</li>
                </div>
                <Button onClick={onClose} sx={{width:'100%',bgcolor:'#ff6961'}}><Close/></Button>
            </Box>
        </Modal>
    );
};

export default NotificationModal;
