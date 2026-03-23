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

  // 在浏览器中测试事件
  const result = await page.evaluate(() => {
    const logs = [];

    const checkbox = document.querySelectorAll('.yoya-tree input[type="checkbox"]')[1];
    if (!checkbox) {
      return { logs: ['Checkbox not found'] };
    }

    logs.push(`Initial checked: ${checkbox.checked}`);

    // 添加 click 事件监听器
    checkbox.addEventListener('click', (e) => {
      logs.push(`[click] checked: ${e.target.checked}`);
    }, true);

    // 添加 change 事件监听器（捕获阶段）
    checkbox.addEventListener('change', (e) => {
      logs.push(`[change capture] checked: ${e.target.checked}`);
    }, true);

    // 添加 change 事件监听器（冒泡阶段）
    checkbox.addEventListener('change', (e) => {
      logs.push(`[change bubble] checked: ${e.target.checked}`);
    }, false);

    // 触发 click
    checkbox.click();
    logs.push(`After click() checked: ${checkbox.checked}`);

    // 手动 dispatch change 事件
    checkbox.dispatchEvent(new Event('change', { bubbles: true }));
    logs.push(`After dispatch change checked: ${checkbox.checked}`);

    return { logs };
  });

  console.log('结果:', JSON.stringify(result, null, 2));

  await browser.close();
})();
