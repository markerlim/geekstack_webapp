import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, CircularProgress } from '@mui/material';

const PricecheckYYT = ({ url }) => {
    const [price, setPrice] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchYYTCardData = async () => {
            if (!url) return; // Don't fetch if the URL is not provided

            try {
                setLoading(true);
                setError(null); // Reset any previous error
                const encodedUrl = encodeURIComponent(url); // Encode the URL
                const response = await axios.get(`https://api-yge56t7e6q-uc.a.run.app/api/getYYTCardData`, { params: { url: encodedUrl } });
                setPrice(response.data[0].price); // Assuming response contains array with the price
            } catch (err) {
                setError('Error fetching YYT data');
                console.error('Error fetching YYT data:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchYYTCardData();
    }, [url]); // Trigger the fetch when the URL prop changes

    return (
        <Box>
            {loading ? <CircularProgress/> : <span>YYT:{price}</span>}
        </Box>
    );
};

export default PricecheckYYT;