const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({
    executablePath: '/usr/bin/chromium',
    headless: false,
    slowMo: 100
  });

  const page = await browser.newPage();
  const errors = [];

  page.on('console', msg => {
    console.log(`[CONSOLE:${msg.type()}]`, msg.text());
    if (msg.type() === 'error') {
      errors.push({
        type: 'console',
        text: msg.text(),
        location: msg.location()
      });
    }
  });

  page.on('pageerror', err => {
    console.log('[PAGE ERROR]', err.message);
    console.log('[STACK]', err.stack);
    errors.push({
      type: 'page',
      message: err.message,
      stack: err.stack
    });
  });

  console.log('正在加载 interaction.html...');

  await page.goto('http://localhost:3002/v2/examples/interaction.html', {
    waitUntil: 'load',
    timeout: 30000
  });

  await new Promise(r => setTimeout(r, 3000));

  // 获取 #app 内容
  const appContent = await page.$eval('#app', el => el.innerHTML).catch(() => '(无法获取)');
  console.log('\\n=== #app 内容长度 ===', appContent.length);

  // 获取页面控制台注入的错误
  const windowErrors = await page.evaluate(() => {
    return window.__errors || [];
  });
  console.log('Window errors:', windowErrors);

  console.log('\\n=== 错误总数 ===', errors.length);

  // 截图
  await page.screenshot({ path: 'interaction-debug.png' });
  console.log('截图已保存');

  await browser.close();
  console.log('=== 测试完成 ===');
})();
