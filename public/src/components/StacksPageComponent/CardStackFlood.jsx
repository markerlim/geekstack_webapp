import { Box } from "@mui/material";
import React from "react";
import { MoreHoriz } from "@mui/icons-material";

const CardStackFlood = () => {
    const dataset = [{
        src: '/UD/JJK-2-004.webp', photoURL: '/UD/JJK-2-004.webp', name: 'Satoru Gojo',
        content: 'What a great deck to play with!\nHope to be able to play here again!\nDefinitely an enjoyable experience.',
    }, {
        src: '/UD/JJK-2-003.webp', photoURL: '/UD/JJK-2-003.webp', name: 'Suguru Getou',
        content: 'What a great deck to play with!\nHope to be able to play here again!\nDefinitely an enjoyable experience.',
    }, {
        src: '/UD/JJK-2-004.webp', photoURL: '/UD/JJK-2-004.webp', name: 'Satoru Gojo',
        content: 'What a great deck to play with!\nHope to be able to play here again!\nDefinitely an enjoyable experience.',
    }, {
        src: '', photoURL: '/UD/JJK-2-003.webp', name: 'Suguru Getou',
        content: 'What a great deck to play with!\nHope to be able to play here again!\nDefinitely an enjoyable experience.',
    }, {
        src: '/UD/JJK-2-003.webp', photoURL: '/UD/JJK-2-003.webp', name: 'Suguru Getou',
        content: 'What a great deck to play with!\nHope to be able to play here again!\nDefinitely an enjoyable experience.',
    }, {
        src: '/UD/JJK-2-003.webp', photoURL: '/UD/JJK-2-003.webp', name: 'Suguru Getou',
        content: 'What a great deck to play with!\nHope to be able to play here again!\nDefinitely an enjoyable experience.',
    }]
    const leftColumnCards = dataset.filter((_, index) => index % 2 === 0);
    const rightColumnCards = dataset.filter((_, index) => index % 2 !== 0);
    return (
        <Box sx={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent:'center',
            gap: '10px',
            overflow: 'auto',
            alignItems: 'start',
            height: 'calc(100vh - 204px)',
            paddingBottom: '50px',
            paddingTop: '20px',
            width: { xs: '100vw', sm: '100vw', md: 'calc(100vw - 100px)' },
        }}>
            <Box sx={{ display: 'flex', flexDirection: 'column',alignItems:'center', gap: '10px' }}>
                {leftColumnCards.map((data, index) => (
                    <Box key={index} sx={{
                        paddingTop: '0px',
                        height: data.src ? '230px' : '120px',
                        backgroundColor: '#f2f3f8',
                        borderRadius: '10px',
                        width:'170px',
                        position: 'relative',
                        overflow: 'hidden',
                    }}>
                        <>
                            <Box key={index} sx={{
                                paddingTop: '0px',
                                height: data.src ? '230px' : '120px',
                                width: '100%', // Adjust width to fill the column
                                backgroundColor: '#f2f3f8',
                                borderRadius: '10px',
                                position: 'relative',
                                border: 'none',
                                overflow: 'hidden',
                            }}>
                                <Box sx={{ width: 'inherit', height: data.src ? '140px' : '0px', display: 'flex', justifyContent: 'center', alignItems: 'start', backgroundColor: '#26262d', overflow: 'hidden', }}>
                                    {data.src && <img src={data.src} alt='name' style={{ width: '200px', height: 'calc(200px * 1.395)', marginTop: '-45px' }} />}
                                </Box>
                                <Box sx={{ display: 'flex', flexDirection: 'row', position: 'absolute', left: '0px', top: data.src ? '120px' : '0px', }}>
                                    <Box sx={{ borderRadius: '30px', border: '3px solid #f2f3f8', width: '40px', height: '40px', overflow: 'hidden' }}>
                                        <img src={data.photoURL} alt={data.photoURL} style={{ width: '40px', height: 'auto' }} />
                                    </Box>
                                    <Box sx={{ fontSize: '14px', color: '#121212', fontWeight: '900', marginTop: data.src ? '22px' : '10px', }}>{data.name}</Box>
                                </Box>
                                <Box sx={{
                                    display: 'flex', flexDirection: 'column', gap: '7px', width: '160px',
                                    color: '#121212', height: data.src ? '70px' : '100px', fontSize: '10px', paddingLeft: '10px', paddingRight: '5px', justifyContent: 'start', flex: 'none'
                                }}>
                                    <Box sx={{ height: data.src ? '16px' : '40px', }}></Box>
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
                        </>
                    </Box>
                ))}
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column',alignItems:'center', gap: '10px' }}>
                {rightColumnCards.map((data, index) => (
                    <Box key={index} sx={{
                        paddingTop: '0px',
                        height: data.src ? '230px' : '120px',
                        width:'170px',
                        backgroundColor: '#f2f3f8',
                        borderRadius: '10px',
                        position: 'relative',
                        overflow: 'hidden',
                    }}>
                        <>
                            <Box key={index} sx={{
                                paddingTop: '0px',
                                height: data.src ? '230px' : '120px',
                                width: '100%', // Adjust width to fill the column
                                backgroundColor: '#f2f3f8',
                                borderRadius: '10px',
                                position: 'relative',
                                border: 'none',
                                overflow: 'hidden',
                            }}>
                                <Box sx={{ width: 'inherit', height: data.src ? '140px' : '0px', display: 'flex', justifyContent: 'center', alignItems: 'start', backgroundColor: '#26262d', overflow: 'hidden', }}>
                                    {data.src && <img src={data.src} alt='name' style={{ width: '200px', height: 'calc(200px * 1.395)', marginTop: '-45px' }} />}
                                </Box>
                                <Box sx={{ display: 'flex', flexDirection: 'row', position: 'absolute', left: '0px', top: data.src ? '120px' : '0px', }}>
                                    <Box sx={{ borderRadius: '30px', border: '3px solid #f2f3f8', width: '40px', height: '40px', overflow: 'hidden' }}>
                                        <img src={data.photoURL} alt={data.photoURL} style={{ width: '40px', height: 'auto' }} />
                                    </Box>
                                    <Box sx={{ fontSize: '14px', color: '#121212', fontWeight: '900', marginTop: data.src ? '22px' : '10px', }}>{data.name}</Box>
                                </Box>
                                <Box sx={{
                                    display: 'flex', flexDirection: 'column', gap: '7px', width: '160px',
                                    color: '#121212', height: data.src ? '70px' : '100px', fontSize: '10px', paddingLeft: '10px', paddingRight: '5px', justifyContent: 'start', flex: 'none'
                                }}>
                                    <Box sx={{ height: data.src ? '16px' : '40px', }}></Box>
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
                        </>
                    </Box>
                ))}
            </Box>
        </Box>
    );
};

export default CardStackFlood
