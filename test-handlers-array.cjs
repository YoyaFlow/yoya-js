const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({
    executablePath: '/usr/bin/chromium',
    headless: false
  });
  const page = await browser.newPage();

  console.log('=== 测试内部 handlers 数组 ===\n');

  // 拦截 _applyEventsToEl
  await page.addInitScript(() => {
    window.handlersInfo = [];
  });

  await page.goto('http://localhost:3001/v2/examples/interaction.html', {
    waitUntil: 'networkidle',
    timeout: 60000
  });

  await new Promise(r => setTimeout(r, 2000));

  // 检查 handlers 数组
  const result = await page.evaluate(() => {
    const logs = [];

    // 获取 VTree 组件
    const vTreeComponents = document.querySelectorAll('.yoya-tree');
    logs.push(`Found ${vTreeComponents.length} VTree components`);

    // 获取 checkbox
    const checkboxes = document.querySelectorAll('.yoya-tree input[type="checkbox"]');
    logs.push(`Found ${checkboxes.length} checkboxes`);

    // 尝试找到 Yoya 虚拟元素
    // 由于 Yoya 没有暴露引用，我们通过 window._applyEventsCalls 来检查
    const applyEventsCalls = window._applyEventsCalls || [];
    const inputCalls = applyEventsCalls.filter(c => c.tag === 'input');

    logs.push(`Input _applyEventsToEl calls: ${inputCalls.length}`);
    logs.push(`Input events: ${JSON.stringify(inputCalls.map(c => c.events))}`);

    return { logs };
  });

  console.log('结果:', JSON.stringify(result, null, 2));

  console.log('\n=== 测试完成 ===');
  await browser.close();
})();
