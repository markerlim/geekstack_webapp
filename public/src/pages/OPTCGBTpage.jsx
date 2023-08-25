import React, { useEffect, useState } from "react";
import { Box, Button, FormControl, Grid, InputLabel, MenuItem, Select, Slider } from "@mui/material"
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import BottomNav from "../components/BottomNav"
import { Helmet } from "react-helmet";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { ArrowBack } from "@mui/icons-material";
import { OPTCGCardDrawer } from "../components/OPTCGPageComponent/OPTCGCardDrawer";

const OPTCGBTpage = () => {
  const { booster } = useParams();
  const [currentPage, setCurrentPage] = useState(1);
  const [onepieces, setOnepieces] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const [colorFilter, setColorFilter] = useState('');
  const [imageWidth, setImageWidth] = useState(100);
  const imageHeight = imageWidth * 1.395;
  const navigate = useNavigate();
  const location = useLocation();
  const colors = ['Red', 'Blue', 'Green', 'Yellow', 'Purple', 'Black'];

  const goBack = () => {
    navigate(-1);
  };

  const handleOpenModal = (onepiece) => {
    setSelectedCard(onepiece);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setSelectedCard(null);
    setOpenModal(false);
  };

  const handleSwipeLeft = () => {
    const currentIndex = onepieces.findIndex((doc) => doc.cardid === selectedCard.cardid);
    const nextIndex = (currentIndex + 1) % onepieces.length;
    setSelectedCard(onepieces[nextIndex]);
  };

  const handleSwipeRight = () => {
    const currentIndex = onepieces.findIndex((doc) => doc.cardid === selectedCard.cardid);
    const prevIndex = (currentIndex - 1 + onepieces.length) % onepieces.length;
    setSelectedCard(onepieces[prevIndex]);
  };

  const handleSliderChange = (event, newValue) => {
    setImageWidth(newValue);
  };

  const fetchData = async (page) => {
    const url = `https://ap-southeast-1.aws.data.mongodb-api.com/app/data-fwguo/endpoint/onepieceData?page=${page}&booster=${booster}&secret=${process.env.REACT_APP_SECRET_KEY}`;
    try {
      const response = await fetch(url);
      const result = await response.json();
      const data = result.data;

      setOnepieces((prevData) => {
        const newData = [...prevData, ...data];
        newData.sort((a, b) => {
          const aId = parseInt(a.cardid.split('-')[1]);
          const bId = parseInt(b.cardid.split('-')[1]);
          return aId - bId;
        });
        return newData;
      });

      // Replace pageSize with your actual page size
      const pageSize = 20;
      if (data.length === pageSize) {
        // More data is available. Increment currentPage.
        setCurrentPage(page + 1);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchData(currentPage);
    console.log(currentPage, "shown")
  }, [currentPage]);


  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "webmanifest";
    link.href = `${process.env.PUBLIC_URL}/manifest.json`; // Equivalent to %PUBLIC_URL%
    document.head.appendChild(link);

    return () => {
      document.head.removeChild(link);
    };
  }, []);

  return (
    <div>
      <Helmet>
        <meta name="apple-mobile-web-app-capable" content="yes" />
      </Helmet>
      <Box color={"#f2f3f8"}>
        <Navbar />
        <Box>
          <Box sx={{ display: { xs: "none", sm: "none", md: "block" } }}><Sidebar /></Box>
          <Box sx={{ marginLeft: { xs: "0px", sm: "0px", md: "100px" }, paddingLeft: "18px", paddingRight: "18px" }}>
            <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "center" }}>
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
              <Box sx={{ width: 100 }}>
                <Slider
                  value={imageWidth}
                  onChange={handleSliderChange}
                  aria-labelledby="continuous-slider"
                  valueLabelDisplay="auto"
                  min={75}
                  max={250}
                  sx={{
                    '& .MuiSlider-thumb': {
                      color: '#F2F3F8', // color of the thumb
                    },
                    '& .MuiSlider-track': {
                      color: '#F2F3F8', // color of the track
                    },
                    '& .MuiSlider-rail': {
                      color: '#F2F3F8', // color of the rail
                    },
                    margin: 1,
                  }}
                />
              </Box>
            </Box>
            <Box sx={{ display: "flex", justifyContent: "center", paddingTop: "3px", paddingBottom: "10px" }}>
              <Button sx={{
                fontSize: 10,
                height: 20,
                padding: 1, // Adjust the padding as needed 
                backgroundColor: "#f2f3f8",
                color: "#240052",
                '&:hover': {
                  backgroundColor: "#240052", // Change this to the desired hover background color
                  color: "#f2f3f8", // Change this to the desired hover text color if needed
                },
              }} onClick={goBack}>Back <ArrowBack sx={{ fontSize: 15 }} /></Button>
            </Box>
            <div style={{ overflowY: "auto", height: "100vh" }} className="hide-scrollbar">
              <Grid container spacing={2} justifyContent="center">
                {onepieces.filter(onepiece => !colorFilter || onepiece.color === colorFilter).map((onepiece) => (
                  <Grid item key={onepiece.cardid} >
                    <Box onClick={() => handleOpenModal(onepiece)}>
                      <img
                        loading="lazy"
                        src={onepiece.image}
                        draggable="false"
                        alt={onepiece.cardid}
                        width={imageWidth}
                        height={imageHeight}
                      />
                    </Box>
                  </Grid>
                ))}
                {selectedCard && (
                  <OPTCGCardDrawer
                    open={openModal}
                    onClose={handleCloseModal}
                    selectedCard={selectedCard}
                    onSwipeLeft={handleSwipeLeft}
                    onSwipeRight={handleSwipeRight}
                  />
                )}
              </Grid>
              <div style={{ height: "300px" }}></div>
            </div>
          </Box>
          <Box flex={2} sx={{ display: { xs: "block", sm: "block", md: "none" } }}><BottomNav /></Box>
        </Box>
      </Box>
    </div>
  );
}

export default OPTCGBTpage