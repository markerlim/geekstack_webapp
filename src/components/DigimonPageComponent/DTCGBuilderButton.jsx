import React, { useEffect, useState } from "react";
import { Box, Button, ButtonBase, CircularProgress, Grid } from "@mui/material";
import { CardDigimonModal } from "./CardDigimonModal";
import { AddCircle, ArrowBack, RemoveCircle } from "@mui/icons-material";

const MyButton = ({ pathname, alt, imageSrc, imgWidth, onClick }) => {
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
          width: { xs: 125, md: 125, lg: 200 },
          height: { xs: 188, md: 188, lg: 300 },
        }}
        onClick={onClick}
      >
        <img
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

const DTCGBuilderButtonList = ({filteredCards, setFilteredCards, countArray, setCountArray }) => {
  const [buttonData, setButtonData] = useState([]);
  const [isButtonClicked, setIsButtonClicked] = useState(false);
  const [digimons, setDigimons] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const [imageWidth, setImageWidth] = useState(100);
  const [isLoading, setIsLoading] = useState(false);
  const [currentViewedCards, setCurrentViewedCards] = useState([]);
  const [allSelectedCards, setAllSelectedCards] = useState([]);
  const imageHeight = imageWidth * 1.395;
  const url = `https://ap-southeast-1.aws.data.mongodb-api.com/app/data-fwguo/endpoint/dtcgboosterlist?secret=${process.env.REACT_APP_SECRET_KEY}`;

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

  const fetchDigimons = async (booster) => {
    let currentPage = 1; // Start with the first page
    let allDigimons = []; // To accumulate digimons across multiple pages

    while (true) { // Keep fetching until no more data
      const url = `https://ap-southeast-1.aws.data.mongodb-api.com/app/data-fwguo/endpoint/digimonData?page=${currentPage}&booster=${booster}&secret=${process.env.REACT_APP_SECRET_KEY}`;
      try {
        const response = await fetch(url);
        const result = await response.json();

        if (!result.data || result.data.length === 0) { // Stop when no data is returned
          break;
        }

        allDigimons = [...allDigimons, ...result.data]; // Add the new data to our accumulating array
        currentPage++; // Go to the next page for the next loop iteration

      } catch (error) {
        console.error("Failed to fetch Digimons:", error);
        break; // Exit the loop if there's an error
      }
    }

    // Sorting the data
    allDigimons.sort((a, b) => {
      const aId = parseInt(a.cardid.split('-')[1]);
      const bId = parseInt(b.cardid.split('-')[1]);
      return aId - bId;
    });

    setDigimons(allDigimons);
    setCurrentViewedCards(allDigimons);
    setIsLoading(false);
  };

  const updateCardCount = (cardsArray, cardId, operation) => {
    return cardsArray.map(card => {
        if(card.cardid === cardId) {
            if (operation === "increase") {
                card.count = (card.count || 0) + 1;
            } else if (operation === "decrease" && card.count && card.count > 0) {
                card.count -= 1;
            }
        }
        return card;
    });
  };

  const increase = (cardId) => {
    setCountArray(prevCount => ({
      ...prevCount,
      [cardId]: (prevCount[cardId] || 0) + 1
    }));

    setCurrentViewedCards(prev => updateCardCount(prev, cardId, "increase"));
    setAllSelectedCards(prev => updateCardCount(prev, cardId, "increase"));
  };

  const decrease = (cardId) => {
    setCountArray(prevCount => {
      if (!prevCount[cardId] || prevCount[cardId] <= 0) return prevCount;
      return {
        ...prevCount,
        [cardId]: prevCount[cardId] - 1
      };
    });
    setCurrentViewedCards(prev => updateCardCount(prev, cardId, "decrease"));
    setAllSelectedCards(prev => updateCardCount(prev, cardId, "decrease"));
  };

  useEffect(() => {
    const savedCount = localStorage.getItem('cardCount');
    if (savedCount) {
      setCountArray(JSON.parse(savedCount));
    }

    const savedFilteredCards = localStorage.getItem('filteredCards');
    if (savedFilteredCards) {
      setFilteredCards(JSON.parse(savedFilteredCards));
    }

  }, []);

  useEffect(() => {
    localStorage.setItem('cardCount', JSON.stringify(countArray));
  
    if (digimons.length) {
      // Filter out the digimons which have a count and that count is greater than 0
      const cardsWithCounts = digimons.filter(digimon => countArray[digimon.cardid] && countArray[digimon.cardid] > 0);
        
      // Combine previous filteredCards with the new cardsWithCounts
      // Using a Set to ensure no duplicates
      const combinedCardsSet = new Set([...filteredCards, ...cardsWithCounts]);
      const combinedCardsArray = [...combinedCardsSet];
    
      // Remove the cards from combinedCardsArray where count is zero or not present
      const finalFilteredCards = combinedCardsArray.filter(card => countArray[card.cardid] && countArray[card.cardid] > 0);
  
      setFilteredCards(finalFilteredCards);
      localStorage.setItem('filteredCards', JSON.stringify(finalFilteredCards));
    }
  
  }, [countArray, digimons]);
  

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(url);
        const result = await response.json();
        const data = result.data;

        // Extract the 'pathname' from each object in the data array
        const extractedPathnames = data.map((item) => item.pathname);

        // Sort the extracted pathnames alphabetically
        extractedPathnames.sort();

        // Create a new array by sorting the original data array based on the sorted pathnames
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

  const handleButtonClick = (booster) => {
    console.log("Button clicked with booster:", booster);
    setIsLoading(true);  // Start the loading process
    fetchDigimons(booster);
    setIsButtonClicked(true);
  };

  const handleClearSelection = () => {
    setIsButtonClicked(false);
    setDigimons([]); // Clear the digimons data too
  };

  return (
    <>
      {!isButtonClicked && buttonData.map((button) => (
        <MyButton
          key={button.pathname}
          pathname={button.pathname}
          alt={button.alt}
          imageSrc={button.imageSrc}
          imgWidth={button.imgWidth}
          onClick={() => handleButtonClick(button.pathname)}
        />
      ))}
      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          {isButtonClicked && (
            <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <Box>
                <button onClick={handleClearSelection}><ArrowBack/  ></button>
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', flexWrap: 'wrap', gap: '20px' }}>
                {currentViewedCards.map((digimon) => (
                  <Grid item >
                    <Box onClick={() => handleOpenModal(digimon)} key={digimon.cardid}>
                      <img
                        loading="lazy"
                        src={digimon.images}
                        draggable="false"
                        alt={digimon.cardid}
                        width={imageWidth}
                        height={imageHeight}
                      />
                    </Box>
                    <Box display={"flex"} flexDirection={"row"} gap={1} alignItems={"center"} justifyContent={"center"}>
                      <div component={Button} onClick={() => decrease(digimon.cardid)} style={{ cursor: "pointer" }}>
                        <RemoveCircle sx={{ fontSize: 20 }} />
                      </div>
                      <span sx={{ fontSize: 20 }}>{countArray[digimon.cardid] || 0}</span>
                      <div component={Button} onClick={() => increase(digimon.cardid)} style={{ cursor: "pointer" }}>
                        <AddCircle sx={{ fontSize: 20 }} />
                      </div>
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
              </Box>
            </Box>
          )}
        </>
      )}
    </>
  );
};

export default DTCGBuilderButtonList;
