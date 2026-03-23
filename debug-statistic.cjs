const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({
    executablePath: '/usr/bin/chromium',
    headless: true
  });
  const page = await browser.newPage();

  const errors = [];

  page.on('pageerror', err => {
    console.log('[PAGE ERROR]', err.message);
    errors.push(err.message);
  });

  console.log('正在加载 statistic.html...');
  await page.goto('http://localhost:3002/v2/examples/statistic.html', {
    waitUntil: 'networkidle',
    timeout: 30000
  });

  await new Promise(r => setTimeout(r, 2000));

  const appContent = await page.$eval('#app', el => el.innerHTML).catch(() => '(无法获取)');
  console.log('statistic.html #app 内容长度:', appContent.length);
  console.log('错误数:', errors.length);

  await browser.close();
  console.log('=== 测试完成 ===');
})();
