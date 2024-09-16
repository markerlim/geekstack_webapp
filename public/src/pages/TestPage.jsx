import React from 'react';
import { Box } from '@mui/material';
import html2canvas from 'html2canvas';

const TestExport = () => {
    const handleExportClick = () => {
        const exportElement = document.getElementById('TestExport');
        if (exportElement) {
            html2canvas(exportElement, { useCORS: true }).then((canvas) => {
                const imgData = canvas.toDataURL('image/jpg');
                const link = document.createElement('a');
                link.href = imgData;
                link.download = 'exported_image.jpg';
                link.click();
            }).catch((error) => {
                console.error('Error exporting image:', error);
            });
        }
    };

    return (
        <div>
            <Box id="TestExport" sx={{ width: '500px', height: '500px', padding: '20px', backgroundColor: 'lightgray' }}>
                <img
                    src="https://storage.googleapis.com/geek-stack.appspot.com/UD/AOT-1-013_ALT.webp"
                    alt="test"
                    style={{ width: '200px', height: 'auto' }}
                />
            </Box>
            <button onClick={handleExportClick}>Export</button>
        </div>
    );
};

export default TestExport;
