const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({
    executablePath: '/usr/bin/chromium',
    headless: false
  });
  const page = await browser.newPage();

  console.log('=== 调试 Input _rendered 状态 ===\n');

  await page.goto('http://localhost:3001/v2/examples/interaction.html', {
    waitUntil: 'networkidle',
    timeout: 60000
  });

  await new Promise(r => setTimeout(r, 2000));

  // 注入调试代码
  const result = await page.evaluate(() => {
    const logs = [];

    // 获取所有 checkbox
    const checkboxes = document.querySelectorAll('.yoya-tree input[type="checkbox"]');
    logs.push(`Found ${checkboxes.length} checkboxes`);

    // 尝试找到 Yoya 实例
    // 由于 Yoya 在创建时立即创建 DOM 元素，我们可以尝试追踪
    // 但问题是 DOM 元素没有直接引用回 Yoya 实例

    // 让我们检查 window 对象上的日志
    const renderDomCalls = window._renderDomCalls || [];
    const applyEventsCalls = window._applyEventsCalls || [];

    // 查找 input 相关的调用
    const inputRenderDom = renderDomCalls.filter(c => c.tag === 'input');
    const inputApplyEvents = applyEventsCalls.filter(c => c.tag === 'input');

    logs.push(`Input renderDom calls: ${inputRenderDom.length}`);
    logs.push(`Input _applyEventsToEl calls: ${inputApplyEvents.length}`);

    // 检查所有标签类型的分布
    const tagCounts = {};
    renderDomCalls.forEach(c => {
      tagCounts[c.tag] = (tagCounts[c.tag] || 0) + 1;
    });

    logs.push(`Tag distribution: ${JSON.stringify(tagCounts)}`);

    return { logs };
  });

  console.log('结果:', JSON.stringify(result, null, 2));

  console.log('\n=== 测试完成 ===');
  await browser.close();
})();
