import React, { useEffect, useRef, useState } from "react";
import { Box, Button, ButtonBase, CircularProgress, FormControl, Grid, InputLabel, MenuItem, Select, Slider } from "@mui/material";
import { AddCircle, ArrowBack, RemoveCircle } from "@mui/icons-material";
import { OPTCGCardDrawer } from "./OPTCGCardDrawer";
import { useCardState } from "../../context/useCardState";

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
const OPTCGBuilderButtonList = () => {
  const { filteredCards, setFilteredCards } = useCardState();
  const [buttonData, setButtonData] = useState([]);
  const [isButtonClicked, setIsButtonClicked] = useState(false);
  const [onepieces, setOnepieces] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const [selectedColor, setSelectedColor] = useState("");
  const [imageWidth, setImageWidth] = useState(100);
  const [isLoading, setIsLoading] = useState(false);
  const [currentViewedCards, setCurrentViewedCards] = useState([]);
  const imageHeight = imageWidth * 1.395;
  const url = `https://ap-southeast-1.aws.data.mongodb-api.com/app/data-fwguo/endpoint/optcgboosterlist?secret=${process.env.REACT_APP_SECRET_KEY}`;
  const colors = ["Red", "Blue", "Green", "Purple", "Black", "Yellow"]

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

  const fetchonepieces = async (booster) => {
    let currentPage = 1; // Start with the first page
    let allOnepieces = []; // To accumulate onepieces across multiple pages

    while (true) { // Keep fetching until no more data
      const url = `https://ap-southeast-1.aws.data.mongodb-api.com/app/data-fwguo/endpoint/onepieceData?page=${currentPage}&booster=${booster}&secret=${process.env.REACT_APP_SECRET_KEY}`;
      try {
        const response = await fetch(url);
        const result = await response.json();

        if (!result.data || result.data.length === 0) { // Stop when no data is returned
          break;
        }

        allOnepieces = [...allOnepieces, ...result.data]; // Add the new data to our accumulating array
        currentPage++; // Go to the next page for the next loop iteration

      } catch (error) {
        console.error("Failed to fetch onepieces:", error);
        break; // Exit the loop if there's an error
      }
    }

    // Sorting the data
    allOnepieces.sort((a, b) => {
      const aId = parseInt(a.cardid.split('-')[1]);
      const bId = parseInt(b.cardid.split('-')[1]);
      return aId - bId;
    });
    allOnepieces = allOnepieces.filter(onepiece => onepiece.category !== "leader");

    allOnepieces = allOnepieces.map(onepiece => ({
      ...onepiece,
      count: onepiece.count || 0
    }));

    setOnepieces(allOnepieces);
    setCurrentViewedCards(allOnepieces);
    setIsLoading(false);

    return allOnepieces;
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
    setCurrentViewedCards(onepieces);
  }, [onepieces]);

  const handleButtonClick = (booster) => {
    setIsLoading(true);
    fetchonepieces(booster).then(newonepieces => {
      const updatedOnepieces = newonepieces.map(onepiece => {
        const existingCard = filteredCards.find(card => card.cardid === onepiece.cardid);
        return {
          ...onepiece,
          count: existingCard ? existingCard.count : 0
        };
      });
      setOnepieces(updatedOnepieces);
      setIsButtonClicked(true);
      setIsLoading(false);
    });
  };

  const modifyCardCount = (cardId, change) => {
    const existingCard = filteredCards.find(card => card.cardid === cardId);

    if (existingCard) {
      let newCount = (existingCard.count || 0) + change;

      // Ensure the count is between 0 and 4 inclusive
      newCount = Math.max(0, Math.min(4, newCount));
      if (newCount === 0) {
        setFilteredCards(prevFilteredCards => prevFilteredCards.filter(card => card.cardid !== cardId));
      } else {
        setFilteredCards(prevFilteredCards => prevFilteredCards.map(card => {
          if (card.cardid === cardId) {
            return { ...card, count: newCount };
          }
          return card;
        }));
      }
    } else if (change > 0) {
      const newCard = onepieces.find(onepiece => onepiece.cardid === cardId);
      if (newCard) {
        setFilteredCards(prevFilteredCards => [...prevFilteredCards, { ...newCard, count: 1 }]);
      }
    }
  };

  const increase = (cardId) => modifyCardCount(cardId, 1);
  const decrease = (cardId) => modifyCardCount(cardId, -1);

  const sliderStyles = {
    root: {
      color: '#c8a2c8', // Change the color of the slider track and thumb
      width: 250, // Adjust the width of the slider
      padding: '10px 0',
    },
    thumb: {
      height: 24, // Adjust the size of the thumb
      width: 24,
      backgroundColor: '#fff', // Color of the thumb
      border: '2px solid currentColor',
      '&:hover, &.Mui-focusVisible': {
        boxShadow: 'inherit',
      },
    },
    track: {
      height: 8, // Adjust the height of the track
      borderRadius: 4,
    },
    rail: {
      height: 8, // Adjust the height of the rail (inactive part)
      borderRadius: 4,
    },
  };

  useEffect(() => {
    setOnepieces(prevOnepieces => {
      return prevOnepieces.map(onepiece => {
        const cardFromFiltered = filteredCards.find(card => card.cardid === onepiece.cardid);
        if (cardFromFiltered) {
          return {
            ...onepiece,
            count: cardFromFiltered.count
          };
        }
        return {
          ...onepiece,
          count: 0
        };
      });
    });
  }, [filteredCards]);

  const handleClearSelection = () => {
    setSelectedColor("");
    setIsButtonClicked(false);
    setOnepieces([]); // Clear the onepieces data
  };

  return (
    <>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '30px', paddingRight: '30px', paddingTop:{xs:'30px',sm:'30px',md:'0px'}, paddingLeft: '30px', paddingBottom: '20px', justifyContent: 'center', }}>
        {!isButtonClicked && buttonData.map((button) => (
          <MyButton
            key={button.pathname}
            alt={button.alt}
            imageSrc={button.imageSrc}
            imgWidth={button.imgWidth}
            onClick={() => handleButtonClick(button.pathname)}
          />
        ))}
      </Box>
      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          {isButtonClicked && (
            <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', marginTop:{md:'-20px'},position: 'relative' }}>
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
                  .filter(onepiece => !selectedColor || onepiece.color === selectedColor)
                  .map((onepiece) => (
                    <Grid item >
                      <Box onClick={() => handleOpenModal(onepiece)} key={onepiece.cardid}>
                        <img
                          loading="lazy"
                          src={onepiece.image}
                          draggable="false"
                          alt={onepiece.cardid}
                          width={imageWidth}
                          height={imageHeight}
                        />
                      </Box>
                      <Box display={"flex"} flexDirection={"row"} gap={1} alignItems={"center"} justifyContent={"center"} sx={{ color: '#C8A2C8' }}>
                        <div component={Button} onClick={() => decrease(onepiece.cardid)} style={{ cursor: "pointer" }}>
                          <RemoveCircle sx={{ fontSize: 20 }} />
                        </div>
                        <span sx={{ fontSize: 20 }}>{onepiece.count || 0}</span>
                        <div component={Button} onClick={() => increase(onepiece.cardid)} style={{ cursor: "pointer" }}>
                          <AddCircle sx={{ fontSize: 20 }} />
                        </div>
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
              </Box>
              <Box sx={{ position: 'sticky', bottom: 0, backgroundColor: '#121212', display: { xs: 'flex', sm: 'flex', md: 'none' }, paddingTop: '10px', paddingBottom: '10px', justifyContent: 'flex-end', alignItems: 'center' }}>
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
        </>
      )}
    </>
  );
};

export default OPTCGBuilderButtonList;
