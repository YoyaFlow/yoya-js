const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({
    executablePath: '/usr/bin/chromium',
    headless: false
  });
  const page = await browser.newPage();

  console.log('=== 测试事件触发和 stopPropagation ===\n');

  await page.goto('http://localhost:3001/v2/examples/interaction.html', {
    waitUntil: 'networkidle',
    timeout: 60000
  });

  await new Promise(r => setTimeout(r, 2000));

  // 测试事件触发
  const result = await page.evaluate(() => {
    const logs = [];

    // 获取 checkbox（节点 1-1，初始为 checked）
    const checkbox = document.querySelectorAll('.yoya-tree input[type="checkbox"]')[1];
    if (!checkbox) {
      return { logs: ['Checkbox not found'], error: true };
    }

    logs.push(`Initial checked: ${checkbox.checked}`);

    // 在不同阶段监听事件
    // 捕获阶段
    checkbox.addEventListener('change', (e) => {
      logs.push(`[Capture] change event, checked: ${e.target.checked}`);
    }, true);

    // 冒泡阶段
    checkbox.addEventListener('change', (e) => {
      logs.push(`[Bubble] change event, checked: ${e.target.checked}`);
    }, false);

    // 在父元素上监听
    checkbox.parentElement.addEventListener('change', (e) => {
      logs.push(`[Parent] change event, target: ${e.target.tagName}`);
    });

    // 点击
    checkbox.click();
    logs.push(`After click: checked=${checkbox.checked}`);

    return { logs };
  });

  console.log('结果:', JSON.stringify(result, null, 2));

  console.log('\n=== 测试完成 ===');
  await browser.close();
})();
