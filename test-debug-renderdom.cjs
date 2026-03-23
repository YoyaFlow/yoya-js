const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({
    executablePath: '/usr/bin/chromium',
    headless: false
  });
  const page = await browser.newPage();

  console.log('=== 调试 Input renderDom 调用 ===\n');

  // 注入全局计数器
  await page.addInitScript(() => {
    window.renderDomCalls = [];
    window.applyEventsCalls = [];

    // 保存原始方法
    window._originalCreateElement = document.createElement.bind(document);
  });

  await page.goto('http://localhost:3001/v2/examples/interaction.html', {
    waitUntil: 'networkidle',
    timeout: 60000
  });

  await new Promise(r => setTimeout(r, 2000));

  // 检查全局计数器
  const counters = await page.evaluate(() => {
    return {
      renderDomCalls: window.renderDomCalls?.length || 0,
      applyEventsCalls: window.applyEventsCalls?.length || 0,
      hasYoya: typeof window.Yoya !== 'undefined',
    };
  });

  console.log('计数器:', JSON.stringify(counters, null, 2));

  // 获取 checkbox 并检查它的状态
  const checkboxState = await page.evaluate(() => {
    const checkbox = document.querySelectorAll('.yoya-tree input[type="checkbox"]')[1];
    if (!checkbox) return { error: 'Checkbox not found' };

    // 尝试找到 Yoya 实例（通过父元素）
    const parent = checkbox.parentElement;
    const yoyaInstance = parent?._yoyaInstance;  // 假设的引用

    return {
      checked: checkbox.checked,
      hasEventListeners: checkbox._yoyaEvents?.change?.length > 0 || false,
      parentClass: parent?.className,
    };
  });

  console.log('Checkbox 状态:', JSON.stringify(checkboxState, null, 2));

  console.log('\n=== 测试完成 ===');
  await browser.close();
})();
