const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({
    executablePath: '/usr/bin/chromium',
    headless: true
  });
  const page = await browser.newPage();

  const errors = [];

  // 捕获所有错误
  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.log('[ERROR]', msg.text());
      errors.push(msg.text());
    }
  });

  page.on('pageerror', err => {
    console.log('[PAGE ERROR]', err.message);
    errors.push(err.message);
  });

  console.log('正在加载页面...');
  await page.goto('http://localhost:3002/v2/examples/interaction.html', {
    waitUntil: 'networkidle',
    timeout: 30000
  });

  await new Promise(r => setTimeout(r, 2000));

  // 获取详细的错误堆栈
  const detailedErrors = await page.evaluate(() => {
    return window.__errors || [];
  });

  console.log('\n=== 错误详情 ===');
  console.log('总错误数:', errors.length);
  errors.forEach((e, i) => console.log(`${i + 1}. ${e}`));

  // 检查 routes.js 加载情况
  const routesCheck = await page.evaluate(async () => {
    try {
      const { preloadAllPages } = await import('http://localhost:3002/v2/examples/config/routes.js');
      const result = await preloadAllPages();
      return { success: true, result: result.map(r => ({ status: r.status })) };
    } catch (e) {
      return { success: false, error: e.message };
    }
  });
  console.log('\nroutes.js 检查:', JSON.stringify(routesCheck, null, 2));

  await browser.close();
  console.log('\n=== 测试完成 ===');
})();
