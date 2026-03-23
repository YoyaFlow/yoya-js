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
      console.log('[CONSOLE ERROR]', msg.text());
      errors.push({ type: 'console', text: msg.text() });
    } else {
      console.log(`[CONSOLE:${msg.type()}]`, msg.text());
    }
  });

  page.on('pageerror', err => {
    console.log('[PAGE ERROR]', err.message);
    console.log('[STACK]', err.stack);
    errors.push({ type: 'page', message: err.message, stack: err.stack });
  });

  console.log('=== 测试导入 yoya/index.js ===');

  const result = await page.evaluate(async () => {
    const results = [];

    // 测试导入 components/index.js
    try {
      const componentsIndex = await import('http://localhost:3002/yoya/components/index.js');
      results.push({ step: 'components/index.js', success: true, exports: Object.keys(componentsIndex).length });
    } catch (e) {
      results.push({ step: 'components/index.js', success: false, error: e.message, stack: e.stack });
    }

    // 测试导入 interaction.js
    try {
      const interaction = await import('http://localhost:3002/yoya/components/interaction.js');
      results.push({ step: 'interaction.js', success: true, exports: Object.keys(interaction).length });
    } catch (e) {
      results.push({ step: 'interaction.js', success: false, error: e.message, stack: e.stack });
    }

    // 测试导入 yoya/index.js
    try {
      const yoyaIndex = await import('http://localhost:3002/yoya/index.js');
      results.push({ step: 'yoya/index.js', success: true, exports: Object.keys(yoyaIndex).length });
    } catch (e) {
      results.push({ step: 'yoya/index.js', success: false, error: e.message, stack: e.stack });
    }

    return results;
  });

  console.log('\\n=== 结果 ===');
  console.log(JSON.stringify(result, null, 2));
  console.log('\\n=== 错误总数 ===', errors.length);

  await browser.close();
  console.log('=== 测试完成 ===');
})();
