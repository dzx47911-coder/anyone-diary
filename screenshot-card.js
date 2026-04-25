const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  await page.goto('http://localhost:5173/calendar', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 500));

  // Add test diary to localStorage
  await page.evaluate(() => {
    const today = new Date().toISOString().split('T')[0];
    const testDiary = {
      id: 'test-' + Date.now(),
      date: today,
      content: '这是一篇测试日记，用来展示卡片弹窗效果。今天天气很好，心情也很不错！',
      moodLabels: ['开心', '期待'],
      weather: 'sunny',
      createdAt: new Date().toISOString()
    };
    localStorage.setItem('xiaodong-diaries', JSON.stringify([testDiary]));
  });

  // Reload to load the diary
  await page.reload({ waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 500));

  // Click on a date that has a diary
  const hasDiary = await page.$('.calendar-day.has-diary');
  if (hasDiary) {
    await hasDiary.click();
    await new Promise(r => setTimeout(r, 800));

    await page.screenshot({
      path: '/Users/apple/xiaodong-diary/screenshot-card-modal.png',
      fullPage: false
    });
    console.log('Card modal screenshot saved!');
  } else {
    console.log('No diary found');
  }

  await browser.close();
})();