import React, { useEffect, useRef, useState } from "react";
import { Box, Button, ButtonBase, CircularProgress, Grid } from "@mui/material";
import { AddCircle, ArrowBack, RemoveCircle } from "@mui/icons-material";
import { CardOnepieceModal } from "../OPTCGPageComponent/CardOnepieceModal";
import { OPTCGCardDrawer } from "./OPTCGCardDrawer";

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
const OPTCGBuilderButtonList = ({ filteredCards, setFilteredCards }) => {
  const [buttonData, setButtonData] = useState([]);
  const [isButtonClicked, setIsButtonClicked] = useState(false);
  const [onepieces, setOnepieces] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const [imageWidth, setImageWidth] = useState(100);
  const [isLoading, setIsLoading] = useState(false);
  const [currentViewedCards, setCurrentViewedCards] = useState([]);
  const imageHeight = imageWidth * 1.395;
  const url = `https://ap-southeast-1.aws.data.mongodb-api.com/app/data-fwguo/endpoint/optcgboosterlist?secret=${process.env.REACT_APP_SECRET_KEY}`;

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

  const increase = (cardId) => {
    updateCardCount(cardId, 1);
  };

  const decrease = (cardId) => {
    updateCardCount(cardId, -1);
  };

  const updateCardCount = (cardId, change) => {
    setOnepieces(prevonepieces => {
      const updatedonepieces = prevonepieces.map(onepiece => {
        if (onepiece.cardid === cardId) {
          const newCount = (onepiece.count || 0) + change;
          if (newCount > 0) {
            const updatedFilteredCards = [...filteredCards];
            const existingCardIndex = updatedFilteredCards.findIndex(card => card.cardid === cardId);
            if (existingCardIndex !== -1) {
              updatedFilteredCards[existingCardIndex].count = newCount;
            } else {
              updatedFilteredCards.push({ ...onepiece, count: newCount });
            }
            setFilteredCards(updatedFilteredCards);
          } else if (newCount === 0) {
            setFilteredCards(prevFilteredCards => prevFilteredCards.filter(card => card.cardid !== cardId));
          }
          return { ...onepiece, count: newCount };
        }
        return onepiece;
      });
      return updatedonepieces;
    });
  };
  

  const handleClearSelection = () => {
    setIsButtonClicked(false);
    setOnepieces([]); // Clear the onepieces data
  };

  return (
    <>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '30px', paddingRight: '30px', paddingLeft: '30px', paddingTop: '20px', justifyContent: 'center', }}>
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
            <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <Box>
                <button onClick={handleClearSelection}><ArrowBack /></button>
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', flexWrap: 'wrap', gap: '20px' }}>
                {currentViewedCards.map((onepiece) => (
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
            </Box>
          )}
        </>
      )}
    </>
  );
};

export default OPTCGBuilderButtonList;
