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

    // 在 document 层面监听所有 change 事件
    document.addEventListener('change', (e) => {
      logs.push(`[Document] change event, target: ${e.target.tagName}, type: ${e.target.type}, class: ${e.target.className}`);
    }, true);

    // 在 body 层面监听
    document.body.addEventListener('change', (e) => {
      logs.push(`[Body] change event, target: ${e.target.tagName}`);
    }, true);

    // 获取第一个复选框（索引 1，节点 1-1）
    const checkbox = document.querySelectorAll('.yoya-tree input[type="checkbox"]')[1];
    if (!checkbox) {
      return { logs: [...logs, 'Checkbox not found'], error: true };
    }

    logs.push(`Initial checked: ${checkbox.checked}`);

    // 手动触发 click 事件
    checkbox.click();
    logs.push(`After click checked: ${checkbox.checked}`);

    return { logs, error: false };
  });

  console.log('结果:', JSON.stringify(result, null, 2));

  console.log('\n=== 测试完成 ===');
  await browser.close();
})();
