const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({
    executablePath: '/usr/bin/chromium',
    headless: false
  });
  const page = await browser.newPage();

  console.log('=== 直接测试 Yoya input 事件绑定 ===\n');

  await page.goto('http://localhost:3001/v2/examples/interaction.html', {
    waitUntil: 'networkidle',
    timeout: 60000
  });

  await new Promise(r => setTimeout(r, 2000));

  // 在页面中直接创建 Yoya input 元素
  const result = await page.evaluate(() => {
    const logs = [];

    // 使用现有的 Yoya 库创建 input
    const { input } = window.Yoya || {};

    if (!input) {
      // 尝试从全局作用域获取
      logs.push('Yoya not found, trying direct import...');
      return { logs: ['Could not access Yoya'], error: true };
    }

    const testInput = input(cb => {
      cb.type('checkbox');
      cb.prop('checked', true);
      cb.onChange((e) => {
        console.log('[Yoya onChange] checked:', e.target.checked);
        window.yoyaChangeHandlerCalled = true;
        window.yoyaChangeValue = e.target.checked;
      });
    });

    logs.push(`Input created: ${!!testInput}`);
    logs.push(`Has _events.change: ${!!testInput._events?.change?.length}`);
    logs.push(`Initial checked: ${testInput.prop('checked')}`);

    // 绑定到 DOM
    const app = document.getElementById('app') || document.body;
    testInput.bindTo(app);

    const checkbox = document.querySelector('input[type="checkbox"]');
    logs.push(`Checkbox in DOM: ${!!checkbox}`);
    logs.push(`Checkbox checked: ${checkbox?.checked}`);

    // 点击
    window.yoyaChangeHandlerCalled = false;
    window.yoyaChangeValue = null;

    checkbox?.click();

    // 等待事件处理
    return new Promise(resolve => {
      setTimeout(() => {
        logs.push(`After click checked: ${checkbox?.checked}`);
        logs.push(`Yoya handler called: ${window.yoyaChangeHandlerCalled}`);
        logs.push(`Yoya handler value: ${window.yoyaChangeValue}`);
        resolve({ logs });
      }, 100);
    });
  });

  console.log('结果:', JSON.stringify(result, null, 2));

  console.log('\n=== 测试完成 ===');
  await browser.close();
})();
