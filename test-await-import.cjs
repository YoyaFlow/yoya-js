const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({
    executablePath: '/usr/bin/chromium',
    headless: true
  });
  const page = await browser.newPage();
  const errors = [];
  const logs = [];

  page.on('console', msg => {
    const text = msg.text();
    logs.push(`[CONSOLE:${msg.type()}] ${text}`);
    console.log(`[CONSOLE:${msg.type()}] ${text}`);
    if (msg.type() === 'error') {
      errors.push({ type: 'console', text });
    }
  });

  page.on('pageerror', err => {
    logs.push(`[PAGE ERROR] ${err.message}`);
    console.log(`[PAGE ERROR] ${err.message}`);
    console.log(`[STACK] ${err.stack}`);
    errors.push({ type: 'page', message: err.message, stack: err.stack });
  });

  console.log('正在加载 test-await-import.html...');
  await page.goto('http://localhost:3001/v2/examples/test-await-import.html', {
    waitUntil: 'load',
    timeout: 30000
  });

  await new Promise(r => setTimeout(r, 8000));

  const output = await page.$eval('#output', el => el.textContent).catch(() => '(无法获取)');
  console.log('\n=== 输出内容 ===');
  console.log(output);

  console.log('\n=== 错误总数 ===', errors.length);

  await browser.close();
  console.log('=== 测试完成 ===');
})();

