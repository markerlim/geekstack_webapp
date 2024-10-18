import React, { useState } from "react";
import BottomNav from "../components/BottomNav";
import { Box, TextField } from "@mui/material";
import NavbarPrompt from "../components/NavbarPromptLogin";
import Sidebar from "../components/Sidebar";
import UnionarenaDecks from "../components/DeckDiaryComponent/UnionarenaDecks";
import OnepieceDecks from "../components/DeckDiaryComponent/OnepieceDecks";
import DragonballzFWDecks from "../components/DeckDiaryComponent/DragonballzFWDecks";

const Deckdiary = () => {
  // Add state for deck name search
  const [decknamesearch, setDecknameSearch] = useState("");

  // Handle search input change
  const handleSearchChange = (event) => {
    setDecknameSearch(event.target.value);
  };

  return (
    <div>
      <Box color={"#f2f3f8"}>
        <NavbarPrompt />
        <Box>
          <Box sx={{ display: { xs: "none", sm: "none", md: "block" } }}>
            <Sidebar />
          </Box>
          <Box
            sx={{
              marginLeft: { xs: "0px", sm: "0px", md: "100px" },
              positon: "relative",
              paddingLeft: "15px",
              paddingRight: "15px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              height: "calc(100vh - 74px)",
            }}
            overflowY={"auto"}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: "0px",
                justifyContent: "center",
                alignItems:'center'
              }}
            >
              <Box
                sx={{
                  fontSize: "20px",
                  paddingTop: "20px",
                  paddingBottom: "20px",
                  textAlign: "center",
                }}
              >
                MatchUp Log
              </Box>

              {/* Search Input */}
              <TextField
                label="Search Deck"
                value={decknamesearch}
                onChange={handleSearchChange}
                sx={{
                    backgroundColor: '#26252D',
                    borderRadius: '10px',marginBottom: "20px", width: "80%",
                    '& input': {
                        color: '#f2f3f8',
                    },
                    '& label': {
                        color: '#f2f3f8',
                    },
                    '& label.Mui-focused': {
                        color: '#f2f3f8',
                    },
                    '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                            borderColor: 'transparent',
                        },
                        '&:hover fieldset': {
                            borderColor: 'transparent',
                        },
                        '&.Mui-focused fieldset': {
                            borderColor: 'transparent',
                        },
                    },
                }}
              />

              {/* Deck Components */}
              <UnionarenaDecks decknamesearch={decknamesearch} />
              <OnepieceDecks decknamesearch={decknamesearch} />
              <DragonballzFWDecks decknamesearch={decknamesearch} />
            </Box>
            <div style={{ height: "1px", padding: "20px" }}>
              <br />
            </div>
          </Box>
          <Box sx={{ display: { sm: "block", md: "none" } }}>
            <BottomNav />
          </Box>
        </Box>
      </Box>
    </div>
  );
};

export default Deckdiary;
