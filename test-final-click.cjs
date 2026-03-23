const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({
    executablePath: '/usr/bin/chromium',
    headless: false
  });
  const page = await browser.newPage();

  console.log('=== 最终测试：直接点击并监听事件 ===\n');

  await page.goto('http://localhost:3001/v2/examples/interaction.html', {
    waitUntil: 'networkidle',
    timeout: 60000
  });

  await new Promise(r => setTimeout(r, 2000));

  // 测试点击和事件
  const result = await page.evaluate(() => {
    const result = {
      logs: [],
      nativeListenerCalled: false,
      yoyaListenerCalled: false,
    };

    // 获取 checkbox（节点 1-1，初始 checked）
    const checkbox = document.querySelectorAll('.yoya-tree input[type="checkbox"]')[1];
    if (!checkbox) {
      result.logs.push('Checkbox not found');
      return result;
    }

    result.logs.push(`Initial checked: ${checkbox.checked}`);

    // 添加一个捕获阶段的监听器（最先执行）
    checkbox.addEventListener('change', (e) => {
      result.nativeListenerCalled = true;
      result.logs.push(`[Native capture] change: ${e.target.checked}`);
    }, true);

    // 添加一个冒泡阶段的监听器
    checkbox.addEventListener('change', (e) => {
      result.logs.push(`[Native bubble] change: ${e.target.checked}`);
    }, false);

    // 使用原生 click() 方法
    result.logs.push('Calling checkbox.click()...');
    checkbox.click();
    result.logs.push(`After click: checked=${checkbox.checked}`);

    // 手动 dispatch change 事件
    result.logs.push('Dispatching change event...');
    const changeEvent = new Event('change', { bubbles: true, cancelable: false });
    checkbox.dispatchEvent(changeEvent);
    result.logs.push(`After dispatch: checked=${checkbox.checked}`);

    return result;
  });

  console.log('结果:', JSON.stringify(result, null, 2));

  console.log('\n=== 测试完成 ===');
  await browser.close();
})();
