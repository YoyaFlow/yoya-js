const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({
    executablePath: '/usr/bin/chromium',
    headless: true
  });
  const context = await browser.newContext();
  const page = await context.newPage();

  const errors = [];

  page.on('console', msg => {
    const logEntry = `[CONSOLE:${msg.type()}] ${msg.text()}`;
    console.log(logEntry);
    if (msg.type() === 'error') {
      errors.push({
        type: 'console',
        text: msg.text(),
        location: msg.location()
      });
    }
  });

  page.on('pageerror', err => {
    console.log(`[PAGE ERROR] ${err.message}`);
    console.log(`[STACK] ${err.stack}`);
    errors.push({
      type: 'page',
      message: err.message,
      stack: err.stack
    });
  });

  console.log('正在访问 interaction.html...');

  const response = await page.goto('http://localhost:3001/v2/examples/interaction.html', {
    waitUntil: 'load'
  });

  console.log('页面状态:', response.status());

  // 等待所有网络请求完成
  await page.waitForLoadState('networkidle');
  await new Promise(r => setTimeout(r, 2000));

  // 获取错误覆盖层信息
  const overlayMessage = await page.$eval('#vite-error-message', el => el?.textContent).catch(() => null);
  const overlayFile = await page.$eval('#vite-error-file', el => el?.textContent).catch(() => null);

  if (overlayMessage) {
    console.log('\\n=== 错误消息 ===');
    console.log(overlayMessage);
  }
  if (overlayFile) {
    console.log('\\n=== 错误文件 ===');
    console.log(overlayFile);
  }

  // 获取所有网络请求
  const requests = await page.evaluate(() => {
    if (window.performance && window.performance.getEntriesByType) {
      return window.performance.getEntriesByType('resource')
        .filter(r => r.name.includes('localhost:3001'))
        .map(r => ({
          name: r.name,
          status: 'loaded'
        }));
    }
    return [];
  });

  console.log('\\n=== 加载的资源 ===');
  console.log(requests.map(r => r.name.split('/').pop()));

  console.log('\\n=== 错误总数 ===', errors.length);

  // 截图
  await page.screenshot({ path: 'interaction-error.png' });
  console.log('截图已保存到 interaction-error.png');

  await browser.close();
  console.log('=== 测试完成 ===');
})();
