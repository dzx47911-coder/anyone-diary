const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  const routes = ['/', '/calendar', '/generate', '/summary'];

  for (const route of routes) {
    await page.goto(`http://localhost:5173${route}`, { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 500));

    const height = await page.evaluate(() => document.documentElement.scrollHeight);

    await page.setViewport({
      width: 1200,
      height: height,
      deviceScaleFactor: 2
    });

    const filename = route === '/' ? 'home' : route.slice(1);
    await page.screenshot({
      path: `/Users/apple/xiaodong-diary/screenshot-${filename}.png`,
      fullPage: true
    });
    console.log(`Saved: screenshot-${filename}.png (${height}px)`);
  }

  await browser.close();
  console.log('All screenshots saved!');
})();