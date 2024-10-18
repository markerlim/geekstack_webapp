const chromium = require('chrome-aws-lambda');
const puppeteer = require('puppeteer-core');

async function scrapeFullheadData(url) {
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
      // Extract card name from <h1> with class "product_name"
      const card_name = document.querySelector('h1.product_name')?.textContent.trim() || '';

      // Extract card ID from the table under <th> "型番"
      const card_id = document.querySelector('table#detailTbl th:contains("型番") + td')?.textContent.trim() || '';

      // Extract card price from the table under <th> "販売価格"
      const price_element = document.querySelector('table#detailTbl th:contains("販売価格") + td span[data-id="makeshop-item-price"]');
      const price = price_element ? parseInt(price_element.textContent.replace('円', '').replace(',', '').trim()) : 0;

      // Extract stock availability from the table under <th> "在庫数"
      const stock_element = document.querySelector('table#detailTbl th:contains("在庫数") + td span.M_item-stock-smallstock');
      const stock = stock_element ? stock_element.textContent.trim() : 'Unknown';

      // Return the card details
      return {
        card_id,
        card_name,
        price,
        stock
      };
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

module.exports = scrapeFullheadData;
