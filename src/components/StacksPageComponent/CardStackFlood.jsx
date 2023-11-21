import { Box } from "@mui/material";
import React from "react";
import { MoreHoriz } from "@mui/icons-material";

const CardStackFlood = () => {
    const dataset = [{
        src: '/UD/JJK-2-004.webp', name: 'Satoru Gojo',
        content: 'What a great deck to play with!\nHope to be able to play here again!\nDefinitely an enjoyable experience.',
    }, {
        src: '/UD/JJK-2-004.webp', name: 'Satoru Gojo',
        content: 'What a great deck to play with!\nHope to be able to play here again!\nDefinitely an enjoyable experience.',
    }, {
        src: '/UD/JJK-2-003.webp', name: 'Suguru Getou',
        content: 'What a great deck to play with!\nHope to be able to play here again!\nDefinitely an enjoyable experience.',
    }, {
        src: '/UD/JJK-2-003.webp', name: 'Suguru Getou',
        content: 'What a great deck to play with!\nHope to be able to play here again!\nDefinitely an enjoyable experience.',
    }, {
        src: '/UD/JJK-2-003.webp', name: 'Suguru Getou',
        content: 'What a great deck to play with!\nHope to be able to play here again!\nDefinitely an enjoyable experience.',
    }]
    return (
        <Box sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', overflow: 'auto', justifyContent: 'center', height: 'calc(100vh - 204px)', paddingBottom: '50px', width: { xs: '100vw', sm: '100vw', md: 'calc(100vw - 100px)' }, gap: '15px', paddingTop: '20px' }}>
            {dataset.map((data) => (<>
                <Box sx={{backgroundColor:'#D3D3D3',borderRadius:'10px',outlineOffset:'4px', height:'234px'}}>
                    <Box sx={{ paddingTop: '0px', height:'230px', width:'180px', backgroundColor: '#f2f3f8',transform: 'translateY(-4px)', 
                    borderRadius: '10px', paddingLeft: '0px', paddingRight: '0px', position: 'relative', 
                    border: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', overflow: 'hidden',
                    '&:hover': {
                        transform: 'translateY(0px)',
                        backgroundColor: '#e0e1e5'
                    }}}>
                        <Box sx={{ width: 'inherit', height: '140px', display: 'flex', justifyContent: 'center', alignItems: 'start', backgroundColor: '#26262d', overflow: 'hidden', }}>
                            <img src={data.src} alt='name' style={{ width: '200px', height: 'calc(200px * 1.395)', marginTop: '-45px' }} />
                        </Box>
                        <Box sx={{ display: 'flex', flexDirection: 'row', position: 'absolute', left: '0px', top: '120px', }}>
                            <Box sx={{ borderRadius: '30px',border:'3px solid #f2f3f8', width: '40px', height: '40px', overflow: 'hidden' }}>
                                <img src={data.src} alt={data.src} style={{ width: '40px', height: 'auto' }} />
                            </Box>
                            <Box sx={{ fontSize: '14px', color: '#121212', fontWeight: '900',marginTop:'22px' }}>{data.name}</Box>
                        </Box>
                        <Box sx={{
                            display: 'flex', flexDirection: 'column', gap: '7px', width: '170px',
                            color: '#121212', height: '70px', fontSize: '10px', paddingLeft: '5px', paddingRight: '5px', justifyContent: 'start', flex: 'none'
                        }}>
                            <Box sx={{ height: '16px' }}></Box>
                            {data.content.split('\n').map((line, i) => (
                                <React.Fragment key={i}>
                                    {line}
                                    <br />
                                </React.Fragment>
                            ))}
                        </Box>
                        <Box sx={{ position: "absolute", right: '10px', bottom: '0px', color: '#D3D3D3' }}>
                            <MoreHoriz />
                        </Box>
                    </Box>
                </Box>
            </>
            ))}
        </Box>
    )
}

export default CardStackFlood
