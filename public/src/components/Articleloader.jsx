import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../Firebase";
import { useAuth } from "../context/AuthContext";
import { Box, Grid, Stack } from "@mui/material";
import { CardModal } from "../components/CardModal";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import BottomNav from "../components/BottomNav";

const Articleloader = () => {
  const { currentUser } = useAuth();
  const { deckId } = useParams();

  console.log("Deck ID:", deckId);
  const [cards, setCards] = useState([]);
  const [selectedCard, setSelectedCard] = useState(null);
  const [openModal, setOpenModal] = useState(false);

  const [energyStats, setEnergyStats] = useState({});
  const [apStats, setApStats] = useState({});
  const [categoryStats, setCategoryStats] = useState({});

  const calculateStats = () => {
    const energyCounts = cards.reduce((acc, card) => {
      acc[card.energycost] = (acc[card.energycost] || 0) + card.count;
      return acc;
    }, {});

    const apCounts = cards.reduce((acc, card) => {
      acc[card.apcost] = (acc[card.apcost] || 0) + card.count;
      return acc;
    }, {});

    const categoryCounts = cards.reduce((acc, card) => {
      acc[card.category] = (acc[card.category] || 0) + card.count;
      return acc;
    }, {});

    setEnergyStats(energyCounts);
    setApStats(apCounts);
    setCategoryStats(categoryCounts);
  };

  const handleOpenModal = (cardId) => {
    const cardsData = JSON.parse(localStorage.getItem("temporaryDocument"));
    const selectedCardData = cardsData.find((card) => card.cardId === cardId);
    setSelectedCard(selectedCardData);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setSelectedCard(null);
    setOpenModal(false);
  };

  useEffect(() => {
    const fetchCards = async () => {
      if (!currentUser) {
        return;
      }

      const uid = currentUser.uid;
      const querySnapshot = await getDocs(collection(db, `uniondecklist`));
      const cardDocs = [];
      querySnapshot.forEach((doc) => {
        cardDocs.push(doc.data());
      });
      setCards(cardDocs);
      console.log(cardDocs)
      // Log the fetched cards to the console
      console.log("Fetched cards:", cardDocs);
    };

    fetchCards();
  }, [currentUser, deckId]);

  useEffect(() => {
    // Save the cards to the localStorage
    localStorage.setItem("temporaryDocument", JSON.stringify(cards));
  }, [cards]);

  useEffect(() => {
    calculateStats();
  }, [cards]);


  return (
    <div >
      <Box bgcolor={"#121212"} color={"#f2f3f8"} minHeight="100vh">
        <Navbar />
        <Stack direction="row" spacing={2} justifyContent={"space-between"}>
          <Box flex={2} sx={{ display: { xs: "none", sm: "none", md: "block" } }}>
            <Sidebar />
          </Box>
          <Box id="stats-and-cards" flex={10} sx={{ display: "flex", flexDirection: "row" }}>
            <Box flex={8} p={1} sx={{ overflowY: "auto", height: { xs: "calc(100vh - 112px)", sm: "calc(100vh - 112px)", md: "calc(100vh - 64px)" }, }} className="hide-scrollbar">
              <Grid container spacing={2} justifyContent="center">
                {cards.map((card) => (
                  <Grid item key={card.id}>
                    <Box display={"flex"} flexDirection={"column"} sx={{ textAlign: "center" }}>
                      <img
                        loading="lazy"
                        src={card.image}
                        draggable="false"
                        alt={card.front}
                        className="image-responsive"
                        onClick={() => handleOpenModal(card.cardId)}
                      />
                      <span>{card.count}</span>
                    </Box>
                  </Grid>
                ))}
                <div style={{ height: '300px' }} />
                {selectedCard && (
                  <CardModal
                    open={openModal}
                    onClose={handleCloseModal}
                    selectedCard={selectedCard}
                  />
                )}
              </Grid>
              <div style={{ height: "100px" }} />
            </Box>
            <Box flex={2} p={1} sx={{ display: { xs: "none", sm: "none", md: "block" }, textAlign: "left", color: "#f2f3f8" }}>

              <Box sx={{ display: { xs: "none", sm: "block" } }}><img style={{ width: "auto", height: 150 }} alt="uniondeck" src="/icons/uniondecklogo.png" /></Box>
            </Box>
          </Box>
        </Stack>
        <Box flex={2} sx={{ display: { xs: "block", sm: "block", md: "none" } }}>
          <BottomNav />
        </Box>
      </Box>
    </div>
  );
};

export default Articleloader;
