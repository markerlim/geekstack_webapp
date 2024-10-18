import { Box } from "@mui/material";
import React, { useCallback } from "react";
import CardFunctions from "./SingleCardStackFunc";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";



const SingleCardStack = ({ grpdata, index, setDrawerOpen, drawerOpen, deleteRefresh, setDeleteRefresh }) => {
    const data = grpdata;
    const deckuid = grpdata.id;
    const navigate = useNavigate();
    const inputRef = useRef(null);

    const handleDrawerOpen = useCallback((deckuid) => {
        navigate(`/stacks/${deckuid}`)
        setDrawerOpen(true);
    }, []);

    return (
        <>
            <Box key={index} sx={{
                paddingTop: '0px',
                height: !data.description ? '205px' : (data.selectedCards[0].imagesrc ? '240px' : '130px'),
                width: '100%', // Adjust width to fill the column
                backgroundColor: '#26262d',
                borderRadius: '10px',
                position: 'relative',
                border: 'none',
                overflow: 'hidden',
            }}
                onClick={() => handleDrawerOpen(deckuid)}>
                <Box sx={{ width: 'inherit', height: data.selectedCards[0].imagesrc ? '140px' : '0px', display: 'flex', justifyContent: 'center', alignItems: 'start', backgroundColor: '#26262d', overflow: 'hidden', }}>
                    {data.selectedCards[0].imagesrc && <img src={data.selectedCards[0].imagesrc} alt='name' style={{ width: '200px', height: 'calc(200px * 1.395)', marginTop: '-30px' }} />}
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'row', gap: '5px', position: 'absolute', left: '0px', top: data.selectedCards[0].imagesrc ? '120px' : '0px', }}>
                    <Box sx={{ borderRadius: '30px', border: '4px solid #26262d', width: '40px', height: '40px', overflow: 'hidden', flex: '0 0 auto', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#7C4FFF' }}>
                        {data.photoURL ? <img src={data.photoURL} alt={data.photoURL} style={{ width: '40px', height: 'auto', flex: '0 0 auto' }} /> :
                            <div
                                style={{
                                    display: 'none',
                                    width: '40px',
                                    height: '40px',
                                    textAlign: 'center',
                                    lineHeight: '40px',
                                    color: '#f2f3f8'
                                }}
                            >
                                {data.displayName.charAt(0).toUpperCase()}
                            </div>}
                    </Box>
                    <Box
                        sx={{
                            fontSize: {
                                xs: '12px', // Font size for small devices
                                sm: '14px', // Font size for medium devices
                                md: '16px', // Font size for large devices
                                lg: '18px', // Font size for extra large devices
                                xl: '20px'  // Default font size
                            },
                            color: '#f2f8fc',
                            fontWeight: '900',
                            marginTop: data.selectedCards[0].imagesrc ? '26px' : '10px',
                            maxWidth: '100px',
                            overflow: 'hidden',
                            whiteSpace: 'nowrap', // Prevent text from wrapping
                            textOverflow: 'ellipsis' // Show ellipsis for overflow
                        }}
                    >
                        {data.displayName}
                    </Box>
                </Box>
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '7px',
                        width: '150px',
                        color: '#f2f8fc',
                        height: !data.description ? '35px' : (data.selectedCards[0].imagesrc ? '70px' : '100px'),
                        fontSize: '10px',
                        paddingLeft: '10px',
                        paddingRight: '10px',
                        justifyContent: 'start',
                        flex: 'none',
                        overflow: 'hidden', // Hide overflow
                        display: '-webkit-box', // Use flexbox
                        WebkitBoxOrient: 'vertical', // Set orientation
                        overflow: 'hidden', // Hide overflow
                        WebkitLineClamp: 3 // Show up to 3 lines, then ellipsis
                    }}
                >
                    <Box
                        sx={{
                            height: !data.description ? '16px' : (data.selectedCards[0].imagesrc ? '25px' : '40px'),
                            overflow: 'hidden', // Hide overflow for this box too
                        }}
                    ></Box>
                    {data.description && data.description.split('\n').map((line, i) => (
                        <React.Fragment key={i}>
                            {line}
                            <br />
                        </React.Fragment>
                    ))}
                </Box>

                <Box sx={{ color: '#D3D3D3', paddingBottom: '20px' }}>
                    <CardFunctions deck={data} handleDrawerOpen={handleDrawerOpen} inputRef={inputRef}
                        deleteRefresh={deleteRefresh} setDeleteRefresh={setDeleteRefresh} />
                </Box>
            </Box>
        </>
    )
}

export default SingleCardStack;