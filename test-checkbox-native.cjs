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

  // 在浏览器中测试事件绑定
  const result = await page.evaluate(() => {
    const logs = [];

    // 检查复选框的事件绑定
    const checkboxes = document.querySelectorAll('.yoya-tree input[type="checkbox"]');
    logs.push(`Found ${checkboxes.length} checkboxes`);

    // 手动添加事件监听器到第一个复选框
    const checkbox = checkboxes[1];
    if (checkbox) {
      logs.push(`Initial checked: ${checkbox.checked}, nodeKey: ${checkbox.getAttribute('data-node-key')}`);

      // 直接添加原生事件监听器
      checkbox.addEventListener('change', (e) => {
        logs.push(`[Native] change event, checked: ${e.target.checked}`);
      });

      // 触发 click
      checkbox.click();
      logs.push(`After click checked: ${checkbox.checked}`);
    }

    return { logs };
  });

  console.log('结果:', JSON.stringify(result, null, 2));

  console.log('\n=== 测试完成 ===');
  await browser.close();
})();
