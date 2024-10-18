import React, { useState, useEffect } from "react";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  addDoc,
} from "firebase/firestore";
import {
  Box,
  ButtonBase,
  CircularProgress,
  Modal,
  TextField,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Close, Delete, Share, Style } from "@mui/icons-material";
import { db } from "../../Firebase";
import EntryLogger from "./EntryLogger";
import LogDetail from "./LogDetail";
import GenericGoogleAd from "../AdsComponent/GenericAds";

const OnepieceDecks = ({decknamesearch}) => {
  const { currentUser } = useAuth();
  const [decks, setDecks] = useState([]);
  const [deck, setDeck] = useState(null);
  const [open, setOpen] = useState(false);
  const [entryLogOpen, setEntryLogOpen] = useState(false);
  const [description, setDescription] = useState("");
  const [selectedCards, setSelectedCards] = useState([]);
  const [cards, setCards] = useState([]);
  const [deckType, setDeckType] = useState(null);
  const [editedDeckName, setEditedDeckName] = useState("");
  const [loading, setLoading] = useState(true);
  const [logs, setLogs] = useState("");
  const [logToDelete, setLogToDelete] = useState(null); // State to hold log entry to delete
  const [selectedLog, setSelectedLog] = useState(null);
  const [logDetailOpen, setLogDetailOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false); // State to manage delete confirmation dialog


  const navigate = useNavigate();

  useEffect(() => {
    const fetchDecks = async () => {
      if (!currentUser) {
        return;
      }

      const uid = currentUser.uid;
      const querySnapshot = await getDocs(
        collection(db, `users/${uid}/optcgdecks`)
      );
      const deckDocs = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        if (doc.id !== "placeholder") {
          deckDocs.push({
            id: doc.id,
            name: data.deckName,
            colorCount: data.colorCount,
            specialCount: data.specialCount,
            finalCount: data.finalCount,
            image: data.image,
            ...data,
          });
        }
      });
      setDecks(deckDocs);
    };
    fetchDecks();
    setLoading(false);
  }, [currentUser]);

  const handleOpen = async (deck) => {
    const cardsSnapshot = await getDocs(
      collection(db, `users/${currentUser.uid}/optcgdecks/${deck.id}/optcgcards`)
    );
    const cardsData = [];
    cardsSnapshot.forEach((doc) => {
      const data = doc.data();
      cardsData.push({
        id: doc.id,
        ...data,
      });
    });
    const decksearch = decks.find((d) => d.id === deck.id);
    if (decksearch) {
      setEditedDeckName(decksearch.name);
    }

    const logsSnapshot = await getDocs(
      collection(db, `users/${currentUser.uid}/optcgdecks/${deck.id}/logs`)
    );
    const logsData = [];
    logsSnapshot.forEach((doc) => {
      const logData = doc.data();
      console.log("Fetched log data:", logData); // Inspect log data here
      logsData.push({ id: doc.id, ...logData });
    });
    setLogs(logsData);
    setCards(cardsData);
    setDeck(deck);
    setOpen(true);
  };

  const handleAddEntry = () => {
    setEntryLogOpen(true);
  };

  const refreshLogs = async () => {
    if (deck) {
      const logsSnapshot = await getDocs(
        collection(db, `users/${currentUser.uid}/optcgdecks/${deck.id}/logs`)
      );
      const logsData = [];
      logsSnapshot.forEach((doc) => {
        const logData = doc.data();
        console.log("Fetched log data:", logData); // Inspect log data here
        logsData.push({ id: doc.id, ...logData });
      });
      setLogs(logsData);
    }
  };

  const handleDeleteLog = async (logId) => {
    try {
      await deleteDoc(doc(db, `users/${currentUser.uid}/optcgdecks/${deck.id}/logs`, logId));
      setDeleteDialogOpen(false); // Close dialog
      refreshLogs(); // Refresh logs
    } catch (error) {
      console.error("Error deleting log: ", error);
    }
  };

  const handleLogClick = (log) => {
    setSelectedLog(log);
    setLogDetailOpen(true);
  };

  const filteredDecks = decks.filter((deck) =>
    deck.name.toLowerCase().includes(decknamesearch.toLowerCase())
  );

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "left",
        width: "100vw",
        gap: "20px",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          paddingLeft: "calc(5vw)",
          paddingRight: "calc(5vw)",
        }}
      >
        <span style={{ display: "flex", alignItems: "center" }}>
          <Style style={{ marginRight: "10px" }} />OPTCG Decks
        </span>
      </Box>
      {loading ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
          }}
        >
          <CircularProgress />
        </Box>
      ) : (
        <Box
          sx={{
            width: "100vw",
            display: "flex",
            flexDirection: "row",
            flexWrap: "nowrap",
            overflow: "auto",
            height: { xs: "220px", sm: "500px" },
          }}
          className="hide-scrollbar"
        >
          <div style={{ paddingLeft: "5vw" }}>
            <br />
          </div>
          {filteredDecks.length === 0 ? (
            <Box
              style={{
                textAlign: "center",
                color: "#f2f3f8",
                padding: "20px",
              }}
            >
              No One Piece Deck Found
            </Box>
          ) : (
            filteredDecks.map((deck) => (
              <Box sx={{ marginRight: "20px" }} key={deck.id}>
                <Box sx={{ textAlign: "center" }}>
                  <ButtonBase
                    onClick={() => handleOpen(deck)}

                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      bgcolor: "#121212",
                      borderRadius: 2,
                      boxShadow: 5,
                      overflow: "hidden",
                      width: { xs: 100, sm: 200 },
                      height: { xs: 150, sm: 300 },
                    }}
                  >
                    <img
                      src={deck.deckcover}
                      alt={deck.name}
                      style={{ width: "110%", height: "auto" }}
                    />
                  </ButtonBase>
                  <h3
                    style={{
                      margin: "0.5rem 0",
                      color: "#f2f3f8",
                      fontSize: "12px",
                    }}
                  >
                    {deck.name}
                  </h3>
                </Box>
              </Box>
            ))
          )}
          <div style={{ paddingLeft: "5vw" }}>
            <br />
          </div>
        </Box>
      )}

      <Modal open={open} onClose={() => setOpen(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "0px",
            left: "0px",
            width: "calc(100% - 80px)", // Subtract 20px from both sides
            height: "calc(100% - 80px)", // Subtract 20px from both top and bottom
            bgcolor: "#26262d",
            boxShadow: 24,
            m: "20px", // Add 20px margin around
            p: "20px", // Add padding inside
            display: "flex",
            flexDirection: "column",
            justifyContent: 'space-between',
            gap: "10px",
            borderRadius: 2, // Slight border-radius for smoother corners
            overflow: "auto", // Allow scrolling if content overflows
          }}
        >
          <Box sx={{
            display: 'flex'
            , flexDirection: "column",
            gap: "10px",
          }}>
            {logs.length > 0 ? (
              logs.map((log, index) => (
                <Box key={index}
                  onClick={() => handleLogClick(log)} // Add click handler here
                  sx={{ bgcolor: '#7c4fff', padding: '10px', borderRadius: '10px', display: 'flex', justifyContent: 'space-between' }}>
                  <Box>
                    <h4>{log.eventName}</h4>
                    <p>{log.eventDate}</p>
                    <p>{log.entry}</p>
                  </Box>
                  <IconButton
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent triggering the log click handler
                      console.log("Log ID to delete:", log.id);
                      setLogToDelete(log.id);
                      setDeleteDialogOpen(true);
                    }}
                  >
                    <Delete sx={{ fontSize: "16px", color: '#f44336' }} />
                  </IconButton>
                </Box>
              ))
            ) : (<>
              <GenericGoogleAd />
              <p style={{ color: '#f2f3f8', textAlign: 'center' }}>There are no entries for this deck yet</p>
            </>
            )}
            <GenericGoogleAd />
            <Box sx={{ bgcolor: '#7C4FFF', padding: '10px', borderRadius: '10px' }} onClick={() => handleAddEntry()}
            >
              Add Entry
            </Box>
          </Box>
          <Box
            sx={{ bgcolor: '#d14a5b', padding: '3px', textAlign: 'center' }}
            onClick={() => setOpen(false)}
          >
            <Close />
          </Box>
        </Box>
      </Modal>
      <Modal
        open={logDetailOpen}
        onClose={() => setLogDetailOpen(false)}
      >
        <LogDetail
          log={selectedLog}
          onClose={() => setLogDetailOpen(false)}
          cards={cards}
          deck={deck}
          currentUser={currentUser} />
      </Modal>
      <EntryLogger
        currentUser={currentUser}
        deck={deck}
        cards={cards}
        setOpen={setOpen}
        entryLogOpen={entryLogOpen}
        setEntryLogOpen={setEntryLogOpen}
        content={"onepiece"}
        refreshLogs={refreshLogs} />
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <p>Are you sure you want to delete this log entry?</p>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={() => {
              console.log("Deleting log with ID:", logToDelete); // Add this log
              if (logToDelete) {
                handleDeleteLog(logToDelete);
              }
            }}
            color="error"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default OnepieceDecks;
