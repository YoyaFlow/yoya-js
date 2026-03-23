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

  // 在浏览器中直接添加事件监听器并测试
  const result = await page.evaluate(() => {
    const logs = [];

    // 添加事件监听器
    document.querySelectorAll('.yoya-tree input[type="checkbox"]').forEach((cb, i) => {
      cb.addEventListener('change', (e) => {
        logs.push(`[change] index: ${i}, checked: ${e.target.checked}, nodeKey: ${e.target.getAttribute('data-node-key')}`);
      });

      cb.addEventListener('click', (e) => {
        logs.push(`[click] index: ${i}, checked: ${e.target.checked}`);
      });
    });

    // 获取第一个复选框（索引 1，节点 1-1）
    const checkbox = document.querySelectorAll('.yoya-tree input[type="checkbox"]')[1];
    if (!checkbox) {
      return { logs: ['Checkbox not found'], error: true };
    }

    logs.push(`Initial checked: ${checkbox.checked}`);

    // 手动触发 click 事件
    checkbox.click();
    logs.push(`After click checked: ${checkbox.checked}`);

    // 手动 dispatch change 事件
    const changeEvent = new Event('change', { bubbles: true, cancelable: true });
    checkbox.dispatchEvent(changeEvent);
    logs.push(`After dispatch change checked: ${checkbox.checked}`);

    return { logs, error: false };
  });

  console.log('结果:', result);

  console.log('\n=== 测试完成 ===');
  await browser.close();
})();
