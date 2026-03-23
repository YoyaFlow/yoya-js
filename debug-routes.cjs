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
  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.log('[CONSOLE ERROR]', msg.text());
      errors.push(msg.text());
    }
  });

  console.log('正在测试 routes.js...');

  const result = await page.evaluate(async () => {
    const results = [];

    // 测试导入 routes.js
    try {
      const routesModule = await import('http://localhost:3002/v2/examples/config/routes.js');
      results.push({ step: 'import routes.js', success: true });

      // 测试 preloadAllPages
      try {
        const preloadResult = await routesModule.preloadAllPages();
        results.push({ step: 'preloadAllPages', success: true, count: preloadResult.length });
      } catch (e) {
        results.push({ step: 'preloadAllPages', success: false, error: e.message });
      }
    } catch (e) {
      results.push({ step: 'import routes.js', success: false, error: e.message });
    }

    return results;
  });

  console.log('结果:', JSON.stringify(result, null, 2));
  console.log('错误数:', errors.length);

  await browser.close();
  console.log('=== 测试完成 ===');
})();
