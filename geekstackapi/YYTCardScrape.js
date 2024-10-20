const chromium = require('chrome-aws-lambda');
const puppeteer = require('puppeteer-core');

async function scrapeData(url) {
  let browser = null;
  try {
    // Launch the browser with chrome-aws-lambda settings
    browser = await puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath,
      headless: chromium.headless,
    });

    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle2' });

    const data = await page.evaluate(() => {
      // Find card prices in <h4> tags
      let cardlist_elements = Array.from(document.querySelectorAll('h4.fw-bold.d-inline-block'));
      if (cardlist_elements.length === 0) {
        cardlist_elements = Array.from(document.querySelectorAll('h4.fw-bold.text-danger.d-inline-block'));
      }
      const card_prices = cardlist_elements.map(elem => parseInt(elem.textContent.replace(' 円', '').replace(',', '').trim()));

      // Find card IDs in <span> tags
      const span_elements = Array.from(document.querySelectorAll('span.pote'));
      const card_ids = span_elements.map(elem => elem.textContent.trim());

      // Find card names in <h3> tags
      const h3_elements = Array.from(document.querySelectorAll('h3.fw-bold.ps-3.pt-3.pe-3.pb-3.pb-md-3'));
      const card_names = h3_elements.map(elem => elem.textContent.trim());

      // Combine card IDs, names, and prices into a list of dictionaries
      const results = [];
      for (let i = 0; i < card_ids.length; i++) {
        results.push({
          'cardid': card_ids[i],
          'cardname': card_names[i],
          'price': card_prices[i]
        });
      }
      
      return results;
    });

    return data;
  } catch (error) {
    console.error('Error during scraping:', error);
    throw error; // Re-throw the error to handle it further up the call stack
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

module.exports = scrapeData;
