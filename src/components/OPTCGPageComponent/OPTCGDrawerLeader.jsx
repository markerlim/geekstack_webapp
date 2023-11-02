import { Close } from "@mui/icons-material";
import { Box, Button, Dialog, Drawer, FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { useEffect, useState } from "react";


export const OPTCGLdrCardDrawer = ({ open, onClose, setSelectedImage, setSelectedCardid }) => {
    const [boosterFilter, setBoosterFilter] = useState("");
    const [colorFilter, setColorFilter] = useState("");
    const [slidePosition, setSlidePosition] = useState(100);
    const [dataList, setDataList] = useState([]); 
    const boosters = ['OP01', 'OP02', 'OP03', 'OP04', 'OP05', 'OPST01'
        , 'OPST02', 'OPST03', 'OPST04', 'OPST05', 'OPST06', 'OPST07', 'OPST08', 'OPST09', 'OPST10'];
    const colors = ['Red', 'Blue', 'Green', 'Yellow', 'Purple', 'Black'];

    const opldrurl = `https://ap-southeast-1.aws.data.mongodb-api.com/app/data-fwguo/endpoint/onepieceLeader?secret=${process.env.REACT_APP_SECRET_KEY}`;

    useEffect(() => {
        fetch(opldrurl)
            .then(response => response.json())
            .then(data => {
                setDataList(data.data);
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
        const colorArray = typeof item.color === 'string' ? item.color.split('/') : [];
        const matchesColor = !colorFilter || colorArray.includes(colorFilter);
    
        return matchesBooster && matchesColor;
    });

    const handleClose = () => {
        setTimeout(() => {
            onClose(); // then close
        }, 300); // match the duration of the animation
    };

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [dialogImageSrc, setDialogImageSrc] = useState(null);
    const [dialogEffect, setDialogEffect] = useState(null);

    const handleContextMenu = (e, imageSrc, effects) => {
        e.preventDefault();  // prevent the context menu from actually appearing
        setDialogImageSrc(imageSrc);
        setDialogEffect(effects);
        setIsDialogOpen(true);
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
                    width: '100%',
                    height: 'fit-content',
                    maxHeight: '90vh',
                    bottom: { xs: slidePosition, sm: slidePosition, },
                    transform: {
                        xs: `translateY(${slidePosition}%)`,
                        sm: `translateY(${slidePosition}%)`,
                    },
                    transition: "bottom 300ms ease-in-out",
                },
            }}
        >
            <Box display="flex" flexDirection="column" minHeight="100%" minWidth={0} overflowY={"auto"} p={3}>
                <Box flexGrow={1} display='flex' flexDirection='column' >
                    <Box sx={{ position: 'sticky', bottom: 0, backgroundColor: '#121212', display: { xs: 'none', sm: 'none', md: 'flex' }, paddingTop: '10px', paddingBottom: '10px', justifyContent: 'center', alignItems: 'center' }}>
                        <FormControl variant="outlined" size="small" sx={{ marginRight: '15px', backgroundColor: '#121212', width: '100px', borderRadius: '5px' }}>
                            <InputLabel sx={{
                                color: '#c8a2c8',
                                '&.Mui-focused': {
                                    color: '#c8a2c8',
                                }
                            }}>Booster</InputLabel>
                            <Select
                                value={boosterFilter}
                                onChange={(e) => setBoosterFilter(e.target.value)}
                                label="Booster"
                                sx={{
                                    color: "#c8a2c8",
                                    '& .MuiOutlinedInput-root': {
                                        '& fieldset': {
                                            borderColor: '#c8a2c8',
                                        },
                                        '&:hover fieldset': {
                                            borderColor: '#c8a2c8',
                                        },
                                        '&.Mui-focused fieldset': {
                                            borderColor: '#c8a2c8',
                                            borderWidth: '2px',
                                        },
                                    },
                                    '& .MuiSelect-icon': {
                                        color: '#c8a2c8',
                                    },
                                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                        borderColor: '#c8a2c8',
                                    }
                                }}
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
                        <FormControl variant="outlined" size="small" sx={{ marginRight: '15px', backgroundColor: '#121212', width: '100px', borderRadius: '5px' }}>
                            <InputLabel sx={{
                                color: '#c8a2c8',
                                '&.Mui-focused': {
                                    color: '#c8a2c8',
                                }
                            }}>Color</InputLabel>
                            <Select
                                value={colorFilter}
                                onChange={(e) => setColorFilter(e.target.value)}
                                label="Color"
                                sx={{
                                    color: "#c8a2c8",
                                    '& .MuiOutlinedInput-root': {
                                        '& fieldset': {
                                            borderColor: '#c8a2c8',
                                        },
                                        '&:hover fieldset': {
                                            borderColor: '#c8a2c8',
                                        },
                                        '&.Mui-focused fieldset': {
                                            borderColor: '#c8a2c8',
                                            borderWidth: '2px',
                                        },
                                    },
                                    '& .MuiSelect-icon': {
                                        color: '#c8a2c8',
                                    },
                                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                        borderColor: '#c8a2c8',
                                    }
                                }}
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
                        <Button onClick={() => handleClose()}
                            sx={{
                                width: "10%", backgroundColor: "#FF6961", color: "#f2f3f8",
                                '&:hover': { color: "#FF6961" },
                            }}>
                            <Close />
                        </Button>
                    </Box>
                    <Box textAlign={"center"} sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: '10px' }}>
                        {filteredDataList.map((item, index) => (
                            <div key={index} onContextMenu={(e) => handleContextMenu(e, item.image, item.effects)}>
                                <img
                                    loading="lazy"
                                    src={item.image}
                                    draggable="false"
                                    alt="test"
                                    style={{ width: "100px", height: "140.6175px", borderRadius: "5%", border: "2px solid black", cursor: "pointer" }}
                                    onClick={() => {
                                        setSelectedImage(item.image);
                                        setSelectedCardid(item.cardid);
                                        onClose();
                                    }}
                                />
                            </div>
                        ))}
                    </Box>
                </Box>
                <Box mt={2} sx={{ display: { xs: 'none', sm: 'none', md: "flex" } }} justifyContent="center" paddingBottom='10px'>
                    <Button onClick={() => handleClose()}
                        sx={{
                            width: "80%", backgroundColor: "#FF6961", color: "#f2f3f8",
                            '&:hover': { color: "#FF6961" },
                        }}>
                        <Close />
                    </Button>
                </Box>
                <Box sx={{ position: 'sticky', bottom: 0, backgroundColor: '#121212', display: { xs: 'flex', sm: 'flex', md: 'none' }, paddingTop: '10px', paddingBottom: '10px', justifyContent: 'center', alignItems: 'center' }}>
                    <FormControl variant="outlined" size="small" sx={{ marginRight: '15px', backgroundColor: '#121212', width: '100px', borderRadius: '5px' }}>
                        <InputLabel sx={{
                            color: '#c8a2c8',
                            '&.Mui-focused': {
                                color: '#c8a2c8',
                            }
                        }}>Booster</InputLabel>
                        <Select
                            value={boosterFilter}
                            onChange={(e) => setBoosterFilter(e.target.value)}
                            label="Booster"
                            sx={{
                                color: "#c8a2c8",
                                '& .MuiOutlinedInput-root': {
                                    '& fieldset': {
                                        borderColor: '#c8a2c8',
                                    },
                                    '&:hover fieldset': {
                                        borderColor: '#c8a2c8',
                                    },
                                    '&.Mui-focused fieldset': {
                                        borderColor: '#c8a2c8',
                                        borderWidth: '2px',
                                    },
                                },
                                '& .MuiSelect-icon': {
                                    color: '#c8a2c8',
                                },
                                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                    borderColor: '#c8a2c8',
                                }
                            }}
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
                    <FormControl variant="outlined" size="small" sx={{ marginRight: '15px', backgroundColor: '#121212', width: '100px', borderRadius: '5px' }}>
                        <InputLabel sx={{
                            color: '#c8a2c8',
                            '&.Mui-focused': {
                                color: '#c8a2c8',
                            }
                        }}>Color</InputLabel>
                        <Select
                            value={colorFilter}
                            onChange={(e) => setColorFilter(e.target.value)}
                            label="Color"
                            sx={{
                                color: "#c8a2c8",
                                '& .MuiOutlinedInput-root': {
                                    '& fieldset': {
                                        borderColor: '#c8a2c8',
                                    },
                                    '&:hover fieldset': {
                                        borderColor: '#c8a2c8',
                                    },
                                    '&.Mui-focused fieldset': {
                                        borderColor: '#c8a2c8',
                                        borderWidth: '2px',
                                    },
                                },
                                '& .MuiSelect-icon': {
                                    color: '#c8a2c8',
                                },
                                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                    borderColor: '#c8a2c8',
                                }
                            }}
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
                    <Button onClick={() => handleClose()}
                        sx={{
                            width: "40%", backgroundColor: "#FF6961", color: "#f2f3f8",
                            '&:hover': { color: "#FF6961" },
                        }}>
                        <Close />
                    </Button>
                </Box>
            </Box>
            <Dialog
                open={isDialogOpen}
                onClose={() => setIsDialogOpen(false)}
                PaperProps={{ sx: { backgroundColor: '#121212' } }}
            >
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '10px', gap: '10px' }}>
                    <img src={dialogImageSrc} alt="Selected" style={{ width: '220px' }} />
                    <span style={{ color: '#ffffff' }}>{dialogEffect}</span>
                </Box>
            </Dialog>
        </Drawer >
    );
};