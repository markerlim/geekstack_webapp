import { Box, Modal } from "@mui/material";
import React, { useState } from "react";

const FAQReportError = () => {
    const [zoomImage, setZoomImage] = useState(false);
    const [imageSrc, setImageSrc] =useState("");

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

    const handleImageZoom = (img) =>{
        setZoomImage(true)
        setImageSrc(img)
    }

    const handleCloseModal = () => {
        setImageSrc("");
        setZoomImage(false);
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '10px', textAlign: 'start', color: '#ffffff' }}>
            <Box sx={HeaderStyle}>
                <Box component={'img'} src="/FAQimages/step1.webp" width={'100px'}/>
            </Box>
            <Box sx={DescriptionStyle}>
                <img src="/FAQimages/ErrReport1.webp" alt="ErrReport1" loading="lazy" style={GuideImageStyle} onClick={() => handleImageZoom("/FAQimages/ErrReport1.webp")}/>
                <span>Click on the top right corner icon with the red exclaimation mark.</span>
            </Box>
            <Box sx={HeaderStyle}>
                <Box component={'img'} src="/FAQimages/step2.webp" width={'100px'} />
            </Box>
            <Box sx={DescriptionStyle}>
                <img src="/FAQimages/ErrReport2.webp" alt="ErrReport2" loading="lazy" style={GuideImageStyle} onClick={() => handleImageZoom("/FAQimages/ErrReport2.webp")}/>
                <span>A pop up will appear. Do note that selecting the type of error will result in different format for reporting. [Refer to next step] </span>
            </Box>
            <Box sx={DescriptionStyle} justifyContent={'center'}>
                <Box sx={{display:'flex',flexDirection:'column',alignItems:'center',gap:'5px'}}>
                    <span>Translation</span>
                    <img src="/FAQimages/ErrReport3.webp" alt="ErrReport3" loading="lazy" style={GuideImageStyle} onClick={() => handleImageZoom("/FAQimages/ErrReport3.webp")}/>
                </Box>
                <Box sx={{display:'flex',flexDirection:'column',alignItems:'center',gap:'5px'}}>
                    <span>Format</span>
                    <img src="/FAQimages/ErrReport4.webp" alt="ErrReport4" loading="lazy" style={GuideImageStyle} onClick={() => handleImageZoom("/FAQimages/ErrReport4.webp")}/>
                </Box>
            </Box>
            <Box sx={HeaderStyle}>
                <Box component={'img'} src="/FAQimages/step3.webp" width={'100px'} />
            </Box>
            <Box sx={DescriptionStyle}>
                <img src="/FAQimages/ErrReport5.webp" alt="ErrReport5" loading="lazy" style={GuideImageStyle} onClick={() => handleImageZoom("/FAQimages/ErrReport5.webp")}/>
                <span>Under Translation, it will then prompt you to indicate particularly which part of the translation.</span>
            </Box>
            <Box sx={HeaderStyle}>
                <Box component={'img'} src="/FAQimages/step4.webp" width={'100px'} />
            </Box>
            <Box sx={DescriptionStyle}>
                <img src="/FAQimages/ErrReport6.webp" alt="ErrReport6" loading="lazy" style={GuideImageStyle} onClick={() => handleImageZoom("/FAQimages/ErrReport6.webp")}/>
                <span>Once you are done entering the details, click on submit</span>
            </Box>
            <Modal open={zoomImage} onClose={handleCloseModal} sx={{display:'flex',justifyContent:'center',alignItems:'center'}}>
                <img src={imageSrc} alt="zoomImage" style={{width:'80vw',maxWidth:'300px',borderRadius:'3vw',border:'2px #7C4fff solid'}}/>
            </Modal>
        </Box>
    )
}

export default FAQReportError