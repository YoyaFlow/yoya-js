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
    }
  });

  page.on('pageerror', err => {
    errors.push({
      type: 'page',
      message: err.message,
      stack: err.stack
    });
    console.log(`[PAGE ERROR] ${err.message}`);
  });

  // 先加载 index.html 获取上下文
  await page.goto('http://localhost:3001/v2/examples/index.html', {
    waitUntil: 'networkidle'
  });

  // 测试导入 Interaction 页面组件
  const result = await page.evaluate(async () => {
    try {
      const interactionPage = await import('http://localhost:3001/v2/examples/pages/Interaction/index.js');
      return {
        success: true,
        exports: Object.keys(interactionPage),
        hasCreateFn: typeof interactionPage.createInteractionPage === 'function'
      };
    } catch (e) {
      return {
        success: false,
        error: e.message,
        stack: e.stack
      };
    }
  });

  console.log('\\n=== 导入结果 ===');
  console.log(JSON.stringify(result, null, 2));
  console.log('\\n=== 错误总数 ===', errors.length);

  await browser.close();
  console.log('=== 测试完成 ===');
})();
