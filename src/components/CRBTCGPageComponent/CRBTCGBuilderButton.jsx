import React, { useEffect, useState } from "react";
import { Box, Button, ButtonBase, FormControl, Grid, InputLabel, MenuItem, Select, Slider } from "@mui/material";
import { AddCircle, ArrowBack, RemoveCircle } from "@mui/icons-material";
import { CRBTCGCardDrawerNF } from "./CRBTCGCardDrawerFormatted";
import { useCRBCardState } from "../../context/useCardStateCookieRun";
import axios from "axios";

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
          style={{ width: "110%", height: "auto" }}
        />
      </ButtonBase>
    </div>
  );
};


const CRBTCGBuilderButtonList = ({ filters, isButtonClicked, setIsButtonClicked, setChangeClick }) => {
  const { filteredCards, setFilteredCards } = useCRBCardState();
  const [buttonData, setButtonData] = useState([]);
  const [cookieruns, setCookieruns] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const [selectedColor, setSelectedColor] = useState("");
  const [imageWidth, setImageWidth] = useState(100);
  const [isLoading, setIsLoading] = useState(false);
  const [currentViewedCards, setCurrentViewedCards] = useState([]);
  const imageHeight = imageWidth * 1.395;
  const url = "https://geekstack.up.railway.app/api/boosterlist/cookierunbraverse";
  const colors = ["red", "blue", "green", "yellow","purple"]


  const handleOpenModal = (dragonball) => {
    setSelectedCard(dragonball);
    setOpenModal(true);
  };
  const handleCloseModal = () => {
    setSelectedCard(null);
    setOpenModal(false);
  };
  const handleSwipeLeft = () => {
    const currentIndex = cookieruns.findIndex((doc) => doc.cardUid === selectedCard.cardUid);
    const nextIndex = (currentIndex + 1) % cookieruns.length;
    setSelectedCard(cookieruns[nextIndex]);
  };
  const handleSwipeRight = () => {
    const currentIndex = cookieruns.findIndex((doc) => doc.cardUid === selectedCard.cardUid);
    const prevIndex = (currentIndex - 1 + cookieruns.length) % cookieruns.length;
    setSelectedCard(cookieruns[prevIndex]);
  };

  const fetchCookies = async (booster) => {
    try {
      const response = await axios.get(
        `https://geekstack.up.railway.app/api/cookierunbraverse/${booster}?page=0&size=100`
      );
    
      const data = response.data.content;
  
      console.log("Empty" ,response);
      // Ensure data is an array before proceeding
      if (!Array.isArray(data)) {
        throw new Error("Unexpected response format: data is not an array");
      }
  
      const sortedData = data.sort((a, b) => {
        const getBaseCardUid = (cardUid) => {
          const match = cardUid.match(/(\D+)-(\d+)(_ALT)?/);
          if (!match) return [cardUid, 0, ""]; // Fallback if no match
          return [match[1], parseInt(match[2], 10), match[3] || ""];
        };
      
        const [setA, numA, altA] = getBaseCardUid(a.cardUid);
        const [setB, numB, altB] = getBaseCardUid(b.cardUid);
      
        // First, compare the set prefix (e.g., "BS2")
        if (setA < setB) return -1;
        if (setA > setB) return 1;
      
        // Then, compare the numeric part
        if (numA < numB) return -1;
        if (numA > numB) return 1;
      
        // Finally, handle `_ALT` suffix to place it after the base
        if (altA && !altB) return 1;
        if (!altA && altB) return -1;
      
        return 0; // If all parts are equal
      });

      // Map data to add default count
      const allCookies = sortedData.map((cookie) => ({
        ...cookie,
        count: cookie.count || 0,
      }));
  
      // Update state and return results
      console.log(allCookies);
      setCookieruns(allCookies);
      setCurrentViewedCards(allCookies);
      setIsLoading(false);
  
      return allCookies;
    } catch (error) {
      console.error("Error fetching data:", error);
      setIsLoading(false); // Ensure loading state is updated even on error
    }
  };
  
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("https://geekstack.up.railway.app/api/boosterlist/cookierunbraverse");
        
        console.log(response.data[0]);
        const sortedData = response.data.sort((a, b) => {
          return a.order[0] > b.order[0] ? 1 : -1;
        });
  
        setButtonData(sortedData.reverse()); 
        } catch (error) {
        console.error("Fetch booster data error:", error);
      }
    };
  
    fetchData();
  }, [url]);
  

  useEffect(() => {
    setCurrentViewedCards(cookieruns);
  }, [cookieruns]);

  const handleButtonClick = (booster) => {
    setIsLoading(true);
    console.log(booster);
    fetchCookies(booster).then(newCookies => {
      const updatedCookies = newCookies.map(cookies => {
        const existingCard = filteredCards.find(card => card.cardUid === cookies.cardUid);
        return {
          ...cookies,
          count: existingCard ? existingCard.count : 0
        };
      });
      setCookieruns(updatedCookies);
      setIsButtonClicked(true);
      setIsLoading(false);
    });
  };


  useEffect(() => {
    setCookieruns([]);
  }, [filters]);


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
        const newCard = cookieruns.find(cookies => cookies.cardUid === cardUid);
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
    setCookieruns(prevCookies => {
      return prevCookies.map(cookies => {
        const cardFromFiltered = filteredCards.find(card => card.cardUid === cookies.cardUid);
        if (cardFromFiltered) {
          return {
            ...cookies,
            count: cardFromFiltered.count
          };
        }
        return {
          ...cookies,
          count: 0
        };
      });
    });
  }, [filteredCards]);

  const handleClearSelection = () => {
    setSelectedColor("");
    setIsButtonClicked(false);
    setCookieruns([]);
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
                  .filter(cookieruns => !selectedColor || cookieruns.energyType === selectedColor)
                  .map((cookieruns) => (
                    <Grid item key={cookieruns.cardUid}>
                      <Box onClick={() => handleOpenModal(cookieruns)} >
                        <img
                          loading="lazy"
                          src={cookieruns.urlimage}
                          draggable="false"
                          alt={cookieruns.cardUid}
                          width={imageWidth}
                          height={imageHeight}
                        />
                      </Box>
                      <Box display={"flex"} flexDirection={"row"} gap={1} alignItems={"center"} justifyContent={"center"} sx={{ color: '#C8A2C8' }}>
                        <div component={Button} onClick={() => decrease(cookieruns.cardId,cookieruns.cardUid)} style={{ cursor: "pointer" }}>
                          <RemoveCircle sx={{ fontSize: 20 }} />
                        </div>
                        <span sx={{ fontSize: 20 }}>{cookieruns.count || 0}</span>
                        <div component={Button} onClick={() => increase(cookieruns.cardId,cookieruns.cardUid)} style={{ cursor: "pointer" }}>
                          <AddCircle sx={{ fontSize: 20 }} />
                        </div>
                      </Box>
                    </Grid>
                  ))}
                {selectedCard && (
                  <CRBTCGCardDrawerNF
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
              {cookieruns.map((cookie) => (
                <Grid item >
                  <Box onClick={() => handleOpenModal(cookie)} key={cookie.cardUid}>
                    <img
                      loading="lazy"
                      src={cookie.urlimage}
                      draggable="false"
                      alt={cookie.cardUid}
                      width={imageWidth}
                      height={imageHeight}
                    />
                  </Box>
                  <Box display={"flex"} flexDirection={"row"} gap={1} alignItems={"center"} justifyContent={"center"} sx={{ color: '#C8A2C8' }}>
                    <div component={Button} onClick={() => decrease(cookie.cardId,cookie.cardUid)} style={{ cursor: "pointer" }}>
                      <RemoveCircle sx={{ fontSize: 20 }} />
                    </div>
                    <span sx={{ fontSize: 20 }}>{cookie.count || 0}</span>
                    <div component={Button} onClick={() => increase(cookie.cardId,cookie.cardUid)} style={{ cursor: "pointer" }}>
                      <AddCircle sx={{ fontSize: 20 }} />
                    </div>
                  </Box>
                </Grid>
              ))}
              {selectedCard && (
                <CRBTCGCardDrawerNF
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

export default CRBTCGBuilderButtonList;
