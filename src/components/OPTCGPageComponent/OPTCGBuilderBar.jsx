    import { MoreVert } from "@mui/icons-material";
    import { Box, Button, Collapse, IconButton, Menu, MenuItem, TextField } from "@mui/material";
    import React, { useEffect, useState } from "react";
    import { OPTCGLdrCardDrawer } from "./OPTCGDrawerLeader";

    const OPTCGBuilderBar = () => {
        const [deckName, setDeckName] = useState("PirateKing!");
        const [viewDeckbar, setViewDeckbar] = useState(false);
        const [openModal, setOpenModal] = useState(false);
        const [selectedImage, setSelectedImage] = useState("/OPTCG/OP01JP/OP01-001_p1.webp");
        const [anchorEl, setAnchorEl] = useState(null);
        const [showPadding, setShowPadding] = useState(false);

        useEffect(() => {
            if (viewDeckbar) {
                setShowPadding(true);
            } else {
                // 300ms is the default transition duration for Collapse.
                // Adjust if you've set a different duration.
                setTimeout(() => {
                    setShowPadding(false);
                }, 300);
            }
            // Clear the timeout when the component is unmounted
            return () => clearTimeout();
        }, [viewDeckbar]);

        const handleMenuOpen = (event) => {
            setAnchorEl(event.currentTarget);
        };

        const handleMenuClose = () => {
            setAnchorEl(null);
        };

        const handleOpenModal = () => {
            setOpenModal(true);
        };

        const handleCloseModal = () => {
            setOpenModal(false);
        };

        return (
            <Box sx={{ width: "100%", paddingTop: showPadding ? "10px":"0px",paddingBottom: showPadding ? "10px":"0px",paddingLeft: "10px", paddingRight:"10px", backgroundColor: "#F2F3F8", color: "#121212", display: 'flex' }}>
                <Collapse in={viewDeckbar}>
                    <Box sx={{ display: 'flex', flexDirection: 'row', gap: '10px',alignItems:'center' }}>
                        <Box sx={{
                            width: { xs: '60px', sm: '95px' }, height: { xs: '60px', sm: '95px' }, flex: '0 0 auto',
                            border: '4px solid #4a2f99', overflow: 'hidden', borderRadius: '10px',
                            display: 'flex', justifyContent: 'center', alignItems: 'center'
                        }}
                            onClick={() => handleOpenModal()}>
                            <img style={{ width: '110%', marginTop: '40%' }} src={selectedImage} alt="ldr" />
                        </Box>
                        <Box sx={{ display: 'flex', flexDirection: {xs:'row',sm:'column'}, gap: '10px' }}>
                            <TextField
                                label="Deck Name"
                                variant="outlined"
                                size="small"
                                value={deckName}
                                onChange={(event) => setDeckName(event.target.value)}
                                inputProps={{ style: { color: '#121212' } }}
                                sx={{ '& .MuiInputLabel-filled': { color: '#121212' }, '& .MuiFilledInput-input': { color: '#121212' } }}
                            />
                            <Box sx={{ display: { xs: 'flex', sm: 'none' } }}>
                                <IconButton onClick={handleMenuOpen}>
                                    <MoreVert />
                                </IconButton>
                                <Menu
                                    anchorEl={anchorEl}
                                    open={Boolean(anchorEl)}
                                    onClose={handleMenuClose}
                                >
                                    <MenuItem onClick={handleMenuClose}>sort</MenuItem>
                                    <MenuItem onClick={handleMenuClose}>save</MenuItem>
                                    <MenuItem onClick={handleMenuClose}>load</MenuItem>
                                    <MenuItem onClick={handleMenuClose}>export</MenuItem>
                                </Menu>
                            </Box>
                            <Box sx={{ display: { xs: 'none', sm: 'flex' }, flexDirection: 'row', gap: '10px' }}>
                                <Button sx={{ fontSize: '10px', bgcolor: '#4a2f99', color: '#f2f3f8', '&:hover': { bgcolor: '#240056', color: '#7C4FFF' } }}>sort</Button>
                                <Button sx={{ fontSize: '10px', bgcolor: '#4a2f99', color: '#f2f3f8', '&:hover': { bgcolor: '#240056', color: '#7C4FFF' } }}>save</Button>
                                <Button sx={{ fontSize: '10px', bgcolor: '#4a2f99', color: '#f2f3f8', '&:hover': { bgcolor: '#240056', color: '#7C4FFF' } }}>load</Button>
                                <Button sx={{ fontSize: '10px', bgcolor: '#4a2f99', color: '#f2f3f8', '&:hover': { bgcolor: '#240056', color: '#7C4FFF' } }}>export</Button>
                            </Box>
                        </Box>
                    </Box>
                </Collapse>
                <Button disableRipple sx={{ marginLeft: 'auto', bgcolor: '#f2f3f8', '&:hover': { bgcolor: '#f2f3f8' } }} onClick={() => setViewDeckbar(prev => !prev)}>
                    {viewDeckbar ? <><img style={{ width: '30px' }} alt="nika" src="http://localhost:3000/icons/OPIcon/nika_inner.png" /></> : <><img alt="nika" style={{ width: '30px' }} src="http://localhost:3000/icons/OPIcon/nika_outer.png" /></>}
                </Button>
                <OPTCGLdrCardDrawer
                    open={openModal}
                    onClose={handleCloseModal} 
                    selectedImage={selectedImage}
                    setSelectedImage={setSelectedImage}/>
            </Box>
        )
    }

    export default OPTCGBuilderBar