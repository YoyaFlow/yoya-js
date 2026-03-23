const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({
    executablePath: '/usr/bin/chromium',
    headless: false
  });
  const page = await browser.newPage();

  console.log('=== 测试 renderDom 和 _applyEventsToEl 调用 ===\n');

  await page.goto('http://localhost:3001/v2/examples/interaction.html', {
    waitUntil: 'networkidle',
    timeout: 60000
  });

  await new Promise(r => setTimeout(r, 3000));

  // 检查全局计数器
  const logs = await page.evaluate(() => {
    const result = {
      renderDomCalls: window._renderDomCalls?.slice(0, 50) || [],
      applyEventsCalls: window._applyEventsCalls?.slice(0, 50) || [],
      totalRenderDom: window._renderDomCalls?.length || 0,
      totalApplyEvents: window._applyEventsCalls?.length || 0,
    };

    // 查找 input 相关的调用
    result.inputRenderDom = result.renderDomCalls.filter(c => c.tag === 'input');
    result.inputApplyEvents = result.applyEventsCalls.filter(c => c.tag === 'input');

    return result;
  });

  console.log('总 renderDom 调用:', logs.totalRenderDom);
  console.log('总 _applyEventsToEl 调用:', logs.totalApplyEvents);
  console.log('\nInput renderDom 调用:', JSON.stringify(logs.inputRenderDom, null, 2));
  console.log('\nInput _applyEventsToEl 调用:', JSON.stringify(logs.inputApplyEvents, null, 2));

  // 检查 checkbox 状态
  const checkboxState = await page.evaluate(() => {
    const checkbox = document.querySelectorAll('.yoya-tree input[type="checkbox"]')[1];
    if (!checkbox) return { error: 'Checkbox not found' };

    return {
      checked: checkbox.checked,
      hasChangeListener: !!checkbox._yoyaEvents?.change,
    };
  });

  console.log('\nCheckbox 状态:', JSON.stringify(checkboxState, null, 2));

  console.log('\n=== 测试完成 ===');
  await browser.close();
})();
