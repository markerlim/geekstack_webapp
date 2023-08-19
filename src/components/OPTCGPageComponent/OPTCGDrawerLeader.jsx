import { Close } from "@mui/icons-material";
import { Box, Button, Drawer, Modal, useTheme, useMediaQuery } from "@mui/material";
import { useEffect, useState } from "react";


export const OPTCGLdrCardDrawer = ({ open, onClose, selectedImage, setSelectedImage }) => {
    const [showFullSize, setShowFullSize] = useState(false);
    const [slidePosition, setSlidePosition] = useState(100);
    const [dataList, setDataList] = useState([]);  // Array to store fetched data

    const opldrurl = `https://ap-southeast-1.aws.data.mongodb-api.com/app/data-fwguo/endpoint/onepieceLeader?secret=${process.env.REACT_APP_SECRET_KEY}`;

    useEffect(() => {
        fetch(opldrurl)
            .then(response => response.json())
            .then(data => {
                setDataList(data.data);  // Assuming data is an array
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }, []);

    useEffect(() => {
        if (open) {
            setSlidePosition(0); // 0% means it's in its natural position
        } else {
            setTimeout(() => {
                setSlidePosition(100); // slide it back down when closing
            }, 300); // duration of the animation
        }
    }, [open]);

    const handleClose = () => {
        setTimeout(() => {
            onClose(); // then close
        }, 300); // match the duration of the animation
    };

    return (
        <Drawer
            anchor="bottom"
            open={open}
            onClose={onClose}
            PaperProps={{
                sx: {
                    backgroundColor: '#121212',
                    borderRadius: { xs: '20px 20px 0px 0px', sm: '20px 20px 0px 0px', md: '20px 20px 20px 20px' },
                    width: { xs: '100%', sm: '100%', md: '700px' },
                    height: 'fit-content',
                    maxHeight: '90vh',
                    position: { md: 'absolute' },
                    top: { md: '50%' },
                    left: { md: '50%' },
                    bottom: { xs: slidePosition, sm: slidePosition },
                    transform: {
                        xs: `translateY(${slidePosition}%)`,
                        sm: `translateY(${slidePosition}%)`,
                        md: 'translate(-50%, -50%)'
                    },
                    transition: "transform 300ms ease-in-out",
                },
            }}
        >
            <Box display="flex" flexDirection="column" minHeight="100%" minWidth={0} overflowY={"auto"} p={3}>
                <Box flexGrow={1} display='flex' flexDirection='column' >
                    <Box textAlign={"center"} sx={{ display: 'flex', flexDirection: 'row', flexWrap:'wrap', justifyContent: 'center', gap: '10px' }}>
                        {dataList.map((item, index) => (
                            <div key={index}>
                                <img
                                    loading="lazy"
                                    src={item.image}
                                    draggable="false"
                                    alt="test"
                                    style={{ width: "100px", height: "140.6175px", borderRadius: "5%", border: "2px solid black", cursor: "pointer" }}
                                    onClick={() => {
                                        setSelectedImage(item.image)
                                        onClose();
                                    }}
                                />
                            </div>
                        ))}
                    </Box>
                </Box>
                <Box mt={2} display="flex" justifyContent="center" paddingBottom='10px'>
                    <Button onClick={() => handleClose()}
                        sx={{
                            width: "80%", backgroundColor: "#FF6961", color: "#f2f3f8",
                            '&:hover': { color: "#FF6961" },
                        }}>
                        <Close />
                    </Button>
                </Box>
            </Box>
        </Drawer >
    );
};