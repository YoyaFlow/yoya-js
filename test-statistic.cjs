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
      console.log(`[CONSOLE ERROR] ${msg.text()}`);
    }
  });

  page.on('pageerror', err => {
    errors.push({ type: 'page', message: err.message });
    console.log(`[PAGE ERROR] ${err.message}`);
  });

  console.log('正在加载 statistic.html...');
  await page.goto('http://localhost:3001/v2/examples/statistic.html', {
    waitUntil: 'load',
    timeout: 30000
  });

  await new Promise(r => setTimeout(r, 2000));

  const appContent = await page.$eval('#app', el => el.innerHTML).catch(() => '(无法获取)');
  console.log('\\n=== #app 内容长度 ===', appContent.length);
  console.log('=== 错误总数 ===', errors.length);

  await browser.close();
  console.log('=== 测试完成 ===');
})();
