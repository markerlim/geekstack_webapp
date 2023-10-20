import { Box } from "@mui/material";
import React from "react";

const FAQAccountEdit = () => {
    const HeaderStyle = {
        display: 'flex',
        justifyContent: 'center',
        backgroundColor: '#7C4FFF',
        borderRadius: '20px',
        overflow: 'hidden'
    };
    
    const DescriptionStyle = {
        display: 'flex',
        flexDirection: 'row',
        gap: '15px',
        alignItems: 'center',
        color: '#ffffff',
        fontSize: '13px',
    };
    
    const GuideImageStyle = {
        width: '30vw',
        borderRadius: '10px'
    };
    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '10px', textAlign: 'start', }}>
            <Box sx={HeaderStyle}>
                <Box component={'img'} src="/FAQimages/step1.webp" width={'100px'} />
            </Box>
            <Box sx={DescriptionStyle}>
                <img src="/FAQimages/AccEdit1.webp" alt="AccEdit1" loading="lazy" style={GuideImageStyle} />
                <span>Click on the top right hand avatar icon</span>
            </Box>
            <Box sx={HeaderStyle}>
                <Box component={'img'} src="/FAQimages/step2.webp" width={'100px'} />
            </Box>
            <Box sx={DescriptionStyle}>
                <img src="/FAQimages/AccEdit2.webp" alt="AccEdit2" loading="lazy" style={GuideImageStyle} />
                <span>A small menu will appear, thereafter click on account</span>
            </Box>
            <Box sx={HeaderStyle}>
                <Box component={'img'} src="/FAQimages/step3.webp" width={'100px'} />
            </Box>
            <Box sx={DescriptionStyle}>
                <img src="/FAQimages/AccEdit3.webp" alt="AccEdit3" loading="lazy" style={GuideImageStyle} />
                <span>Edit the name by typing into the bar and change the image by click on the camera icon. Afterwards, press save to confirm the changes</span>
            </Box>
        </Box>
    )
}

export default FAQAccountEdit