const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({
    executablePath: '/usr/bin/chromium',
    headless: false
  });
  const page = await browser.newPage();

  console.log('正在访问 interaction.html...');
  await page.goto('http://localhost:3001/v2/examples/interaction.html', {
    waitUntil: 'networkidle',
    timeout: 60000
  });

  await new Promise(r => setTimeout(r, 3000));

  // 在浏览器中测试事件冒泡
  const result = await page.evaluate(() => {
    const logs = [];

    // 获取第一个复选框（索引 1，节点 1-1）
    const checkbox = document.querySelectorAll('.yoya-tree input[type="checkbox"]')[1];
    if (!checkbox) {
      return { logs: ['Checkbox not found'], error: true };
    }

    logs.push(`Initial checked: ${checkbox.checked}`);

    // 直接在 checkbox 上监听 change 事件
    checkbox.addEventListener('change', (e) => {
      logs.push(`[Checkbox] change event, checked: ${e.target.checked}, bubbles: ${e.bubbles}`);
    });

    checkbox.addEventListener('click', (e) => {
      logs.push(`[Checkbox] click event, checked: ${e.target.checked}`);
    });

    // 手动触发 click 事件
    checkbox.click();
    logs.push(`After click() checked: ${checkbox.checked}`);

    // 手动 dispatch change 事件
    const changeEvent = new Event('change', { bubbles: true, cancelable: false });
    checkbox.dispatchEvent(changeEvent);
    logs.push(`After dispatchEvent(change) checked: ${checkbox.checked}`);

    return { logs, error: false };
  });

  console.log('结果:', JSON.stringify(result, null, 2));

  console.log('\n=== 测试完成 ===');
  await browser.close();
})();
