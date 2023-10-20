import { Box } from "@mui/material";
import React from "react";

const FAQReportError = () => {
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
        fontSize: '13px'
    };

    const GuideImageStyle = {
        width: '30vw',
        borderRadius: '10px'
    };
    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '10px', textAlign: 'start', color:'#ffffff'}}>
            Report via Discord
        </Box>
    )
}

export default FAQReportError