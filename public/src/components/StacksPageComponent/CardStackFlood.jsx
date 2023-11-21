import { Box } from "@mui/material";
import React from "react";
import StackCardDecklistBtn from "./StackCardDecklistBtn";
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
        <Box sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', overflow:'auto', justifyContent: 'center',height:'calc(100vh - 204px)',paddingBottom:'50px', width: { xs: '100vw', sm: '100vw', md: 'calc(100vw - 100px)' }, gap: '15px', paddingTop: '20px' }}>
            {dataset.map((data) => (<>
                <Box sx={{ paddingTop:'0px',paddingBottom:'10px', width: '45vw', backgroundColor: '#f2f3f8', borderRadius: '10px', paddingLeft: '0px',PaddingRight:'0px', position: 'relative', border: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', overflow: 'hidden' }}>
                    <Box sx={{ width: 'inherit', height: '140px', display: 'flex', justifyContent: 'center',alignItems:'start',backgroundColor: '#26262d',overflow:'hidden', }}>
                        <img src={data.src} alt='name' style={{ width: '45vw', height: 'calc(45vw * 1.395)',marginTop:'-20px'}} />
                    </Box>
                    <Box sx={{ display: 'flex', flexDirection: 'row', position: 'absolute', left: '0px',gap:'5px', top: '120px', alignItems: 'end' }}>
                        <Box sx={{ borderRadius: '20px', width: '40px', height: '40px', overflow: 'hidden' }}>
                            <img src={data.src} alt={data.src} style={{ width: '40px', height: 'auto' }} />
                        </Box>
                        <Box sx={{ fontSize: '14px', color: '#121212',fontWeight:'900'}}>{data.name}</Box>
                    </Box>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '7px', width: 'calc(45vw - 10px)',
                    color:'#121212', height: '70px',fontSize:'10px',paddingLeft:'5px',paddingRight:'5px',justifyContent: 'start', flex: 'none' }}>
                        <Box sx={{height:'16px'}}></Box>
                        {data.content.split('\n').map((line, i) => (
                            <React.Fragment key={i}>
                                {line}
                                <br />
                            </React.Fragment>
                        ))}
                    </Box>
                    <Box sx={{position:"absolute",right:'10px',bottom:'0px',color:'#D3D3D3'}}>
                        <MoreHoriz/>
                    </Box>
                </Box>
            </>
            ))}
        </Box>
    )
}

export default CardStackFlood
