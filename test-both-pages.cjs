const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({
    executablePath: '/usr/bin/chromium',
    headless: true
  });
  const page = await browser.newPage();
  const errors = [];

  page.on('console', msg => {
    if (msg.type() === 'error') {
      errors.push({ type: 'console', text: msg.text() });
    }
  });

  page.on('pageerror', err => {
    console.log(`[PAGE ERROR] ${err.message}`);
    errors.push({ type: 'page', message: err.message });
  });

  // 测试 interaction.html
  console.log('=== 测试 interaction.html ===');
  await page.goto('http://localhost:3001/v2/examples/interaction.html', {
    waitUntil: 'networkidle',
    timeout: 30000
  });
  await new Promise(r => setTimeout(r, 3000));

  const interactionContent = await page.$eval('#app', el => el.innerHTML).catch(() => '(无法获取)');
  const interactionChildren = await page.$eval('#app', el => el.children.length).catch(() => -1);

  console.log('interaction.html - 子元素数量:', interactionChildren);
  console.log('interaction.html - 错误数:', errors.length);

  // 测试 statistic.html
  console.log('\n=== 测试 statistic.html ===');
  errors.length = 0;
  await page.goto('http://localhost:3001/v2/examples/statistic.html', {
    waitUntil: 'networkidle',
    timeout: 30000
  });
  await new Promise(r => setTimeout(r, 3000));

  const statisticContent = await page.$eval('#app', el => el.innerHTML).catch(() => '(无法获取)');
  const statisticChildren = await page.$eval('#app', el => el.children.length).catch(() => -1);

  console.log('statistic.html - 子元素数量:', statisticChildren);
  console.log('statistic.html - 错误数:', errors.length);

  await browser.close();
  console.log('\n=== 测试完成 ===');
})();

