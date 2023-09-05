import { Box, Grid } from "@mui/material";
import React, { useEffect } from "react";
import OPTCGButtonList from "./OPTCGBoosterButton";
import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { OPTCGCardDrawer } from "./OPTCGCardDrawer";



const OPTCGCardlist = ({ filters }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [onepieces, setOnepieces] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const [imageWidth, setImageWidth] = useState(100);
  const imageHeight = imageWidth * 1.395;
  const navigate = useNavigate();
  const [shouldFetch, setShouldFetch] = useState(false);
  const location = useLocation();
  const parameters = {
    color_lower: ["red", "blue", "green", "yellow", "purple", "black"],
    attribute_lower: ["slash", "ranged", "special", "wisdom", "strike"],
    rarity_lower: ["c", "uc", "r", "sr", "alt", "l", "l-alt", "sp", "manga"],
    typing_lower_token: [],
    typing_lower: [],
    cardname_lower_token: [],
    booster_lower: ["op01", "op02", "op03", "op04", "op05", "st01", "st02", "st03", "st04", "st05", "st06", "st07", "st08", "st09", "st10"], // Same here
    category: ["character", "event", "stage"]
  }

  const goBack = () => {
    navigate(-1);
  };

  const transformFilters = () => {
    if (!filters || filters.length === 0) return {};

    let transformedFilters = {};

    for (let key in parameters) {
      for (let filter of filters) {
        if (parameters[key].includes(filter)) {
          if (!transformedFilters[key]) transformedFilters[key] = [];
          transformedFilters[key].push(filter);
        }
      }
    }

    // Check for words that weren't matched to predefined values
    for (let filter of filters) {
      let matched = false;
      for (let key in parameters) {
        if (parameters[key].includes(filter)) {
          matched = true;
          break;
        }
      }
      if (!matched) {
        // If a filter value isn't found in any parameter, add it to typing_lower_token and cardname_lower_token
        if (!transformedFilters['typing_lower_token']) transformedFilters['typing_lower_token'] = [];
        transformedFilters['typing_lower_token'].push(filter);

        if (!transformedFilters['cardname_lower_token']) transformedFilters['cardname_lower_token'] = [];
        transformedFilters['cardname_lower_token'].push(filter);

        if (!transformedFilters['typing_lower']) transformedFilters['typing_lower'] = [];
        transformedFilters['typing_lower'].push(filter);
      }
    }

    return transformedFilters;
  }

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
    setShouldFetch(false);
    const transformedFilters = transformFilters();

    // Construct the filterString directly from the transformedFilters
    const filterPairs = Object.entries(transformedFilters).map(([key, values]) => {
      const valueString = values.map(val => `"${val}"`).join(",");
      return `"${key}":[${valueString}]`;  // Add the double quotes around the key and value
    });
    const filterString = `{${filterPairs.join(",")}}`;

    const encodedFilterString = encodeURIComponent(filterString);

    const url = `https://ap-southeast-1.aws.data.mongodb-api.com/app/data-fwguo/endpoint/onepieceSearchData?page=${page}&filters=${encodedFilterString}&secret=${process.env.REACT_APP_SECRET_KEY}`;
    console.log("Constructed URL:", url);

    try {
      const response = await fetch(url);
      const result = await response.json();
      const data = result.data;

      // If the search returns more than 700 cards, then discard the results
      if (data.length > 1000 || (result.totalCount && result.totalCount > 1000)) {
        console.warn("API returned more than 500 cards.");
        setOnepieces([]);
        return;
      }

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
        setShouldFetch(true);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    setCurrentPage(1);
    setOnepieces([]);
    setShouldFetch(true);
  }, [filters]);


  useEffect(() => {
    if (filters.length !== 0 && shouldFetch) {
      fetchData(currentPage);
    }
  }, [currentPage, filters, shouldFetch]);


  return (
    <>
      {filters.length === 0 && (
        <Box sx={{ display: "flex", flexDirection: "row", flexWrap: "wrap", gap: "20px", justifyContent: "center" }}>
          <OPTCGButtonList />
        </Box>
      )}
      {filters.length !== 0 && (
        <div style={{ overflowY: "auto", height: "100vh" }} className="hide-scrollbar">
          <Grid container spacing={2} justifyContent="center">
            {onepieces.map((onepiece) => (
              <Grid item key={onepiece._id}>
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
          </Grid>
          {selectedCard && (
            <OPTCGCardDrawer
              open={openModal}
              onClose={handleCloseModal}
              selectedCard={selectedCard}
              onSwipeLeft={handleSwipeLeft}
              onSwipeRight={handleSwipeRight}
            />
          )}
          <div style={{ height: "300px" }}></div>
        </div>
      )}
    </>
  );

}

export default OPTCGCardlist;
