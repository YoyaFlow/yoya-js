const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({
    executablePath: '/usr/bin/chromium',
    headless: false
  });
  const page = await browser.newPage();

  console.log('=== 测试 Yoya 事件绑定 - 使用 Promise ===\n');

  await page.goto('http://localhost:3001/v2/examples/interaction.html', {
    waitUntil: 'networkidle',
    timeout: 60000
  });

  await new Promise(r => setTimeout(r, 2000));

  // 测试事件绑定
  const result = await page.evaluate(() => {
    return new Promise((resolve) => {
      const logs = [];

      // 获取 checkbox（节点 1-1）
      const checkbox = document.querySelectorAll('.yoya-tree input[type="checkbox"]')[1];
      if (!checkbox) {
        resolve({ logs: ['Checkbox not found'], error: true });
        return;
      }

      logs.push(`Initial checked: ${checkbox.checked}`);

      // 跟踪 Yoya 绑定的事件是否被调用
      let yoyaHandlerCalled = false;
      let yoyaHandlerValue = null;

      // 添加一个监听器，在 Yoya 之前触发（捕获阶段）
      checkbox.addEventListener('change', (e) => {
        yoyaHandlerCalled = true;
        yoyaHandlerValue = e.target.checked;
        logs.push(`[Capture] Yoya handler called: ${e.target.checked}`);
      }, true);

      // 添加一个监听器，在 Yoya 之后触发（冒泡阶段）
      checkbox.addEventListener('change', (e) => {
        logs.push(`[Bubble] change: ${e.target.checked}`);
      }, false);

      // 点击
      checkbox.click();

      // 等待事件循环完成
      setTimeout(() => {
        logs.push(`After click: checked=${checkbox.checked}`);
        logs.push(`Yoya handler called: ${yoyaHandlerCalled}, value: ${yoyaHandlerValue}`);
        resolve({ logs });
      }, 100);
    });
  });

  console.log('结果:', JSON.stringify(result, null, 2));

  console.log('\n=== 测试完成 ===');
  await browser.close();
})();
