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
      errors.push({
        type: 'console',
        text: msg.text(),
        location: msg.location()
      });
      console.log(`[CONSOLE ERROR] ${msg.text()}`);
      if (msg.location().url) {
        console.log(`  at ${msg.location().url}:${msg.location().lineNumber}`);
      }
    } else {
      console.log(`[CONSOLE:${msg.type()}] ${msg.text()}`);
    }
  });

  page.on('pageerror', err => {
    errors.push({
      type: 'page',
      message: err.message,
      stack: err.stack
    });
    console.log(`[PAGE ERROR] ${err.message}`);
    console.log(`  ${err.stack}`);
  });

  // 先加载 index.html 获取上下文
  await page.goto('http://localhost:3001/v2/examples/index.html', {
    waitUntil: 'networkidle'
  });

  // 测试 routes.js
  const result = await page.evaluate(async () => {
    const results = [];

    try {
      // 1. 测试导入 routes.js
      const routes = await import('http://localhost:3001/v2/examples/config/routes.js');
      results.push({
        step: 'import routes.js',
        success: true,
        hasPreload: typeof routes.preloadAllPages === 'function'
      });

      // 2. 测试 preloadAllPages
      const preloadResult = await routes.preloadAllPages();
      results.push({
        step: 'preloadAllPages',
        success: true,
        count: preloadResult.length,
        fulfilled: preloadResult.filter(r => r.status === 'fulfilled').length,
        rejected: preloadResult.filter(r => r.status === 'rejected').length
      });

      // 3. 测试 getPageComponent
      const pageLoader = await routes.getPageComponent('interaction.html');
      results.push({
        step: 'getPageComponent',
        success: true,
        loader: typeof pageLoader === 'function'
      });

      // 4. 测试加载 Interaction 页面
      const createPage = await pageLoader();
      results.push({
        step: 'load Interaction',
        success: true,
        hasCreateFn: typeof createPage.createInteractionPage === 'function'
      });

    } catch (e) {
      results.push({
        step: 'error',
        success: false,
        error: e.message,
        stack: e.stack
      });
    }

    return results;
  });

  console.log('\\n=== 测试结果 ===');
  console.log(JSON.stringify(result, null, 2));
  console.log('\\n=== 错误总数 ===', errors.length);

  await browser.close();
  console.log('=== 测试完成 ===');
})();
