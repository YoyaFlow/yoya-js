const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({
    executablePath: '/usr/bin/chromium',
    headless: false
  });
  const page = await browser.newPage();

  console.log('=== 调试 Input 事件绑定详情 ===\n');

  await page.goto('http://localhost:3001/v2/examples/interaction.html', {
    waitUntil: 'networkidle',
    timeout: 60000
  });

  await new Promise(r => setTimeout(r, 2000));

  // 检查事件绑定详情
  const result = await page.evaluate(() => {
    const logs = [];

    // 查看 _applyEventsToEl 的调用日志
    const applyEventsCalls = window._applyEventsCalls || [];
    const inputApplyEvents = applyEventsCalls.filter(c => c.tag === 'input');

    // 查看每个 input 的事件
    inputApplyEvents.forEach((call, i) => {
      if (i < 10) {  // 只看前 10 个
        logs.push(`Input ${i}: events=${JSON.stringify(call.events)}`);
      }
    });

    // 检查 checkbox
    const checkbox = document.querySelectorAll('.yoya-tree input[type="checkbox"]')[1];
    if (checkbox) {
      logs.push(`Checkbox checked: ${checkbox.checked}`);
      logs.push(`Checkbox outerHTML: ${checkbox.outerHTML}`);
    }

    return {
      logs,
      totalInputEvents: inputApplyEvents.length,
      inputEventsSample: inputApplyEvents.slice(0, 10)
    };
  });

  console.log('结果:', JSON.stringify(result, null, 2));

  console.log('\n=== 测试完成 ===');
  await browser.close();
})();
