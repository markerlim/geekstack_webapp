import { Add } from "@mui/icons-material";
import { Box } from "@mui/material";
import React from "react";
import { Link } from "react-router-dom";

const CreateDeckBtn = ({ contentType }) => {
  // Determine the pathname based on contentType
  let pathname;
  switch (contentType) {
    case "onepiece":
      pathname = "/optcgbuilder";
      break;
    case "dragonballz":
      pathname = "/dbzfwbuilder";
      break;
    case "unionarena":
      pathname = "/deckbuilder";
      break;
    default:
      pathname = "/"; // Fallback to root if contentType doesn't match
  }

  return (
    <Box component={Link}
      to={pathname}
      sx={{
        position: 'absolute',
        zIndex: 1001,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        textDecoration: 'none',
        borderRadius: { xs: '50%', sm: '50%', md: '30px' },
        width: { xs: '50px', sm: '50px', md: '200px' },
        height: '50px',
        bgcolor: '#7C4FFF',
        right: { xs: '15px', sm: '15px', md: '30px' },
        bottom: { xs: '90px', sm: '90px', md: '60px' }
      }}>
      <Box sx={{ display: { xs: 'none', sm: 'none', md: 'block' },fontSize: '17px',color:'#f2f3f8',marginRight:'10px' }}>Create Deck</Box>
      <Add sx={{ fontSize: '30px', color: '#f2f3f8' }} />
    </Box>
  );
};

export default CreateDeckBtn;