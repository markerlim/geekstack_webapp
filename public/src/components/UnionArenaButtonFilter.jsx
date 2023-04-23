import { Box } from "@mui/material";
import React from "react";

const UAButtons = ({ handleBoosterChange, boosterNames }) => {
  return (
    <Box display="flex" justifyContent="center" alignItems="center" flexWrap="wrap" gap={2}>
      {boosterNames.map((boosterName) => (
        <button
          key={boosterName}
          onClick={() => handleBoosterChange(boosterName)}
          style={{
            border: "none",
            borderRadius:"5px",
            backgroundColor: "purple",
            color: "white",
            fontSize: "1.2rem",
            cursor: "pointer",
            padding: "4px 8px",
          }}
        >
          {boosterName}
        </button>
      ))}
    </Box>
  );
};

export {UAButtons};
