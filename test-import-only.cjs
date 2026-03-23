const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({
    executablePath: '/usr/bin/chromium',
    headless: true
  });
  const page = await browser.newPage();
  const errors = [];

  page.on('console', msg => {
    console.log(`[CONSOLE:${msg.type()}] ${msg.text()}`);
    if (msg.type() === 'error') {
      errors.push({ type: 'console', text: msg.text() });
    }
  });

  page.on('pageerror', err => {
    console.log(`[PAGE ERROR] ${err.message}`);
    errors.push({ type: 'page', message: err.message });
  });

  console.log('正在加载 test-import.html...');
  await page.goto('http://localhost:3001/v2/examples/test-import.html', {
    waitUntil: 'load',
    timeout: 30000
  });

  await new Promise(r => setTimeout(r, 2000));

  console.log('\\n=== 错误总数 ===', errors.length);

  await browser.close();
  console.log('=== 测试完成 ===');
})();
