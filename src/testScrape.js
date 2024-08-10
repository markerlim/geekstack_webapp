// testScrape.js

const scrapeData = require('./DORACardScrape.js'); // Adjust the path if necessary

async function test() {
  const url = 'https://dorasuta.jp/union-arena/product?pid=542095'; // Replace with the actual URL you want to scrape
  try {
    const data = await scrapeData(url);
    console.log(data);
  } catch (error) {
    console.error('Error:', error);
  }
}

test();
