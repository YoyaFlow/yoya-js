const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({
    executablePath: '/usr/bin/chromium',
    headless: true
  });
  const page = await browser.newPage();

  console.log('=== 测试模块导入 ===');

  // 先加载一个空白页面
  await page.goto('about:blank');

  // 在页面上下文中测试导入
  const result = await page.evaluate(async () => {
    const results = [];

    try {
      // 测试导入 routes.js
      const routes = await import('http://localhost:3001/v2/examples/config/routes.js');
      results.push({ step: 'routes.js', success: true, hasPreload: typeof routes.preloadAllPages === 'function' });

      // 测试获取 Interaction 页面组件
      const pageLoader = await routes.getPageComponent('interaction.html');
      results.push({ step: 'getPageComponent', success: true, loader: typeof pageLoader === 'function' });

      // 测试加载 Interaction 页面模块
      const interactionModule = await pageLoader();
      results.push({ step: 'Interaction/index.js', success: true, createFn: typeof interactionModule.createInteractionPage === 'function' });

      // 测试创建页面
      const pageInstance = interactionModule.createInteractionPage();
      results.push({ step: 'createInteractionPage()', success: true, hasBindTo: typeof pageInstance.bindTo === 'function' });

    } catch (e) {
      results.push({ step: 'error', success: false, error: e.message, stack: e.stack });
    }

    return results;
  });

  console.log(JSON.stringify(result, null, 2));

  await browser.close();
  console.log('=== 测试完成 ===');
})();
