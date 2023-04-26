import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../Firebase";
import { useAuth } from "../context/AuthContext";
import { Box, Grid, Stack } from "@mui/material";
import { ResponsiveImage } from "../components/ResponsiveImage";
import { CardModal } from "../components/CardModal";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import BottomNav from "../components/BottomNav";
import { BarChart, Bar, XAxis, YAxis, Tooltip, LabelList } from "recharts";

const DeckCardLoader = () => {
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

  const createChartData = (stats) => {
    return Object.entries(stats).map(([key, value]) => {
      return { key, value };
    });
  };

  const energyChartData = createChartData(energyStats);
  const apChartData = createChartData(apStats);
  const categoryChartData = createChartData(categoryStats);


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
      const querySnapshot = await getDocs(collection(db, `users/${uid}/decks/${deckId}/cards`));
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
    <div>
      <Box bgcolor={"#121212"} color={"#f2f3f8"}>
        <Navbar />
        <Stack direction="row" spacing={2} justifyContent={"space-between"}>
          <Box flex={2} sx={{ display: { xs: "none", sm: "none", md: "block" } }}>
            <Sidebar />
          </Box>
          <Box id="stats-and-cards" flex={10} sx={{ display: "flex", flexDirection: "row" }}>
            <Box flex={8} p={1} sx={{ overflowY: "auto", height: "86vh" }} className="hide-scrollbar">
              <Grid container spacing={2} justifyContent="center">
                {cards.map((card) => (
                  <Grid item key={card.id}>
                    <Box display={"flex"} flexDirection={"column"} sx={{ textAlign: "center" }}>
                      <ResponsiveImage
                        loading="lazy"
                        src={card.image}
                        draggable="false"
                        alt={card.front}
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
            </Box>
            <Box flex={2} p={1} sx={{ display: { xs: "none", sm: "none", md: "block" }, textAlign: "left", color: "#f2f3f8" }}>
              <h3>Energy Cost Breakdown:</h3>
              <BarChart width={200} height={200} data={energyChartData}>
                <XAxis dataKey="key" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#8B7BEF">
                  <LabelList dataKey="value" position="top" />
                </Bar>
              </BarChart>

              <h3>AP Cost Breakdown:</h3>
              <BarChart width={200} height={160} data={apChartData}>
                <XAxis dataKey="key" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#70C7F9">
                  <LabelList dataKey="value" position="top" />
                </Bar>
              </BarChart>

              <h3>Card Type Breakdown:</h3>
              <BarChart width={200} height={160} data={categoryChartData}>
                <XAxis dataKey="key" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#FC86F0">
                  <LabelList dataKey="value" position="top" />
                </Bar>
              </BarChart>
              <Box sx={{ display: { xs: "none", sm: "block" }, textAlign: "center" }}><img style={{ width: "auto", height: "50px" }} alt="uniondeck" src="/icons/uniondecklogosmall.png" /></Box>
            </Box>
          </Box>
        </Stack>
        <Box flex={2} sx={{ display: { xs: "block", sm: "block", md: "none" } }}><BottomNav /></Box>
      </Box>
    </div>
  );
};

export default DeckCardLoader;
