import { Button, TextField, Modal, Box, IconButton, Select, MenuItem, Typography } from "@mui/material";
import { addDoc, collection } from "firebase/firestore";
import React, { useState, useEffect } from "react";
import { Close } from "@mui/icons-material";
import { CountryDropdown } from 'react-country-region-selector'; // Dropdown to select country
import { db } from "../../Firebase"; // Firebase connection
import CardSearch from "./CardSearch";
import CountrySearch from "../CountryDropdown";
import EventDropdown from "../EventDropdown";


// Card Picker Modal Component
const CardPickerModal = ({ open, onClose, cards, onCardSelect, deckcover }) => {
  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          bgcolor: '#26262d',
          color: '#f2f3f8',
          padding: '20px',
          borderRadius: '10px',
          height: '80%',
          width: '80%',
          maxWidth: '500px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography variant="h6" gutterBottom>
          Pick a Card
        </Typography>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            flexWrap: 'wrap',
            gap: '10px',
            width: '100%',
            height: '100%',
            overflowY: 'auto',
          }}
        >
          {deckcover != null ? <Box
            sx={{
              width: '80px',
              height: '120px',
              cursor: 'pointer',
              border: '2px solid transparent',
              borderRadius: '10px',
              overflow: 'hidden',
              '&:hover': {
                borderColor: '#d14a5b',
              },
            }}
            onClick={() => {
              onCardSelect(deckcover);
              onClose(); // Close modal after card selection
            }}
          >
            <img src={deckcover} alt={`leader`} style={{ width: '100%', height: '100%' }} />
          </Box> : null}
          {cards && cards.map((card, index) => (
            <Box
              key={index}
              sx={{
                width: '80px',
                height: '120px',
                cursor: 'pointer',
                border: '2px solid transparent',
                borderRadius: '10px',
                overflow: 'hidden',
                '&:hover': {
                  borderColor: '#d14a5b',
                },
              }}
              onClick={() => {
                onCardSelect(card.image);
                onClose(); // Close modal after card selection
              }}
            >
              <img src={card.image} alt={`Card ${index + 1}`} style={{ width: '100%', height: '100%' }} />
            </Box>
          ))}
        </Box>
        <IconButton
          onClick={onClose}
          sx={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            color: '#fff',
          }}
        >
          <Close />
        </IconButton>
      </Box>
    </Modal>
  );
};

