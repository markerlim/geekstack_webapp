import React, { useEffect, useState } from "react";
import { Box, Button, ButtonBase, CircularProgress, FormControl, Grid, InputLabel, MenuItem, Select, Slider } from "@mui/material";
import { AddCircle, ArrowBack, RemoveCircle } from "@mui/icons-material";
import { useDBZCardState } from "../../context/useCardStateDragonballz";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../Firebase";
import { DBZCardDrawerNF } from "./DBZCardDrawerFormatted";

const MyButton = ({ alt, imageSrc, imgWidth, onClick }) => {
  return (
    <div>
      <ButtonBase
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          bgcolor: "#121212",
          borderRadius: '10px',
          boxShadow: 5,
          overflow: "hidden",
          width: { xs: 80, md: 125, lg: 200 },
          height: { xs: 120, md: 188, lg: 300 },
        }}
        onClick={onClick}
      >
        <img
          loading="lazy"
          src={imageSrc}
          alt={alt}
          style={{ width: `${imgWidth}`, height: "auto" }}
        />
      </ButtonBase>
    </div>
  );
};
const extractNumericPart = (pathname) => {
  const matches = pathname.match(/\d+/);
  return matches ? parseInt(matches[0]) : NaN;
};
const extractAlphaPart = (pathname) => {
  const matches = pathname.match(/[a-zA-Z]+/);
  return matches ? matches[0] : "";
};
const customSort = (a, b) => {
  const alphaPartA = extractAlphaPart(a.pathname);
  const alphaPartB = extractAlphaPart(b.pathname);

  // First, compare the alphabet parts of the pathnames
  const alphaCompare = alphaPartA.localeCompare(alphaPartB);

  if (alphaCompare !== 0) {
    // If the alphabet parts are different, return the result of the alphabetical comparison
    return alphaCompare;
  }

  // If the alphabet parts are the same, compare the numeric parts
  const numericPartA = extractNumericPart(a.pathname);
  const numericPartB = extractNumericPart(b.pathname);

  if (!isNaN(numericPartA) && !isNaN(numericPartB)) {
    return numericPartA - numericPartB;
  } else {
    // Fallback to alphabetical sorting if any of the numeric parts is not found
    return a.pathname.localeCompare(b.pathname);
  }
};
const DBZFWBuilderButtonList = ({ filters, isButtonClicked, setIsButtonClicked, setChangeClick }) => {
  const { filteredCards, setFilteredCards } = useDBZCardState();
  const [buttonData, setButtonData] = useState([]);
  const [dragonballs, setDragonballs] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const [selectedColor, setSelectedColor] = useState("");
  const [imageWidth, setImageWidth] = useState(100);
  const [isLoading, setIsLoading] = useState(false);
  const [currentViewedCards, setCurrentViewedCards] = useState([]);
  const [shouldFetch, setShouldFetch] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const imageHeight = imageWidth * 1.395;
  const url = `https://ap-southeast-1.aws.data.mongodb-api.com/app/data-fwguo/endpoint/dragonballzfwboosterlist?secret=${process.env.REACT_APP_SECRET_KEY}`;
  const colors = ["Red", "Blue", "Green", "Yellow"]
  const parameters = {
    colorLower: ["red", "blue", "green", "yellow"],
    boosterLower: ["fb01", "fb02", "fs01", "fs02", "fs03", "fs04"],
    featuresToken:[],
    cardNameTokens:[],
    featuresLower:[],
    category: ["battle", "extra"]
  }
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
        if (!transformedFilters['featuresToken']) transformedFilters['featuresToken'] = [];
        transformedFilters['featuresToken'].push(filter);

        if (!transformedFilters['cardNameTokens']) transformedFilters['cardNameTokens'] = [];
        transformedFilters['cardNameTokens'].push(filter);

        if (!transformedFilters['featuresLower']) transformedFilters['featuresLower'] = [];
        transformedFilters['featuresLower'].push(filter);
      }
    }
    return transformedFilters;
  }
  const handleOpenModal = (dragonball) => {
    setSelectedCard(dragonball);
    setOpenModal(true);
  };
  const handleCloseModal = () => {
    setSelectedCard(null);
    setOpenModal(false);
  };
  const handleSwipeLeft = () => {
    const currentIndex = dragonballs.findIndex((doc) => doc.cardUid === selectedCard.cardUid);
    const nextIndex = (currentIndex + 1) % dragonballs.length;
    setSelectedCard(dragonballs[nextIndex]);
  };
  const handleSwipeRight = () => {
    const currentIndex = dragonballs.findIndex((doc) => doc.cardUid === selectedCard.cardUid);
    const prevIndex = (currentIndex - 1 + dragonballs.length) % dragonballs.length;
    setSelectedCard(dragonballs[prevIndex]);
  };

  const fetchdragonballs = async (booster) => {
    try {
      const filteredQuery = query(collection(db, "dragonballzfw"), where("booster", "==", booster));
      const querySnapshot = await getDocs(filteredQuery);
      let alldragonballs = [];

      querySnapshot.forEach((doc) => {
        const docData = doc.data();
        alldragonballs.push(docData);
      });

      alldragonballs = alldragonballs.filter(dragonball => 
        dragonball.cardtype !== "LEADER" && dragonball.cardtype !== "LEADER | AWAKEN"
      );
      
      alldragonballs = alldragonballs.map(dragonball => ({
        ...dragonball,
        count: dragonball.count || 0
      }));
      console.log(alldragonballs)
      setDragonballs(alldragonballs);
      setCurrentViewedCards(alldragonballs);
      setIsLoading(false);

      return alldragonballs

    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(url);
        const result = await response.json();
        const data = result.data;

        const extractedPathnames = data.map((item) => item.pathname);
        extractedPathnames.sort();
        const sortedData = extractedPathnames.map((pathname) =>
          data.find((item) => item.pathname === pathname)
        ).sort(customSort);

        setButtonData(sortedData);
      } catch (error) {
        console.error("Fetch error data:", error);
      }
    };
    fetchData();
  }, [url]);

  useEffect(() => {
    setCurrentViewedCards(dragonballs);
  }, [dragonballs]);

  const handleButtonClick = (booster) => {
    setIsLoading(true);
    fetchdragonballs(booster).then(newdragonballs => {
      const updateddragonballs = newdragonballs.map(dragonball => {
        const existingCard = filteredCards.find(card => card.cardUid === dragonball.cardUid);
        return {
          ...dragonball,
          count: existingCard ? existingCard.count : 0
        };
      });
      setDragonballs(updateddragonballs);
      setIsButtonClicked(true);
      setIsLoading(false);
    });
  };

  const fetchSearchData = async (page) => {
    setShouldFetch(false);
    const transformedFilters = transformFilters();

    // Construct the filterString directly from the transformedFilters
    const filterPairs = Object.entries(transformedFilters).map(([key, values]) => {
      const valueString = values.map(val => `"${val}"`).join(",");
      return `"${key}":[${valueString}]`;  // Add the double quotes around the key and value
    });
    const filterString = `{${filterPairs.join(",")}}`;

    // Let's log the raw filterString for verification
    console.log("Raw filter string:", filterString);

    // URL encode the filter string
    const encodedFilterString = encodeURIComponent(filterString);

    const surl = `https://ap-southeast-1.aws.data.mongodb-api.com/app/data-fwguo/endpoint/dragonballzSearchData?page=${page}&filters=${encodedFilterString}&secret=${process.env.REACT_APP_SECRET_KEY}`;
    console.log("Constructed URL:", surl);

    try {
      const response = await fetch(surl);
      const result = await response.json();
      const data = result.data;

      // If the search returns more than 500 cards, then discard the results
      if (data.length > 500 || (result.totalCount && result.totalCount > 500)) {
        console.warn("Search returned more than 500 cards. Be more specific");
        setDragonballs([]);
        return;
      }

      setDragonballs((prevData) => {
        const filteredData = data.filter(dragonball => 
          dragonball.cardtype !== "LEADER" && dragonball.cardtype !== "LEADER | AWAKEN"
        );
        const newData = [...prevData, ...filteredData];
        newData.sort((a, b) => {
          const aId = parseInt(a.cardId.split('-')[1]);
          const bId = parseInt(b.cardId.split('-')[1]);
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
    setDragonballs([]);
    setShouldFetch(true);
  }, [filters]);

  useEffect(() => {
    if (filters.length !== 0 && shouldFetch) {
      fetchSearchData(currentPage);
    }
  }, [currentPage, filters, shouldFetch]);

  const modifyCardCount = (cardId, cardUid, change) => {
    // Filter cards with the same cardId
    const cardsWithSameId = filteredCards.filter(card => card.cardId === cardId);
    // Count the total number of cards with the same cardId
    const countOfSameId = cardsWithSameId.reduce((total, card) => total + card.count, 0);
  
    // Check if adding 'change' cards would exceed the limit of 4 cards with the same cardId
    if (countOfSameId + change <= 4) {
      // Find the index of the existing card in filteredCards based on cardUid
      const existingCardIndex = filteredCards.findIndex(card => card.cardUid === cardUid);
  
      // If the card with cardUid exists
      if (existingCardIndex !== -1) {
        const existingCard = filteredCards[existingCardIndex];
        const newCount = Math.max(0, existingCard.count + change);
  
        // If newCount becomes 0, remove the card from filteredCards
        if (newCount === 0) {
          setFilteredCards(prevFilteredCards => prevFilteredCards.filter(card => card.cardUid !== cardUid));
        } else {
          // Update the count of the existing card
          setFilteredCards(prevFilteredCards => {
            const updatedCards = [...prevFilteredCards];
            updatedCards[existingCardIndex] = { ...existingCard, count: newCount };
            return updatedCards;
          });
        }
      } else if (change > 0) {
        // If the card with cardUid doesn't exist and change is positive, add a new card
        const newCard = dragonballs.find(dragonball => dragonball.cardUid === cardUid);
        if (newCard) {
          setFilteredCards(prevFilteredCards => [...prevFilteredCards, { ...newCard, count: 1 }]);
        }
      }
    }
    // Toggle the state of changeClick
    setChangeClick(prevState => !prevState);
  };
  
  const increase = (cardId, cardUid) => modifyCardCount(cardId, cardUid, 1);
  const decrease = (cardId, cardUid) => modifyCardCount(cardId, cardUid, -1);
  
  useEffect(() => {
    setDragonballs(prevdragonballs => {
      return prevdragonballs.map(dragonball => {
        const cardFromFiltered = filteredCards.find(card => card.cardUid === dragonball.cardUid);
        if (cardFromFiltered) {
          return {
            ...dragonball,
            count: cardFromFiltered.count
          };
        }
        return {
          ...dragonball,
          count: 0
        };
      });
    });
  }, [filteredCards]);

  const handleClearSelection = () => {
    setSelectedColor("");
    setIsButtonClicked(false);
    setDragonballs([]); // Clear the dragonballs data
  };

  return (
    <>
      {filters.length === 0 && (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '30px', paddingRight: '30px', paddingTop: { xs: '30px', sm: '30px', md: '0px' }, paddingLeft: '30px', paddingBottom: '20px', justifyContent: 'center', }}>
          {!isButtonClicked && buttonData.map((button) => (
            <MyButton
              key={button.pathname}
              alt={button.alt}
              imageSrc={button.imageSrc}
              imgWidth={button.imgWidth}
              onClick={() => handleButtonClick(button.pathname)}
            />
          ))}
        </Box>)}
      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          {isButtonClicked && (
            <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', marginTop: { md: '-20px' }, position: 'relative' }}>
              <Box sx={{ display: { xs: 'none', sm: 'none', md: 'flex' }, justifyContent: 'center' }}>
                <Slider
                  sx={{
                    width: '200px',
                    '& .MuiSlider-thumb': {
                      color: '#c8a2c8', // color of the thumb
                    },
                    '& .MuiSlider-track': {
                      color: '#c8a2c8', // color of the track
                    },
                    '& .MuiSlider-rail': {
                      color: '#f2f3f8', // color of the rail
                    },
                    margin: 1,
                  }}
                  value={imageWidth}
                  onChange={(event, newValue) => setImageWidth(newValue)}
                  aria-labelledby="continuous-slider"
                  valueLabelDisplay="auto"
                  min={50}
                  max={300}
                />
                <FormControl variant="outlined" size="small" style={{ marginRight: '15px' }}>
                  <InputLabel sx={{
                    color: '#c8a2c8',
                    '&.Mui-focused': {
                      color: '#c8a2c8',
                    }
                  }}>Color</InputLabel>
                  <Select
                    sx={{
                      width: '100px',
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
                    value={selectedColor}
                    onChange={(e) => setSelectedColor(e.target.value)}
                    label="Color"
                  >
                    <MenuItem value="">
                      <em>None</em>
                    </MenuItem>
                    {colors.map(color => (
                      <MenuItem key={color} value={color} sx={{ color: '#c8a2c8' }}>
                        {color}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <Button onClick={handleClearSelection}><ArrowBack sx={{ color: '#c8a2c8' }} /></Button>
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', flexWrap: 'wrap', gap: '20px' }}>
                {currentViewedCards
                  .filter(dragonball => !selectedColor || dragonball.color === selectedColor)
                  .map((dragonball) => (
                    <Grid item key={dragonball.cardUid}>
                      <Box onClick={() => handleOpenModal(dragonball)} >
                        <img
                          loading="lazy"
                          src={dragonball.image}
                          draggable="false"
                          alt={dragonball.cardId}
                          width={imageWidth}
                          height={imageHeight}
                        />
                      </Box>
                      <Box display={"flex"} flexDirection={"row"} gap={1} alignItems={"center"} justifyContent={"center"} sx={{ color: '#C8A2C8' }}>
                        <div component={Button} onClick={() => decrease(dragonball.cardId,dragonball.cardUid)} style={{ cursor: "pointer" }}>
                          <RemoveCircle sx={{ fontSize: 20 }} />
                        </div>
                        <span sx={{ fontSize: 20 }}>{dragonball.count || 0}</span>
                        <div component={Button} onClick={() => increase(dragonball.cardId,dragonball.cardUid)} style={{ cursor: "pointer" }}>
                          <AddCircle sx={{ fontSize: 20 }} />
                        </div>
                      </Box>
                    </Grid>
                  ))}
                {selectedCard && (
                  <DBZCardDrawerNF
                    open={openModal}
                    onClose={handleCloseModal}
                    selectedCard={selectedCard}
                    onSwipeLeft={handleSwipeLeft}
                    onSwipeRight={handleSwipeRight}
                  />
                )}
              </Box>
              <Box sx={{ position: 'sticky', bottom: '-30px', backgroundColor: '#121212', display: { xs: 'flex', sm: 'flex', md: 'none' }, paddingTop: '10px', paddingBottom: '10px', justifyContent: 'flex-end', alignItems: 'center' }}>
                <Slider
                  sx={{
                    width: '200px',
                    '& .MuiSlider-thumb': {
                      color: '#c8a2c8', // color of the thumb
                    },
                    '& .MuiSlider-track': {
                      color: '#c8a2c8', // color of the track
                    },
                    '& .MuiSlider-rail': {
                      color: '#f2f3f8', // color of the rail
                    },
                    margin: 1,
                  }}
                  value={imageWidth}
                  onChange={(event, newValue) => setImageWidth(newValue)}
                  aria-labelledby="continuous-slider"
                  valueLabelDisplay="auto"
                  min={50}
                  max={300}
                />
                <FormControl variant="outlined" size="small" sx={{ marginRight: '15px', backgroundColor: '#121212', width: '100px', borderRadius: '5px' }}>
                  <InputLabel sx={{
                    color: '#c8a2c8',
                    '&.Mui-focused': {
                      color: '#c8a2c8',
                    }
                  }}>Color</InputLabel>
                  <Select
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
                    value={selectedColor}
                    onChange={(e) => setSelectedColor(e.target.value)}
                    label="Color"
                  >
                    <MenuItem value="">
                      <em>None</em>
                    </MenuItem>
                    {colors.map(color => (
                      <MenuItem key={color} value={color} sx={{ color: '#c8a2c8' }}>
                        {color}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <Button onClick={handleClearSelection}><ArrowBack sx={{ color: '#c8a2c8' }} /></Button>
              </Box>
            </Box>
          )}
          {filters.length !== 0 && (
            <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', flexWrap: 'wrap', gap: '20px' }}>
              {dragonballs.map((dragonball) => (
                <Grid item >
                  <Box onClick={() => handleOpenModal(dragonball)} key={dragonball.cardUid}>
                    <img
                      loading="lazy"
                      src={dragonball.image}
                      draggable="false"
                      alt={dragonball.cardUid}
                      width={imageWidth}
                      height={imageHeight}
                    />
                  </Box>
                  <Box display={"flex"} flexDirection={"row"} gap={1} alignItems={"center"} justifyContent={"center"} sx={{ color: '#C8A2C8' }}>
                    <div component={Button} onClick={() => decrease(dragonball.cardId,dragonball.cardUid)} style={{ cursor: "pointer" }}>
                      <RemoveCircle sx={{ fontSize: 20 }} />
                    </div>
                    <span sx={{ fontSize: 20 }}>{dragonball.count || 0}</span>
                    <div component={Button} onClick={() => increase(dragonball.cardId,dragonball.cardUid)} style={{ cursor: "pointer" }}>
                      <AddCircle sx={{ fontSize: 20 }} />
                    </div>
                  </Box>
                </Grid>
              ))}
              {selectedCard && (
                <DBZCardDrawerNF
                  open={openModal}
                  onClose={handleCloseModal}
                  selectedCard={selectedCard}
                  onSwipeLeft={handleSwipeLeft}
                  onSwipeRight={handleSwipeRight}
                />
              )}
            </Box>
          )}
        </>
      )}
    </>
  );
};

export default DBZFWBuilderButtonList;
