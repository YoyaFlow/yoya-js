const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({
    executablePath: '/usr/bin/chromium',
    headless: false
  });
  const page = await browser.newPage();

  console.log('=== 测试 Yoya 事件绑定 ===\n');

  await page.goto('http://localhost:3001/v2/examples/interaction.html', {
    waitUntil: 'networkidle',
    timeout: 60000
  });

  await new Promise(r => setTimeout(r, 2000));

  // 检查事件监听器
  const result = await page.evaluate(() => {
    const logs = [];

    // 获取 checkbox
    const checkbox = document.querySelectorAll('.yoya-tree input[type="checkbox"]')[1];
    if (!checkbox) return { logs: ['Checkbox not found'], error: true };

    logs.push(`Checkbox found: ${checkbox.outerHTML}`);
    logs.push(`Initial checked: ${checkbox.checked}`);

    // 检查 getEventListeners（Chrome DevTools API，可能不可用）
    // 尝试使用其他方式检查

    // 添加一个监听器并立即触发
    let nativeListenerCalled = false;
    checkbox.addEventListener('change', function testListener(e) {
      nativeListenerCalled = true;
      logs.push(`[Native test] change: ${e.target.checked}`);
      // 移除自己
      checkbox.removeEventListener('change', testListener);
    });

    // 触发 click
    checkbox.click();
    logs.push(`After click: checked=${checkbox.checked}, nativeListenerCalled=${nativeListenerCalled}`);

    // 手动 dispatch change 事件
    let dispatchedListenerCalled = false;
    checkbox.addEventListener('change', function testDispatchedListener(e) {
      dispatchedListenerCalled = true;
      logs.push(`[Dispatched test] change: ${e.target.checked}`);
      checkbox.removeEventListener('change', testDispatchedListener);
    });

    checkbox.dispatchEvent(new Event('change', { bubbles: true }));
    logs.push(`After dispatch: dispatchedListenerCalled=${dispatchedListenerCalled}`);

    return { logs };
  });

  console.log('结果:', JSON.stringify(result, null, 2));

  console.log('\n=== 测试完成 ===');
  await browser.close();
})();
