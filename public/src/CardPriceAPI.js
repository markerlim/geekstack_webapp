const express = require('express');
const cors = require('cors');
const scrapeYYTData = require('./YYTCardScrape.js'); // Import the Puppeteer script
const scrapeDORAData = require('./DORACardScrape.js'); // Import the Puppeteer script

const app = express();
const port = 4003;

app.use(cors({ origin: 'http://localhost:3000' })); // Allow requests from the frontend

app.get('/api/getYYTCardData', async (req, res) => {
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ error: 'URL is required' });
  }

  let decodedUrl;
  try {
    decodedUrl = decodeURIComponent(url); // Decode the URL
    const data = await scrapeYYTData(decodedUrl);
    res.json(data);
  } catch (error) {
    console.error(error); // Log the error for debugging
    res.status(500).json({ error: `Failed to fetch data from ${decodedUrl}` });
  }
});

app.get('/api/getDORACardData', async (req, res) => {
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ error: 'URL is required' });
  }

  let decodedUrl;
  try {
    decodedUrl = decodeURIComponent(url); // Decode the URL
    const data = await scrapeDORAData(decodedUrl);
    res.json(data);
  } catch (error) {
    console.error(error); // Log the error for debugging
    res.status(500).json({ error: `Failed to fetch data from ${decodedUrl}` });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
