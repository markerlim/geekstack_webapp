import React, { useContext, useEffect, useState } from "react";
import { Grid, Box } from "@mui/material";
import useImages from './useImages';
import { AuthContext } from "../context/AuthContext";

const DeckCardExporter = ({ cards, energyStats, triggerStateStats }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [images] = useImages(
    cards.map((card) => card.image),
    { crossOrigin: "anonymous" }
  );

  const { currentUser } = useContext(AuthContext)

  useEffect(() => {
    if (images.length > 0 && images.every((img) => img.complete)) {
      setImageLoaded(true);
    }
  }, [images]);

  const getImageSrc = (energycost) => {
    switch (energycost) {
      case 0:
        return "/images/ENERGY0.png"
      case 1:
        return "/images/ENERGY1.png";
      case 2:
        return "/images/ENERGY2.png";
      case 3:
        return "/images/ENERGY3.png";
      case 4:
        return "/images/ENERGY4.png";
      case 5:
        return "/images/ENERGY5.png";
      case 6:
        return "/images/ENERGY6.png";
      case 7:
        return "/images/ENERGY7.png";
      case 8:
        return "/images/ENERGY8.png";
      case 9:
        return "/images/ENERGY9.png";
      case 10:
        return "/images/ENERGY10.png";
      // Add more cases as needed
      default:
        return "/images/ENERGYDEFAULT.png";
    }
  };

  const getImageSrc1 = (triggerState) => {
    switch (triggerState) {
      case "Color":
        return "/icons/TCOLOR.png"
      case "Special":
        return "/icons/TSPECIAL.png";
      case "Final":
        return "/icons/TFINAL.png";
      // Add more cases as needed
      default:
        return "";
    }
  };

  return (
    <div id="deck-card-exporter" style={{ width: "1920px", height: "1080px", visibility: "visible" }}>
      <div
        style={{
          width: "1920px",
          height: "1080px",
          backgroundColor: "#121212",
          background: "url(/images/articlebg/JJKBG.jpg) no-repeat" ,
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            transform: "scale(1)",
            transformOrigin: "0 0",
          }}
        >
          <Box sx={{ display: "flex", flexDirection: "row" }}>
            <Box flex={10} p={3}>
              <Grid container spacing={2} justifyContent="center">
                {cards.map((card, index) => (
                  <Grid item key={card.id}>
                    <Box display={"flex"} flexDirection={"column"} sx={{ textAlign: "center" }}>
                      {images[index] && images[index].complete && (
                        <img src={card.image} alt={card.front} height="281.235px" width="200px" />
                      )}
                      <span style={{ color: "white", fontSize: "30px" }}>{card.count}</span>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Box>
            <Box flex={2} p={3} sx={{ textAlign: "left", color: "#f2f3f8" }}>
              <h3>Energy Cost Breakdown:</h3>
              <div style={{ display: "flex", flexDirection: "row", gap: 5, flexWrap: "wrap" }}>
                {Object.entries(energyStats).map(([energyCost, count]) => (
                  <div key={energyCost} style={{ display: "flex", alignItems: "center", fontSize: "16px", }}>
                    <img src={getImageSrc(parseInt(energyCost, 10))} alt={`Energy cost ${energyCost}`} width="30px" height="auto" /><span>:{count}</span>
                  </div>
                ))}
              </div>
              <h3>AP Cost Breakdown:</h3>
              <div style={{ display: "flex", flexDirection: "row", gap: 5, flexWrap: "wrap" }}>
                {Object.entries(triggerStateStats)
                  .filter(([triggerState, count]) =>
                    triggerState === "Color" || triggerState === "Special" || triggerState === "Final"
                  )
                  .map(([triggerState, count]) => (
                    <div key={triggerState} style={{ display: "flex", alignItems: "center", fontSize: "16px", }}>
                      <img src={getImageSrc1(triggerState)} alt={`${triggerState}`} width="50px" height="auto" /><span>: {count}</span>
                    </div>
                  ))
                }
              </div>
              <h3>Card Type Breakdown:</h3>
              <Box sx={{ textAlign: "center", display: "flex", flexDirection: "column", gap: "10px", justifyContent: "center", alignItems: "center" }}>
                <div style={{ height: "30px" }} />
                <img style={{ width: "auto", height: "100px" }} alt="uniondeck" src="/icons/uniondecklogosmall.png" />
                <span style={{ fontSize: "25px" }}><strong>uniondeck.dev</strong></span>
                <span style={{ fontSize: "20px" }}>{currentUser.displayName}</span>
                <img style={{ width: "auto", height: "100px" }} alt="uniondeck" src="/images/misc/uniondeckqr.png" />
              </Box>
            </Box>
          </Box>
        </div>
      </div>
    </div>
  );
};

export default DeckCardExporter;