const EntryLogger = ({ currentUser, cards, deck, setOpen, entryLogOpen, setEntryLogOpen, refreshLogs, content }) => {
  const [eventDate, setEventDate] = useState("");
  const [eventName, setEventName] = useState("");
  const [eventCaption, setEventCaption] = useState("");
  const [country, setCountry] = useState("");
  const [openSearchbar, setOpenSearchbar] = useState(false);
  const [boxpst, setBoxpst] = useState(null); // Track which box to update
  const [boxindex, setBoxindex] = useState(null);
  const [selectedCardUrl, setSelectedCardUrl] = useState("");
  const [isCardModalOpen, setIsCardModalOpen] = useState(false);
  const deckpath = content ? (
    content === 'unionarena' ? `decks` :
      content === 'onepiece' ? `optcgdecks` :
        content === 'dragonballzfw' ? `dbzfwdecks` :
          `decks` // Default to decks if content type is not specified
  ) : `decks`;

  const listofUATNY = ['Casuals','Struggle Battle', 'One Battle Cup', 'Meet Up Event', 'Championship 2024', 'Shop Battle', 'Uni-ticket Battle', 'Bandai Card Fest']
  const listofOPTNY = ['Casuals','8 Packs Battle', 'Standard Battle', 'Meet Up Event', 'Championship 2024', 'Flagship Battle', 'Bandai Card Fest']
  const listofDBZTNY = ['Casuals','Shop Battle', 'Meet Up Event', 'Ultimate Battle']

  const [rounds, setRounds] = useState([{ result: "", goFirst: "", cards: [null, null, null] }]);
  const eventList = content === 'unionarena' ? listofUATNY : content === 'onepiece' ? listofOPTNY : content === 'dragonballzfw' ? listofDBZTNY : [];

  useEffect(() => {
    if (entryLogOpen) {
      setRounds([{ result: "", goFirst: "", cards: [null, null, null] }]); // Reset rounds when modal opens
    }
  }, [entryLogOpen]);

  const handleLogSubmit = async () => {
    if (!eventDate || !eventName || !eventCaption || !country) {
      console.log("Validation failed: Missing eventDate, eventName, or country.");
      return;
    }

    if (rounds.some(round => !round.result || !round.goFirst)) {
      console.log("Validation failed: Some rounds are missing a result or goFirst.");
      return;
    }

    console.log(rounds); // Log the rounds structure for debugging
    try {
      await addDoc(collection(db, `users/${currentUser.uid}/${deckpath}/${deck.id}/logs`), {
        eventDate,
        eventName,
        eventCaption,
        country,
        rounds,
        selectedCardUrl,
        timestamp: new Date(),
      });

      setEventDate("");
      setEventName("");
      setEventCaption("");
      setCountry("");
      setSelectedCardUrl("");
      setRounds([{ result: "", goFirst: "", cards: [null, null, null] }]);
      refreshLogs();
      setEntryLogOpen(false);
    } catch (error) {
      console.error("Error logging entry: ", error);
    }
  };
  // Function to open modal
  const handlePickingImage = () => {
    setIsCardModalOpen(true);
  };
  // Function to handle card selection
  const handleCardSelect = (cardUrl) => {
    setSelectedCardUrl(cardUrl); // Set the selected card's image URL
  };

  const handleClose = () => {
    setRounds([{ result: "", goFirst: "", cards: [null, null, null] }]);
    setEventDate("");
    setEventCaption("");
    setEventName("");
    setCountry("");
    setEntryLogOpen(false);
  };

  const addRound = () => {
    if (rounds.length < 10) {
      setRounds([...rounds, { result: "", goFirst: "", cards: [null, null, null] }]);
    }
  };

  const deleteRound = (index) => {
    if (rounds.length > 1) {
      setRounds(rounds.filter((_, i) => i !== index));
    }
  };

  const updateRound = (index, key, value) => {
    const updatedRounds = rounds.map((round, i) =>
      i === index ? { ...round, [key]: value } : round
    );
    setRounds(updatedRounds);
  };

  const promptSearchbar = (boxpst, boxindex) => () => {
    setBoxpst(boxpst);
    setBoxindex(boxindex);
    setOpenSearchbar(true);
  };

  const handleCardSelection = ({ urlimage }) => {
    if (boxpst !== null && boxindex !== null) {
      const updatedRounds = [...rounds];
      updatedRounds[boxindex].cards[boxpst] = urlimage;
      setRounds(updatedRounds);
      setOpenSearchbar(false);
    }
  };
  const cardPickerDeckCover = (content === 'onepiece' || content === 'dragonballzfw') && deck?.deckcover ? deck.deckcover : null;

  return (
    <>
      <Modal open={entryLogOpen} onClose={handleClose}>
        <Box
          sx={{
            position: "absolute",
            top: "40%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "#f2f3f8",
            boxShadow: 24,
            p: "20px",
            width: "calc(100vw - 50px)",
            maxWidth:'800px',
            borderRadius: 2,
            display: "flex",
            flexDirection: "column",
            gap: "10px",
          }}
        >
          <TextField
            label="Date"
            type="date"
            value={eventDate}
            onChange={(e) => setEventDate(e.target.value)}
            fullWidth
          />
          <TextField
            label="Event Caption"
            value={eventCaption}
            onChange={(e) => setEventCaption(e.target.value)}
            inputProps={{ maxLength: 24 }}
            fullWidth
          />
          <Box sx={{ display: 'flex', gap: '10px' }}>
            <CountrySearch
              value={country}
              onChange={(val) => setCountry(val)}
              width={"50%"}
            />
          <EventDropdown
            label="Select Event"
            options={eventList}
            selectedValue={eventName}
            onChange={setEventName} // Update eventName state on selection
          />
          </Box>
          <Box sx={{
            height: '100px',
            width: '100%',
            border: "1px solid rgba(0, 0, 0, 0.23)",
            borderRadius: '8px',
            backgroundImage: `url('${selectedCardUrl}')`,
            backgroundSize: 'cover', // Changed to cover for better background scaling
            backgroundPosition: '0% 25%', // Changed to center for better alignment
          }}
            onClick={handlePickingImage}
          >

          </Box>
          <Box
            sx={{
              maxHeight: 200,
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
              mt: 2,
              mb: 2,
            }}
          >
            {rounds.map((round, index) => (
              <Box key={index} sx={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <Select
                  value={round.result}
                  onChange={(e) => updateRound(index, 'result', e.target.value)}
                  displayEmpty
                  fullWidth
                  sx={{ width: '65px',height:'40px' }}
                >
                  <MenuItem value=""><em></em></MenuItem>
                  <MenuItem value="Win">Win</MenuItem>
                  <MenuItem value="Lose">Lose</MenuItem>
                  <MenuItem value="Draw">Draw</MenuItem>
                </Select>
                <Select
                  value={round.goFirst}
                  onChange={(e) => updateRound(index, 'goFirst', e.target.value)}
                  displayEmpty
                  fullWidth
                  sx={{ width: '65px', height:'40px'}}

                >
                  <MenuItem value=""><em></em></MenuItem>
                  <MenuItem value="1ST">1ST</MenuItem>
                  <MenuItem value="2ND">2ND</MenuItem>
                </Select>
                <Box sx={{ display: 'flex', flexDirection: 'row', gap: '5px' }}>
                  {[0, 1, 2].map((pos) => (
                    <Box
                      key={pos}
                      onClick={promptSearchbar(pos, index)}
                      sx={{
                        width: '40px', height: '40px', display: 'flex', justifyContent: 'center', alignItems: 'center', border:
                          '1px solid #26262d',
                        borderRadius: '8px',
                        overflow: 'hidden'
                      }}
                    >
                      {round.cards[pos] ? <img src={round.cards[pos]} style={{ width: '120%', marginTop: '40%' }} alt="Card" /> : "+"}
                    </Box>
                  ))}
                </Box>
                <IconButton sx={{ width: '20px' }} onClick={() => deleteRound(index)} disabled={rounds.length === 1}>
                  <Close />
                </IconButton>
              </Box>
            ))}
          </Box>

          {/* Button to add another round (max 10) */}
          {rounds.length < 10 && (
            <Button variant="outlined" color="primary" onClick={addRound}>
              Add Another Round
            </Button>
          )}
          <CardSearch
            openSearchbar={openSearchbar}
            setOpenSearchbar={setOpenSearchbar}
            boxpst={boxpst}
            boxindex={boxindex}
            handleCardSelection={handleCardSelection}
            content={content} />
          {/* Submit button */}
          <Button variant="contained" color="primary" onClick={handleLogSubmit}>
            Submit
          </Button>
        </Box>
      </Modal>
      {/* Modal for selecting a card */}
      <CardPickerModal
        open={isCardModalOpen}
        onClose={() => setIsCardModalOpen(false)}
        cards={cards}
        onCardSelect={handleCardSelect}
        deckcover={cardPickerDeckCover}
      />
    </>
  );
};

export default EntryLogger;
