import React, { useEffect, useState } from "react";
import { Box, Grid, Slider } from "@mui/material"
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import BottomNav from "../components/BottomNav"
import { Helmet } from "react-helmet";
import { CardDigimonModal } from "../components/DigimonPageComponent/CardDigimonModal";
import { useParams } from "react-router-dom";

const DTCGBTpage = () => {

  const { booster } = useParams();
  const url = `http://localhost:5000/digimonData?booster=${booster}`;
  const [digimons, setDigimons] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const [imageWidth, setImageWidth] = useState(100);
  const imageHeight = imageWidth * 1.395;

  const handleOpenModal = (digimon) => {
    setSelectedCard(digimon);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setSelectedCard(null);
    setOpenModal(false);
  };

  const handleSwipeLeft = () => {
    const currentIndex = digimons.findIndex((doc) => doc.cardid === selectedCard.cardid);
    const nextIndex = (currentIndex + 1) % digimons.length;
    setSelectedCard(digimons[nextIndex]);
  };

  const handleSwipeRight = () => {
    const currentIndex = digimons.findIndex((doc) => doc.cardid === selectedCard.cardid);
    const prevIndex = (currentIndex - 1 + digimons.length) % digimons.length;
    setSelectedCard(digimons[prevIndex]);
  };

  const handleSliderChange = (event, newValue) => {
    setImageWidth(newValue);
  };

  useEffect(() => {
    fetch(url)
      .then(res => res.json())
      .then(data => {
        console.log(url)
        console.log(data); // Log the response to the console
        data.sort((a, b) => {
          const aId = parseInt(a.cardid.slice(-3));
          const bId = parseInt(b.cardid.slice(-3));
          return aId - bId;
        });
        setDigimons(data);
      });
  }, [url]);

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
      <Box bgcolor={"#121212"} color={"#f2f3f8"}>
        <Navbar />
        <Box>
          <Box sx={{ display: { xs: "none", sm: "none", md: "block" } }}><Sidebar /></Box>
          <Box sx={{ marginLeft: { xs: "0px", sm: "0px", md: "100px" }, paddingLeft: "18px", paddingRight: "18px" }}>
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
            <div style={{ overflowY: "auto", height: "100vh" }} className="hide-scrollbar">
              <Grid container spacing={2} justifyContent="center">
                {digimons.map((digimon) => (
                  <Grid item >
                    <Box onClick={() => handleOpenModal(digimon)}>
                      <img
                        key={digimon.cardid}
                        loading="lazy"
                        src={digimon.images}
                        draggable="false"
                        alt={digimon.cardid}
                        width={imageWidth}
                        height={imageHeight}
                      />
                    </Box>
                  </Grid>
                ))}
                {selectedCard && (
                  <CardDigimonModal
                    open={openModal}
                    onClose={handleCloseModal}
                    selectedCard={selectedCard}
                    onSwipeLeft={handleSwipeLeft}
                    onSwipeRight={handleSwipeRight}
                  />
                )}
              </Grid>
              <div style={{ height: "200px" }}></div>
            </div>
          </Box>
          <Box flex={2} sx={{ display: { xs: "block", sm: "block", md: "none" } }}><BottomNav /></Box>
        </Box>
      </Box>
    </div>
  );
}

export default DTCGBTpage