import { Close } from "@mui/icons-material";
import { Box, Button, Drawer, FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { useEffect, useState } from "react";


export const OPTCGLdrCardDrawer = ({ open, onClose, selectedImage, setSelectedImage }) => {
    const [boosterFilter, setBoosterFilter] = useState("");
    const [colorFilter, setColorFilter] = useState("");
    const [slidePosition, setSlidePosition] = useState(100);
    const [dataList, setDataList] = useState([]);  // Array to store fetched data
    const boosters = ['OP01', 'OP02', 'OP03', 'OP04', 'OP05'];
    const colors = ['Red', 'Blue', 'Green', 'Yellow', 'Purple', 'Black'];

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

    const filteredDataList = dataList.filter(item => {
        const matchesBooster = !boosterFilter || item.booster === boosterFilter;
        const matchesColor = !colorFilter || item.color === colorFilter;

        return matchesBooster && matchesColor;
    });


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
                <Box display='flex' justifyContent='space-between' mb={2}>
                    <FormControl variant="outlined" size="small" style={{ marginRight: '15px' }}>
                        <InputLabel>Booster</InputLabel>
                        <Select
                            value={boosterFilter}
                            onChange={(e) => setBoosterFilter(e.target.value)}
                            label="Booster"
                        >
                            <MenuItem value="">
                                <em>None</em>
                            </MenuItem>
                            {boosters.map(booster => (
                                <MenuItem key={booster} value={booster}>
                                    {booster}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <FormControl variant="outlined" size="small">
                        <InputLabel>Color</InputLabel>
                        <Select
                            value={colorFilter}
                            onChange={(e) => setColorFilter(e.target.value)}
                            label="Color"
                        >
                            <MenuItem value="">
                                <em>None</em>
                            </MenuItem>
                            {colors.map(color => (
                                <MenuItem key={color} value={color}>
                                    {color}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Box>
                <Box flexGrow={1} display='flex' flexDirection='column' >
                    <Box textAlign={"center"} sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: '10px' }}>
                        {filteredDataList.map((item, index) => (
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