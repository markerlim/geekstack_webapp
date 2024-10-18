const functions = require('firebase-functions');
const express = require('express');
const cors = require('cors');
const scrapeYYTData = require('./YYTCardScrape.js'); // Puppeteer script
const scrapeDORAData = require('./DORACardScrape.js'); // Puppeteer script
const scrapeFULLAData = require('./FULLACardScrape.js');

const app = express();

app.use(cors({ origin: true })); // Enable CORS for all origins

// Define the scrape routes
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

app.get('/api/getFULLACardData', async (req, res) => {
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ error: 'URL is required' });
  }

  let decodedUrl;
  try {
    decodedUrl = decodeURIComponent(url); // Decode the URL
    const data = await scrapeFULLAData(decodedUrl);
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

// Export the Express app as a Firebase Cloud Function
exports.api = functions.runWith({
  memory: '1GB',  // Increase memory to 1GiB
  timeoutSeconds: 540, // Set the timeout as needed
}).https.onRequest(app);