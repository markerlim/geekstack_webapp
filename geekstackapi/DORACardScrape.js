const chromium = require('chrome-aws-lambda');
const puppeteer = require('puppeteer-core');

async function scrapeData(url) {
  let browser = null;
  try {
    browser = await puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath,
      headless: chromium.headless,
    });
    
    const page = await browser.newPage();

    // Set user-agent and additional headers
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
    await page.setExtraHTTPHeaders({
      'Accept-Language': 'en-US,en;q=0.9',
    });

    // Additional settings to avoid detection
    await page.evaluateOnNewDocument(() => {
      Object.defineProperty(navigator, 'webdriver', {
        get: () => false,
      });
    });

    await page.evaluateOnNewDocument(() => {
      // Overwrite the `plugins` property to use a custom getter
      Object.defineProperty(navigator, 'plugins', {
        get: () => [1, 2, 3, 4, 5],
      });
    });

    await page.evaluateOnNewDocument(() => {
      // Overwrite the `languages` property to use a custom getter
      Object.defineProperty(navigator, 'languages', {
        get: () => ['en-US', 'en'],
      });
    });

    await page.goto(url, { waitUntil: 'networkidle2' });

    // Check if we are blocked
    const blocked = await page.evaluate(() => {
      return document.title.includes('Attention Required') || document.title.includes('Sorry, you have been blocked');
    });

    if (blocked) {
      console.log('Blocked by Cloudflare. Manual intervention required.');
      return;
    }

    const data = await page.evaluate(() => {
      // Find card names and IDs in the 'h1' element with class 'name'
      const card_id_elements = document.querySelectorAll('h1.name');
      const card_ids = Array.from(card_id_elements).map(elem => {
        const match = elem.textContent.match(/\(([^)]+)\)/);
        return match ? match[1] : null;
      });

      const card_names = Array.from(card_id_elements).map(elem => elem.textContent.split('(')[0].trim());

      // Find card prices in the 'td' element with class 'price'
      const price_elements = document.querySelectorAll('td.price');
      const card_prices = Array.from(price_elements).map(elem => parseInt(elem.textContent.replace(' 円', '').replace(',', '').trim()));

      // Combine card IDs, names, and prices into a list of dictionaries
      const results = [];
      for (let i = 0; i < card_ids.length; i++) {
        if (card_ids[i] && card_names[i] && card_prices[i]) {
          results.push({
            'cardid': card_ids[i],
            'cardname': card_names[i],
            'price': card_prices[i]
          });
        }
      }

      return results;
    });

    console.log('Scraped data:', data);
    return data;
  } catch (error) {
    console.error('Error during scraping:', error);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

module.exports = scrapeData;
