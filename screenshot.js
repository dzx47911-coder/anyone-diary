const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  await page.goto('http://localhost:5173', { waitUntil: 'networkidle0' });

  const height = await page.evaluate(() => document.documentElement.scrollHeight);

  await page.setViewport({
    width: 1200,
    height: height,
    deviceScaleFactor: 2
  });

  await page.screenshot({
    path: '/Users/apple/xiaodong-diary/screenshot-full.png',
    fullPage: true
  });

  await browser.close();
  console.log('Screenshot saved!');
})();