import React, { useEffect, useState } from 'react';
import Chip from '@mui/material/Chip';
import TextField from '@mui/material/TextField';
import { Box } from '@mui/material';
import { Refresh } from '@mui/icons-material';


function GSearchBar({onFiltersChange, clearAllFilters}) {
    const [inputValue, setInputValue] = useState("");
    const [filters, setFilters] = useState([]);

    useEffect(() => {
        const savedFilters = sessionStorage.getItem('filters');
        if (savedFilters) {
            const parsedFilters = JSON.parse(savedFilters);
            setFilters(parsedFilters);
        }
    }, [onFiltersChange]);

    const handleInputChange = (event) => {  
        setInputValue(event.target.value.toLowerCase());
    };

    const handleKeyPress = (event) => {
        if (event.key === 'Enter' && inputValue !== '' && !filters.includes(inputValue)) {
            const newFilters = [...filters, inputValue];
            setFilters(newFilters);
            onFiltersChange(newFilters);
            sessionStorage.setItem('filters', JSON.stringify(newFilters));
            setInputValue('');
            event.preventDefault();
        }
    };

    const internalClearAllFilters = () => {
        setFilters([]);
        onFiltersChange([]);
        sessionStorage.removeItem('filters');
        if (clearAllFilters) clearAllFilters();  // This is in case you also have external logic tied to this function
    };

    const handleDelete = (filterToDelete) => () => {
        const newFilters = filters.filter((filter) => filter !== filterToDelete);
        setFilters(newFilters);
        onFiltersChange(newFilters);
        sessionStorage.setItem('filters', JSON.stringify(newFilters));
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '7px',paddingTop:'5px' }}>
            <div style={{ display: 'flex', flexDirection: 'row', alignItems: "center", gap: '7px' }}>
                <TextField
                    label="Search"
                    value={inputValue}
                    onChange={handleInputChange}
                    onKeyPress={handleKeyPress}
                    variant="filled"
                    sx={{
                        backgroundColor: '#26252D',
                        borderRadius: '10px',
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
                <Box sx={{ display: 'flex', justifyContent: 'center'}}>
                    <button
                        onClick={internalClearAllFilters}
                        style={{
                            backgroundColor: '#ff2247',
                            color: '#f2f3f8',
                            borderRadius: '10px',
                            padding: '8px 16px',
                            fontWeight: 'bold',
                            border: 'none',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease-in-out',
                            '&:hover': {
                                backgroundColor: '#ff1b35',
                                transform: 'scale(1.01)',
                            },
                        }}
                    >
                        <Refresh/>
                    </button>
                </Box>
            </div>
            <Box sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: '6px' }}>
                {filters.map((filter) => (
                    <Chip
                        key={filter}
                        label={filter}
                        onDelete={handleDelete(filter)}
                        sx={{
                            backgroundColor: '#7C4FFF',
                            color: '#000000',
                            '&:hover': {
                                backgroundColor: '#7C4FFF',
                            },
                            '&:focus': {
                                backgroundColor: '#7C4FFF',
                            },
                        }}
                    />
                ))}
            </Box>
        </div>
    );
}

export default GSearchBar;
