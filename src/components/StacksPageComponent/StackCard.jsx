import { Box } from "@mui/material";
import React from "react";
import StackCardDecklistBtn from "./StackCardDecklistBtn";

const StackCard = () => {
    const dataset = [{
        src: '/UD/JJK-2-004.webp', name: 'Satoru Gojo',
        content: 'What a great deck to play with!\nHope to be able to play here again!\nDefinitely an enjoyable experience.',
    }, {
        src: '/UD/JJK-2-003.webp', name: 'Suguru Getou',
        content: 'What a great deck to play with!\nHope to be able to play here again!\nDefinitely an enjoyable experience.',
    }]
    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', width:{xs:'100vw',sm:'100vw',md:'calc(100vw - 100px)'}, gap: '15px', paddingTop: '20px' }}>
            {dataset.map((data) => (<>
                <Box sx={{ width: '100vw', paddingLeft: '30px', display: 'flex', flexDirection: 'column', gap: '1px' }}>
                    <Box sx={{ display: 'flex', flexDirection: 'row', gap: '7px', alignItems: 'top' }}>
                        <Box sx={{ borderRadius: '20px', width: '40px', height: '40px', overflow: 'hidden' }}>
                            <img src={data.src} alt={data.src} style={{ width: '40px', height: 'auto' }} />
                        </Box>
                        <Box sx={{ height: '20px' }} />
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '5px', paddingTop: '5px', fontSize: '13px', paddingRight: '10px' }}>
                            <Box sx={{ fontSize: '16px' }}>{data.name}</Box>
                            <Box sx={{ width: 'calc(100vw - 150px' }}>
                                {data.content.split('\n').map((line, i) => (
                                    <React.Fragment key={i}>
                                        {line}
                                        <br />
                                    </React.Fragment>
                                ))}
                            </Box>
                            <br />
                            <StackCardDecklistBtn />
                        </Box>
                    </Box>
                </Box>
                <Box sx={{ height: '0.5px', width: '100vw', backgroundColor: '#3F3754' }}><br /></Box>
            </>
            ))}
        </Box>
    )
}

export default StackCard
