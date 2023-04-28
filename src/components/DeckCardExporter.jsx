import React, { useContext, useEffect, useState } from "react";
import { Grid, Box } from "@mui/material";
import { Bar, BarChart, LabelList, Tooltip, XAxis, YAxis } from "recharts";
import useImages from './useImages';
import { AuthContext } from "../context/AuthContext";

const DeckCardExporter = ({ cards, energyChartData, apChartData, categoryChartData }) => {
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

  return (
    <div id="deck-card-exporter" style={{ width: "1920px", height: "1080px", visibility: imageLoaded ? "visible" : "hidden" }}>
      <div
        style={{
          width: "1920px",
          height: "1080px",
          backgroundColor: "#121212",
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
          <Box sx={{display:"flex", flexDirection:"row"}}>
            <Box flex={10} p={3}>
              <Grid container spacing={2} justifyContent="center">
                {cards.map((card,index) => (
                  <Grid item key={card.id}>
                    <Box display={"flex"} flexDirection={"column"} sx={{ textAlign: "center" }}>
                    {images[index] && images[index].complete && (
                    <img src={card.image} alt={card.front} height="281.235px" width="200px"/>
                  )}
                      <span style={{ color: "white", fontSize: "30px" }}>{card.count}</span>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Box>
            <Box flex={2} p={3} sx={{ textAlign: "left", color: "#f2f3f8" }}>
              <h3>Energy Cost Breakdown:</h3>
              <BarChart width={300} height={200} data={energyChartData}>
                <XAxis dataKey="key" />
                <YAxis sx={{backgroundColor: "#f2f3f8"}}/>
                <Tooltip />
                <Bar dataKey="value" fill="#8B7BEF">
                  <LabelList dataKey="value" position="top" />
                </Bar>
              </BarChart>

              <h3>AP Cost Breakdown:</h3>
              <BarChart width={300} height={200} data={apChartData}>
                <XAxis dataKey="key" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#70C7F9">
                  <LabelList dataKey="value" position="top" />
                </Bar>
              </BarChart>

              <h3>Card Type Breakdown:</h3>
              <BarChart width={300} height={200} data={categoryChartData}>
                <XAxis dataKey="key" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#FC86F0">
                  <LabelList dataKey="value" position="top" />
                </Bar>
              </BarChart>
              <Box sx={{textAlign: "center",display:"flex", flexDirection:"column",gap:"10px",justifyContent:"center",alignItems:"center"}}>
                <div style={{height:"30px"}}/>
                <img style={{ width: "auto", height: "100px" }} alt="uniondeck" src="/icons/uniondecklogosmall.png" />
                <span style={{ fontSize:"25px"}}><strong>uniondeck.dev</strong></span>
                <span style={{ fontSize:"20px"}}>{currentUser.displayName}</span>
              </Box>
            </Box>
          </Box>
        </div>
      </div>
    </div>
  );
};

export default DeckCardExporter;
