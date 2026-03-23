const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({
    executablePath: '/usr/bin/chromium',
    headless: false
  });
  const page = await browser.newPage();

  console.log('=== 调试 Input _events 对象 ===\n');

  await page.goto('http://localhost:3001/v2/examples/interaction.html', {
    waitUntil: 'networkidle',
    timeout: 60000
  });

  await new Promise(r => setTimeout(r, 2000));

  // 测试 _events 对象
  const result = await page.evaluate(() => {
    const logs = [];

    // 拦截 input 函数的调用
    const originalInput = window.input;
    const inputCalls = [];

    // 获取所有 checkbox
    const checkboxes = document.querySelectorAll('.yoya-tree input[type="checkbox"]');
    logs.push(`Found ${checkboxes.length} checkboxes`);

    // 检查 window._applyEventsCalls 中 input 的事件
    const applyEventsCalls = window._applyEventsCalls || [];
    const inputEvents = applyEventsCalls.filter(c => c.tag === 'input');

    logs.push(`Input events calls: ${inputEvents.length}`);

    // 查看每个 input 事件的详情
    const changeEvents = inputEvents.filter(c => c.events.includes('change'));
    const inputOnlyEvents = inputEvents.filter(c => c.events.includes('input') && !c.events.includes('change'));

    logs.push(`Input with change event: ${changeEvents.length}`);
    logs.push(`Input with only input event: ${inputOnlyEvents.length}`);

    // 查看前 5 个 change 事件的详情
    logs.push('Change events sample:');
    changeEvents.slice(0, 5).forEach((c, i) => {
      logs.push(`  ${i}: ${JSON.stringify(c)}`);
    });

    return { logs };
  });

  console.log('结果:', JSON.stringify(result, null, 2));

  console.log('\n=== 测试完成 ===');
  await browser.close();
})();
