import React, { useState } from 'react';
import { Box, Button, Typography, MenuItem } from "@mui/material";
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

const EventDropdown = ({ label, options, selectedValue, onChange }) => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(!open);
  const handleSelect = (value) => {
    onChange(value);
    setOpen(false); // Close dropdown after selection
  };

  return (
    <Box sx={{ position: 'relative', width: '50%',height:'auto' }}>
      {/* Dropdown button to show selected value */}
      <Button
        onClick={handleOpen}
        endIcon={<ArrowDropDownIcon />}
        sx={{
          justifyContent: 'space-between',
          width: '100%',
          height:'100%',
          textAlign: 'left',
          border: '1px solid rgba(0, 0, 0, 0.23)',
          bgcolor: '#f2f3f8',
          color: '#636364',
          textTransform: "none"

        }}
      >
        <Typography>{selectedValue ? selectedValue : label}</Typography>
      </Button>
      {/* Dropdown menu */}
      {open && (
        <Box
          sx={{
            position: 'absolute',
            top: '60px', // Below the button
            width: '100%',
            border: '1px solid rgba(0, 0, 0, 0.23)',
            borderRadius: '8px',
            backgroundColor: '#fff',
            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.2)',
            zIndex: 10,
            maxHeight: '200px', // Limit height for overflow
            overflowY: 'auto', // Enable scroll when options overflow
          }}
        >
          {options.map((option, index) => (
            <MenuItem
              key={index}
              onClick={() => handleSelect(option)}
              sx={{
                cursor: 'pointer',
                padding: '10px',
                '&:hover': {
                  backgroundColor: '#f1f1f1',
                },
              }}
            >
              <Typography>{option}</Typography>
            </MenuItem>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default EventDropdown;
