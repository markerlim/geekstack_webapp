import React, { useEffect, useState } from "react";
import { Box, Grid } from "@mui/material"
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import BottomNav from "../components/BottomNav"
import { Helmet } from "react-helmet";
import { ResponsiveImage } from "../components/ResponsiveImage";
import { CardDigimonModal } from "../components/DigimonPageComponent/CardDigimonModal";
import { useParams } from "react-router-dom";

const DTCGBTpage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const {booster} = useParams();
  const url = `http://localhost:5000/digimonData?booster=${booster}`;
  const handleSearch = (searchValue) => {
    setSearchQuery(searchValue);
  };
  const [digimons, setDigimons] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);

  const handleOpenModal = (digimon) => {
    setSelectedCard(digimon);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setSelectedCard(null);
    setOpenModal(false);
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
        <Navbar onSearch={handleSearch} />
        <Box>
          <Box sx={{ display: { xs: "none", sm: "none", md: "block" } }}><Sidebar /></Box>
          <Box sx={{ marginLeft: { xs: "0px", sm: "0px", md: "100px" }, paddingLeft: "18px", paddingRight: "18px" }}>
            <div style={{ overflowY: "auto", height: "86vh" }} className="hide-scrollbar">
              <Grid container spacing={2} justifyContent="center">
                {digimons.map((digimon) => (
                  <Grid item key={digimon.cardid}>
                    <Box onClick={() => handleOpenModal(digimon)}>
                      <ResponsiveImage
                        loading="lazy"
                        src={digimon.images}
                        draggable="false"
                        alt={digimon.cardid}
                      />
                    </Box>
                  </Grid>
                ))}
                {selectedCard && (
                  <CardDigimonModal
                    open={openModal}
                    onClose={handleCloseModal}
                    selectedCard={selectedCard}
                  />
                )}
              </Grid>
            </div>
          </Box>
          <Box flex={2} sx={{ display: { xs: "block", sm: "block", md: "none" } }}><BottomNav /></Box>
        </Box>
      </Box>
    </div>
  );
}

export default DTCGBTpage