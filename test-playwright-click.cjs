const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({
    executablePath: '/usr/bin/chromium',
    headless: false
  });
  const page = await browser.newPage();

  console.log('=== 测试 checkbox 事件 - 使用 page.click ===\n');

  await page.goto('http://localhost:3001/v2/examples/interaction.html', {
    waitUntil: 'networkidle',
    timeout: 60000
  });

  await new Promise(r => setTimeout(r, 2000));

  // 使用 Playwright 的 click 方法
  const result = await page.evaluate(() => {
    const logs = [];

    // 获取 checkbox
    const checkbox = document.querySelectorAll('.yoya-tree input[type="checkbox"]')[1];
    if (!checkbox) return { logs: ['Checkbox not found'], error: true };

    logs.push(`Initial checked: ${checkbox.checked}`);

    // 添加监听器
    let changeCount = 0;
    checkbox.addEventListener('change', (e) => {
      changeCount++;
      logs.push(`[Listener 1] change #${changeCount}, checked: ${e.target.checked}`);
    });

    checkbox.addEventListener('change', (e) => {
      logs.push(`[Listener 2] change, checked: ${e.target.checked}`);
    });

    // 在父元素上监听
    checkbox.parentElement.addEventListener('change', (e) => {
      logs.push(`[Parent] change, target: ${e.target.tagName}`);
    });

    logs.push('About to click...');

    return { logs, checkboxChecked: checkbox.checked };
  });

  console.log('Before click:', JSON.stringify(result, null, 2));

  // 使用 Playwright 点击
  await page.click('.yoya-tree input[type="checkbox"]:nth-of-type(2)');

  await new Promise(r => setTimeout(r, 500));

  // 检查结果
  const afterResult = await page.evaluate(() => {
    const checkbox = document.querySelectorAll('.yoya-tree input[type="checkbox"]')[1];
    return {
      checked: checkbox?.checked,
    };
  });

  console.log('After click:', JSON.stringify(afterResult, null, 2));

  console.log('\n=== 测试完成 ===');
  await browser.close();
})();
