import { Box, Button, Drawer, Modal, Typography } from "@mui/material";
import { arrayRemove, arrayUnion, collection, deleteDoc, doc, getDoc, getDocs, limit, onSnapshot, orderBy, query, startAfter, updateDoc, where } from "firebase/firestore";
import React, { useContext, useEffect, useRef, useState } from "react";
import { db } from "../Firebase";
import { Close, Delete, Pentagon, ThumbUp } from "@mui/icons-material";
import { ResponsiveImage } from "./ResponsiveImage";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

function formatDate(date) {
  const day = date.getDate();
  const monthIndex = date.getMonth();
  const year = date.getFullYear();

  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];

  const monthName = monthNames[monthIndex];

  return `${day} ${monthName} ${year}`;
}

const UADecklistCardButton = ({ filters, onSelectedCardClick }) => {
  const [deckData, setDeckData] = useState([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedDeckCards, setSelectedDeckCards] = useState([]);
  const [selectedDeckDescription, setSelectedDeckDescription] = useState("");
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [deckToDelete, setDeckToDelete] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [isPaginating, setIsPaginating] = useState(false);// Pagination check
  const [canPaginateNext, setCanPaginateNext] = useState(true);//lastpage check

  const navigate = useNavigate();

  const authContext = useContext(AuthContext);
  const userId = authContext.currentUser?.uid;

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

  const handleDeleteRequest = (id, event) => {
    event.stopPropagation();
    setDeckToDelete(id);
    setConfirmDeleteOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      const deckRef = doc(db, 'uniondecklist', deckToDelete);
      await deleteDoc(deckRef);
      console.log("Deck successfully deleted!");
      setConfirmDeleteOpen(false);
    } catch (error) {
      console.error("Error deleting deck: ", error);
    }
  };

  const querySnapshotRef = useRef(null);

  const querySnapshotStackRef = useRef([]); // to keep track of the pagination history

  useEffect(() => {
    const fetchDeckData = async () => {
      setIsPaginating(true);
      try {
        let lastSharedDate;

        if (currentPage > querySnapshotStackRef.current.length) {
          if (querySnapshotRef.current && querySnapshotRef.current.docs.length > 0) {
            lastSharedDate = querySnapshotRef.current.docs[querySnapshotRef.current.docs.length - 1].data().sharedDate;
            querySnapshotStackRef.current.push(lastSharedDate); // push last shared date to the stack before going to the next page
          }
        } else {
          lastSharedDate = querySnapshotStackRef.current[querySnapshotStackRef.current.length - 2]; // get last shared date from the stack when going to the previous page
          querySnapshotStackRef.current.pop(); // remove the current last shared date from the stack
        }

        console.log(filters)

        let deckQuery;

        if (filters.length > 0) {
          deckQuery = query(
            collection(db, "uniondecklist"),
            orderBy("sharedDate", "desc"),
            limit(itemsPerPage),
            ...(lastSharedDate ? [startAfter(lastSharedDate)] : []),
            where('animecode', 'in', filters),
          );
        } else {
          deckQuery = query(
            collection(db, "uniondecklist"),
            orderBy("sharedDate", "desc"),
            limit(itemsPerPage),
            ...(lastSharedDate ? [startAfter(lastSharedDate)] : [])
          );
        }
        const newQuerySnapshot = await getDocs(deckQuery);
        if (newQuerySnapshot.docs.length > 0) {
          querySnapshotRef.current = newQuerySnapshot;
        }
        console.log('Number of docs returned:', newQuerySnapshot.docs.length);
        setCanPaginateNext(newQuerySnapshot.docs.length === itemsPerPage);

        const docsCount = querySnapshotRef.current.docs.length;
        if (docsCount === 0) {
          setIsPaginating(false);
          return; // No more documents to fetch
        }

        const decks = [];
        for (let deckDoc of querySnapshotRef.current.docs) {
          const data = deckDoc.data();
          if (data.uid) {
            const userDoc = await getDoc(doc(db, 'users', data.uid));
            if (userDoc.exists()) {
              const userData = userDoc.data();
              data.photoURL = userData.photoURL;
              data.displayName = userData.displayName;
            }
          }
          const date = data.sharedDate.toDate();
          const formattedDate = formatDate(date);
          decks.push({ id: deckDoc.id, ...data, sharedDate: formattedDate });
        }
        decks.sort((a, b) => new Date(b.sharedDate) - new Date(a.sharedDate));
        setDeckData(decks);

      } catch (error) {
        console.error("Error fetching deck data: ", error);
      }
      console.log(deckData);
      setIsPaginating(false);
    };

    if (isPaginating) {
      fetchDeckData();
    }

    // Set up real-time listener
    const changelistener = onSnapshot(collection(db, "uniondecklist"), snapshot => {
      fetchDeckData();  // This will re-fetch the data whenever there's a change in the Firestore collection.
    });

    return () => {
      // Clean up the listener when the component unmounts
      changelistener();
    };
  }, [currentPage, filters]);
  // Adding dependencies here to re-run useEffect when they change.  
  console.log("deckdata", deckData)
  const imgStyles = {
    width: { xs: '150px', sm: '300px' },
    marginLeft: { xs: '-36.5px', sm: '-73px' },
    marginTop: { xs: '-35px', sm: '-70px' },
  };


  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Box sx={{ display: 'flex', justifyContent: 'center', paddingBottom: '10px' }}>
        <Button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((prev) => (isPaginating ? prev : prev - 1))}
          sx={{
            color: '#c8a2c8',
            '&.Mui-disabled': {
              color: '#614d61'
            }
          }}
        >
          Prev
        </Button>
        <Button
          disabled={!canPaginateNext}
          onClick={() => setCurrentPage((prev) => (isPaginating ? prev : prev + 1))}
          sx={{
            color: '#c8a2c8',
            '&.Mui-disabled': {
              color: '#614d61'
            }
          }}
        >
          Next
        </Button>
      </Box>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '20px', justifyContent: 'center' }}>
        {deckData.map((deck) => (
          <Box sx={{
            transition: 'all 0.2s ease-in-out',
            '&:hover': {
              transform: 'translateY(-5px) scale(1.05)',
              transition: 'all 0.2s ease-in-out'
            }
          }}
            key={deck.id} >
            <Box sx={{ width: { xs: "80vw", sm: "500px" }, height: { sm: '200px' }, paddingTop: "20px", paddingBottom: "20px", paddingLeft: "20px", borderRadius: "20px", bgcolor: "#26252D", display: "flex", gap: "20px", flexDirection: "row", cursor: "pointer", position: "relative" }} onClick={() => {
              setSelectedDeckCards(deck.cards);
              setSelectedDeckDescription(deck.description);
              setDrawerOpen(true);
            }}>
              <Box sx={{ width: { xs: "80px", sm: "150px" }, height: { xs: "80px", sm: "150px" }, borderRadius: { xs: "40px", sm: "75px" }, overflow: "hidden", flex: "0 0 auto", border: { xs: "2px solid #7C4FFF", sm: "4px solid #7C4FFF" } }}>
                <Box component="img" src={deck.selectedCards[0].imagesrc} alt="test" sx={imgStyles} />
              </Box>
              <Box sx={{ color: "#f2f3f8", display: "flex", flexDirection: "column", gap: "7px", justifyContent: "start", alignItems: "start" }}>
                <Typography sx={{ fontSize: { xs: '18px', sm: "18px" } }}><strong>{deck.deckName}</strong></Typography>
                <Box onClick={(event) => {
                  event.stopPropagation();
                  navigate(`/profile/${deck.uid}`)
                }}>
                  <Box sx={{ fontSize: { xs: '12px', sm: "16px" }, display: "flex", alignItems: "center" }}><Box sx={{ width: { xs: "12px", sm: "20px" }, height: { xs: "12px", sm: "20px" }, overflow: 'hidden', display: 'flex', justifyContent: 'center', alignItems: 'center', borderRadius: { xs: "10px", sm: "15px" } }}>
                    <Box component="img" sx={{ width: { xs: "12px", sm: "20px" } }} src={deck.photoURL} alt={deck.displayName} /></Box>
                    {deck.displayName}
                  </Box>
                </Box>
                <Box sx={{ display: { xs: 'block', sm: 'none' } }}><span style={{ fontWeight: "900", color: "#7C4FFF" }}>{deck.sharedDate}</span></Box>
                <Box sx={{ height: "40px", display: { xs: 'block', sm: 'none' } }}></Box>
                <Typography sx={{ display: { xs: 'none', sm: 'block' } }}>{deck.description}</Typography>
              </Box>
              <Box position="absolute" sx={{ bottom: "20px", flexWrap: "nowrap", left: { xs: "20px", sm: "190px" }, }}>
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
              <Box position="absolute" sx={{ top: "20px", flexWrap: "nowrap", right: "20px", display: { xs: 'none', sm: 'block' } }}><span style={{ fontSize: '15px', fontWeight: "900", color: "#74CFFF" }}>{deck.sharedDate}</span></Box>
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
              {userId === deck.uid && (
                <Box position="absolute" sx={{ bottom: { xs: '60px', sm: "20px" }, left: { xs: '80px', sm: "85px" }, color: '#ff2247' }}>
                  <span onClick={(event) => handleDeleteRequest(deck.id, event)}><Delete /></span>
                </Box>
              )}
            </Box>
          </Box>
        ))}
        <Drawer
          anchor="right"
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
        >
          <Box sx={{ backgroundColor: "#26252D", height: "100%" }}>
            <Box sx={{ display: "flex", width: { xs: "100%", sm: "500px", md: "700px" }, justifyContent: "center", backgroundColor: "#26252D" }}>
              <Box sx={{ display: "flex", justifyContent: "center", flexWrap: "wrap", paddingTop: "30px", gap: "10px", }}>
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
            <Box sx={{ color: "#f2f3f8", backgroundColor: "#26252D", textAlign: "center", paddingTop: '20px', paddingBottom: '20px' }}>
              <strong>Short Description:</strong><br /><br />{selectedDeckDescription}
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
        <Modal
          open={confirmDeleteOpen}
          onClose={() => setConfirmDeleteOpen(false)}
        >
          <Box sx={{ width: '300px', margin: 'auto', marginTop: '20%', padding: '20px', backgroundColor: 'white', borderRadius: '8px' }}>
            <Typography variant="h6" gutterBottom>
              Are you sure you want to delete this deck?
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
              <Button variant="outlined" onClick={() => setConfirmDeleteOpen(false)}>Cancel</Button>
              <Button variant="contained" color="primary" onClick={handleConfirmDelete}>Delete</Button>
            </Box>
          </Box>
        </Modal>
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'center', paddingBottom: '10px' }}>
        <Button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((prev) => (isPaginating ? prev : prev - 1))}
          sx={{
            color: '#c8a2c8',
            '&.Mui-disabled': {
              color: '#614d61'
            }
          }}
        >
          Prev
        </Button>
        <Button
          disabled={!canPaginateNext}
          onClick={() => setCurrentPage((prev) => (isPaginating ? prev : prev + 1))}
          sx={{
            color: '#c8a2c8',
            '&.Mui-disabled': {
              color: '#614d61'
            }
          }}
        >
          Next
        </Button>
      </Box>
    </Box>
  )
}

export default UADecklistCardButton