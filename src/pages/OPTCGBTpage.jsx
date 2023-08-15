import React, { useEffect, useState } from "react";
import { Box, Button, FormControl, Grid, MenuItem, Select, Slider } from "@mui/material"
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import BottomNav from "../components/BottomNav"
import { Helmet } from "react-helmet";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { ArrowBack } from "@mui/icons-material";
import { CardOnepieceModal } from "../components/OPTCGPageComponent/CardOnepieceModal";

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
    console.log(currentPage,"shown")
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
              <FormControl sx={{ margin: 1 }}>
                <Select
                  value={colorFilter}
                  onChange={(event) => setColorFilter(event.target.value)}
                  sx={{
                    display: "flex", flexDirection: "column", justifyContent: "center", textAlign: "center",
                    whiteSpace: 'nowrap', backgroundColor: "#f2f3f8", borderRadius: "5px",
                    fontSize: 11, width: "60px", height: "30px",
                    '& .MuiSelect-icon': {
                      display: "none",
                      position: "absolute"
                    },
                  }}
                  displayEmpty
                  renderValue={(selectedValue) => selectedValue || 'Color'}
                >
                  <MenuItem value="">All</MenuItem>
                  <MenuItem value="Red">Red</MenuItem>
                  <MenuItem value="Blue">Blue</MenuItem>
                  <MenuItem value="Green">Green</MenuItem>
                  <MenuItem value="Yellow">Yellow</MenuItem>
                  <MenuItem value="Purple">Purple</MenuItem>
                  <MenuItem value="Black">Black</MenuItem>
                  <MenuItem value="White">White</MenuItem>
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
            <Box sx={{display:"flex",justifyContent:"center",paddingTop:"3px",paddingBottom:"10px"}}>
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
                {onepieces.filter((onepiece) => colorFilter === '' || onepiece.color1 === colorFilter || onepiece.color2 === colorFilter).map((onepiece) => (
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
                  <CardOnepieceModal
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