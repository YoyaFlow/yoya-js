const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({
    executablePath: '/usr/bin/chromium',
    headless: true
  });

  // 创建一个测试页面
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
    console.log(`  ${err.stack}`);
  });

  // 加载一个测试页面，直接导入 interaction.js
  await page.goto('http://localhost:3001/v2/examples/index.html', {
    waitUntil: 'networkidle'
  });

  // 在页面上下文中测试导入 interaction.js
  const result = await page.evaluate(async () => {
    try {
      // 测试导入 interaction.js
      const interaction = await import('http://localhost:3001/yoya/components/interaction.js');
      return {
        success: true,
        exports: Object.keys(interaction)
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
