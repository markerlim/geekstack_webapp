import React, { useEffect, useRef, useState } from "react";
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

const DTCGBuilderButtonList = ({ filteredCards, setFilteredCards }) => {
  const [buttonData, setButtonData] = useState([]);
  const [isButtonClicked, setIsButtonClicked] = useState(false);
  const [digimons, setDigimons] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const [imageWidth, setImageWidth] = useState(100);
  const [isLoading, setIsLoading] = useState(false);
  const [currentViewedCards, setCurrentViewedCards] = useState([]);
  const [allSelectedCards, setAllSelectedCards] = useState([]);
  const shouldUpdateFilteredCards = useRef(true);
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

    allDigimons = allDigimons.map(digimon => ({
      ...digimon,
      count: digimon.count || 0
    }));

    setDigimons(allDigimons);
    setCurrentViewedCards(allDigimons);
    setIsLoading(false);
    console.log(allDigimons)
    return allDigimons;
  };

  const increase = (cardId) => {
    setDigimons(prevDigimons => {
      const updatedDigimons = prevDigimons.map(digimon => {
        if (digimon.cardid === cardId) {
          return { ...digimon, count: (digimon.count || 0) + 1 };
        }
        return digimon;
      });
      return updatedDigimons;
    });
  };

  const decrease = (cardId) => {
    setDigimons(prevDigimons => {
      const updatedDigimons = prevDigimons.map(digimon => {
        if (digimon.cardid === cardId && digimon.count && digimon.count > 0) {
          return { ...digimon, count: digimon.count - 1 };
        }
        return digimon;
      });
      return updatedDigimons;
    });
  };

  useEffect(() => {
    if (shouldUpdateFilteredCards.current) {
        const cardsWithCount = digimons.filter(digimon => digimon.count && digimon.count > 0);
        setFilteredCards(cardsWithCount);
    }
    // Reset the ref for future updates
    shouldUpdateFilteredCards.current = true;
}, [digimons]);


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
    setCurrentViewedCards(digimons);
  }, [digimons]);

  const handleButtonClick = (booster) => {
    console.log("Button clicked with booster:", booster);
    setIsLoading(true);  // Start the loading process

    // After fetching the newDigimons, initialize count for them
    fetchDigimons(booster).then(newDigimons => {
        // Filter out already existing digimons
        const nonExistingDigimons = newDigimons.filter(newDigimon => 
            !digimons.some(existingDigimon => existingDigimon.cardid === newDigimon.cardid)
        );
        
        const updatedCards = [...digimons, ...nonExistingDigimons.map(digimon => ({
            ...digimon,
            count: digimon.count || 0
        }))];

        setDigimons(updatedCards);
    });

    setIsButtonClicked(true);
};


  const handleClearSelection = () => {
    shouldUpdateFilteredCards.current = false;
    setIsButtonClicked(false);
    setDigimons([]); // Clear the digimons data
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
                <button onClick={handleClearSelection}><ArrowBack /></button>
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
                      <span sx={{ fontSize: 20 }}>{digimon.count || 0}</span>
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
