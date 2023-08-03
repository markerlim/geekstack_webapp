import { Box, Drawer, IconButton, Typography } from "@mui/material";
import { arrayRemove, arrayUnion, collection, doc, getDocs, increment, onSnapshot, updateDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { auth, db } from "../Firebase";
import { Close, Pentagon, ThumbUp } from "@mui/icons-material";
import { ResponsiveImage } from "./ResponsiveImage";

function formatDate(date) {
  const day = date.getDate();
  const monthIndex = date.getMonth();
  const year = date.getFullYear();

  const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const monthName = monthNames[monthIndex];

  return `${day} ${monthName} ${year}`;
}

const UADecklistCardButton = ({ filters, dateFilter, onSelectedCardClick }) => {
  const [deckData, setDeckData] = useState([]);
  const [userId, setUserId] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedDeckCards, setSelectedDeckCards] = useState([]);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        setUserId(user.uid);
      } else {
        setUserId(null);
      }
    });
    return unsubscribe; // clean up on unmount
  }, []);

  const handleVote = async (id, upvotedUsers = [], event) => {
    event.stopPropagation();
    const deckRef = doc(db, 'uniondecklist', id);
    try {
      if (upvotedUsers.includes(userId)) {
        await updateDoc(deckRef, {
          upvotedUsers: arrayRemove(userId),
        });
      } else {
        await updateDoc(deckRef, {
          upvotedUsers: arrayUnion(userId),
        });
      }
    } catch (error) {
      console.error("Error updating document: ", error);
    }
  };

  useEffect(() => {
    const fetchDeckData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "uniondecklist"));
        const decks = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          const date = data.sharedDate.toDate(); // Convert firestore timestamp to Javascript Date
          const formattedDate = formatDate(date);
          decks.push({ id: doc.id, ...data, sharedDate: formattedDate });
        });
        setDeckData(decks);
      } catch (error) {
        console.error("Error fetching deck data: ", error);
      }
    };
    fetchDeckData();

    const unsubscribe = onSnapshot(collection(db, "uniondecklist"), (snapshot) => {
      const decks = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        const date = data.sharedDate.toDate();
        const formattedDate = formatDate(date);
        decks.push({ id: doc.id, ...data, sharedDate: formattedDate });
      });
      setDeckData(decks);
    });
    return unsubscribe;
  }, []);

  // Apply filters and date filter
  const filteredData = deckData.filter(deck => {
    // Apply filters
    const filterMatch = filters.every(filter => deck.selectedCards.some(card => card.id === filter || card.name === filter));
    // Apply date filter
    const dateMatch = (!dateFilter[0] || new Date(deck.sharedDate) >= dateFilter[0]) && (!dateFilter[1] || new Date(deck.sharedDate) <= dateFilter[1]);
    return filterMatch && dateMatch;
  });

  const imgStyles = {
    width: { xs: '150px', sm: '300px' },
    marginLeft: { xs: '-36.5px', sm: '-73px' },
    marginTop:{ xs: '-35px', sm: '-70px' },
  };


  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '20px', justifyContent: 'center' }}>
      {filteredData.filter(deck => filters.every(filter => deck.selectedCards.some(card => card.id === filter || card.name === filter))).map((deck) => (
        <Box sx={{
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            transform: 'translateY(-5px) scale(1.05)',
            transition: 'all 0.2s ease-in-out'
          }
        }}>
          <Box sx={{ width: { xs: "80vw", sm: "500px" }, paddingTop: "20px", paddingBottom: "20px", paddingLeft: "20px", borderRadius: "20px", bgcolor: "#26252D", display: "flex", gap: "20px", flexDirection: "row", cursor: "pointer", position: "relative" }} onClick={() => {
            setSelectedDeckCards(deck.cards);
            setDrawerOpen(true);
          }}>
            <Box sx={{ width: { xs: "80px", sm: "150px" }, height: { xs: "80px", sm: "150px" }, borderRadius: { xs: "40px", sm: "75px" }, overflow: "hidden", flex: "0 0 auto", border: { xs: "2px solid #7C4FFF", sm: "4px solid #7C4FFF" } }}>
              <Box component="img" src={deck.selectedCards[0].imagesrc} alt="test" sx={imgStyles} />
            </Box>
            <Box sx={{ color: "#f2f3f8", display: "flex", flexDirection: "column", gap: "5px", justifyContent: "start", alignItems: "start" }}>
              <Typography  sx={{ fontSize: {xs:'18px',sm:"25px"} }}><strong>{deck.deckName}</strong></Typography>
              <Typography sx={{ fontSize: {xs:'16px',sm:"20px"}, display: "flex", alignItems: "center" }}><Box component="img" sx={{ width: {xs:"20px",sm:"30px"}, borderRadius: {xs:"10px",sm:"15px"} }} src={deck.photoURL} alt={deck.displayName} />{deck.displayName}</Typography>
              <Box sx={{height:"50px",display:{xs:'block',sm:'none'}}}></Box>
              <Typography sx={{display:{xs:'none',sm:'block'}}}>{deck.description}</Typography>
            </Box>
            <Box position="absolute" sx={{ bottom: "20px", flexWrap: "nowrap", left:{xs:"20px",sm:"190px"}, }}>
              <span
                className="uatags-effect"
                onClick={(event) => {
                  event.stopPropagation();
                  onSelectedCardClick(deck.selectedCards[0].id);
                }}>
                {deck.selectedCards[0].id}
              </span>
              <span
                className="uatags-effect"
                onClick={(event) => {
                  event.stopPropagation();
                  onSelectedCardClick(deck.selectedCards[1].id);
                }}>
                {deck.selectedCards[1].id}
              </span>
              <span
                className="uatags-effect"
                onClick={(event) => {
                  event.stopPropagation();
                  onSelectedCardClick(deck.selectedCards[2].id);
                }}>
                {deck.selectedCards[2].id}
              </span>
            </Box>
            <Box position="absolute" sx={{ top: "20px", flexWrap: "nowrap", right: "20px" }}><span style={{ fontWeight: "900", color: "#7C4FFF" }}>{deck.sharedDate}</span></Box>
            <Box position="absolute" sx={{ bottom: "15px", flexWrap: "nowrap", right: "20px", display: "flex", alignItems: "center" }} onClick={(event) => handleVote(deck.id, deck.upvotedUsers, event)}>
              <span style={{ marginRight: "5px", color: "#f2f3f8", fontSize: "20px" }}>{deck.upvotedUsers?.length || 0}</span>
              <ThumbUp sx={{
                color: deck.upvotedUsers && deck.upvotedUsers.includes(userId) ? "#74CFFF" : "white",
                transition: "opacity 0.2s ease-in-out", // Add transition for smooth effect
                '&:hover': {
                  opacity: 0.7, // Dim the content on hover
                },
              }} />
            </Box>
          </Box>
        </Box>
      ))}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      >
        <Box sx={{ backgroundColor: "#26252D", height: "100%" }}>
          <Box
            sx={{ display: "flex",width: { xs: "100%", sm: "500px", md: "700px" },justifyContent: "center", backgroundColor: "#26252D" }}
          ><Box sx={{display:"flex",justifyContent: "center", flexWrap: "wrap",paddingTop:"30px",gap: "10px",}}>
            {selectedDeckCards.map((card, index) => (
              <div style={{ position: "relative" }}>
                <Box sx={{ position: "absolute", bottom: "15px", left: "50%", transform: "translateX(-50%)", zIndex: "3" }}>
                  <div style={{ fontSize: "20px", color: "#74CFFF" }}><strong>{card.count}</strong></div>
                </Box>
                <Box sx={{ position: "absolute", bottom: "5px", left: "50%", transform: "translateX(-50%)", zIndex: "2" }}>
                  <Pentagon sx={{ fontSize: '40px', color: '#11172d' }} />
                </Box>
                <ResponsiveImage key={index} src={card.image} alt={card.cardName} />
              </div>
            ))}
            </Box>
          </Box>
          <Box sx={{ padding: "20px", backgroundColor: "#26252D", }}>
            <Box sx={{
              backgroundColor: "#ff2247", padding: "10px", borderRadius: "10px", textAlign: "center", fontWeight: "900", transition: 'all 0.2s ease-in-out', cursor: 'pointer', '&:hover': {
                transform: 'translateY(-5px) scale(1.01)',
                transition: 'all 0.2s ease-in-out'
              }
            }} onClick={() => setDrawerOpen(false)}>
              <Close />
            </Box>
          </Box>
        </Box>
      </Drawer>
    </Box>
  )
}

export default UADecklistCardButton