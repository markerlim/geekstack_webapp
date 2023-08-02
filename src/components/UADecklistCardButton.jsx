import { Box, Drawer, IconButton } from "@mui/material";
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

const UADecklistCardButton = () => {
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
          const data = doc.data()
          const date = data.sharedDate.toDate();// Convert firestore timestamp to Javascript Date
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
        const data = doc.data()
        const date = data.sharedDate.toDate();
        const formattedDate = formatDate(date);
        decks.push({ id: doc.id, ...data, sharedDate: formattedDate });
      });
      setDeckData(decks);
    });
    return unsubscribe;
  }, []);
  return (
    <>
      {deckData.map((deck) => (
        <Box sx={{
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            transform: 'translateY(-5px) scale(1.05)',
            transition: 'all 0.2s ease-in-out'
          }
        }}>
          <Box sx={{ width: "500px", paddingTop: "20px", paddingBottom: "20px", paddingLeft: "20px", borderRadius: "20px", bgcolor: "#26252D", display: "flex", gap: "20px", flexDirection: "row", cursor: "pointer", position: "relative" }} onClick={() => {
            setSelectedDeckCards(deck.cards);
            setDrawerOpen(true);
          }}>
            <Box sx={{ width: "150px", height: "150px", borderRadius: "75px", overflow: "hidden", flex: "0 0 auto", border: "4px solid #7C4FFF" }}>
              <img src={deck.selectedCards[0].imagesrc} alt="test" width={"300px"} style={{ marginLeft: "-73px", marginTop: "-70px" }} />
            </Box>
            <Box sx={{ color: "#f2f3f8", display: "flex", flexDirection: "column", gap: "5px", justifyContent: "start", alignItems: "start" }}>
              <strong style={{ fontSize: "25px" }}>{deck.deckName}</strong>
              <span style={{ fontSize: "20px", display: "flex", alignItems: "center" }}><img style={{ width: "30px", borderRadius: "15px" }} src={deck.photoURL} alt={deck.displayName} />{deck.displayName}</span>
              <span>{deck.description}</span>
            </Box>
            <Box position="absolute" sx={{ bottom: "20px", flexWrap: "nowrap", left: "190px" }}>
              <span style={{ padding: "5px", borderRadius: "5px", fontSize: "12px", backgroundColor: "#7C4FFF", color: "#f2f3f8", fontWeight: "900", marginRight: "10px" }}>{deck.selectedCards[0].id}</span>
              <span style={{ padding: "5px", borderRadius: "5px", fontSize: "12px", backgroundColor: "#7C4FFF", color: "#f2f3f8", fontWeight: "500", marginRight: "10px" }}>{deck.selectedCards[1].id}</span>
              <span style={{ padding: "5px", borderRadius: "5px", fontSize: "12px", backgroundColor: "#7C4FFF", color: "#f2f3f8", fontWeight: "500", marginRight: "10px" }}>{deck.selectedCards[2].id}</span>
            </Box>
            <Box position="absolute" sx={{ top: "20px", flexWrap: "nowrap", right: "20px" }}><span style={{ fontWeight: "900", color: "#7C4FFF" }}>{deck.sharedDate}</span></Box>
            <Box position="absolute" sx={{ bottom: "15px", flexWrap: "nowrap", right: "20px", display: "flex", alignItems: "center" }} onClick={(event) => handleVote(deck.id, deck.upvotedUsers, event)}>
              <span style={{ marginRight: "5px", color: "#f2f3f8", fontSize: "20px" }}>{deck.upvotedUsers?.length || 0}</span>
              <ThumbUp style={{ color: deck.upvotedUsers && deck.upvotedUsers.includes(userId) ? "#74CFFF" : "white" }} />
            </Box>
          </Box>
        </Box>
      ))}
      <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <Box
          sx={{ display: "flex", padding: "20px", flexWrap: "wrap", width: "600px", gap: "10px", justifyContent: "center",backgroundColor:"#26252D"}}
        >
          {selectedDeckCards.map((card, index) => (
            <div style={{ position: "relative" }}>
              <Box sx={{ position: "absolute", bottom:"15px",left:"50%",transform: "translateX(-50%)",zIndex:"3"}}>
                <div style={{fontSize:"20px",color:"#74CFFF"}}><strong>{card.count}</strong></div>
              </Box>
              <Box sx={{ position: "absolute", bottom:"5px",left:"50%",transform: "translateX(-50%)",zIndex:"2"}}>
                <Pentagon sx={{fontSize:'40px',color:'#11172d'}}/>
              </Box>
              <ResponsiveImage key={index} src={card.image} alt={card.cardName} />
            </div>
          ))}
        </Box>
        <IconButton onClick={() => setDrawerOpen(false)}>
          <Close />
        </IconButton>
      </Drawer>
    </>
  )
}

export default UADecklistCardButton