import { Box } from "@mui/material";
import React from "react";
import { MoreHoriz } from "@mui/icons-material";
import SingleCardStack from "./SingleCardStack";

const CardStackFlood = () => {
    const dataset = [{
        src: '/UD/JJK-2-004.webp', photoURL: '/UD/JJK-2-004.webp', name: 'Satoru Gojo',
        content: 'What a great deck to play with!\nHope to be able to play here again!\nDefinitely an enjoyable experience.',
        effect:'test'
    }, {
        src: '/UD/JJK-2-003.webp', photoURL: '/UD/JJK-2-003.webp', name: 'Suguru Getou',
        content: 'What a great deck to play with!\nHope to be able to play here again!\nDefinitely an enjoyable experience.',
        effect:'test'
    }, {
        src: '/UD/JJK-2-004.webp', photoURL: '/UD/JJK-2-004.webp', name: 'Satoru Gojo',
        content: 'What a great deck to play with!\nHope to be able to play here again!\nDefinitely an enjoyable experience.',
        effect:'test'
    }, {
        src: '', photoURL: '/UD/JJK-2-003.webp', name: 'Suguru Getou',
        content: 'What a great deck to play with!\nHope to be able to play here again!\nDefinitely an enjoyable experience.',
        effect:'test'
    }, {
        src: '/UD/JJK-2-003.webp', photoURL: '/UD/JJK-2-003.webp', name: 'Suguru Getou',
        content: 'What a great deck to play with!\nHope to be able to play here again!\nDefinitely an enjoyable experience.',
        effect:'test'
    }, {
        src: '/UD/JJK-2-003.webp', photoURL: '/UD/JJK-2-003.webp', name: 'Suguru Getou',
        content: 'What a great deck to play with!\nHope to be able to play here again!\nDefinitely an enjoyable experience.',
        effect:'test'
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
                        <SingleCardStack data={data} index={index}/>
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
                        <SingleCardStack data={data} index={index}/>
                    </Box>
                ))}
            </Box>
        </Box>
    );
};

export default CardStackFlood
