const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({
    executablePath: '/usr/bin/chromium',
    headless: false
  });
  const page = await browser.newPage();

  console.log('=== 检查事件监听器是否真的绑定 ===\n');

  // 拦截 addEventListener 并记录
  await page.addInitScript(() => {
    window.boundListeners = [];
    const originalAddEventListener = EventTarget.prototype.addEventListener;
    EventTarget.prototype.addEventListener = function(event, handler, options) {
      if (this.tagName === 'INPUT' && this.type === 'checkbox') {
        window.boundListeners.push({
          event,
          target: this,
          handler: handler,
          capture: options?.capture || false,
        });
      }
      return originalAddEventListener.call(this, event, handler, options);
    };
  });

  await page.goto('http://localhost:3001/v2/examples/interaction.html', {
    waitUntil: 'networkidle',
    timeout: 60000
  });

  await new Promise(r => setTimeout(r, 2000));

  // 检查绑定的监听器
  const result = await page.evaluate(() => {
    const checkbox = document.querySelectorAll('.yoya-tree input[type="checkbox"]')[1];
    if (!checkbox) return { error: 'Checkbox not found' };

    // 检查 boundListeners 中是否有这个 checkbox 的监听器
    const checkboxListeners = window.boundListeners.filter(l => l.target === checkbox);

    return {
      totalListeners: window.boundListeners.length,
      checkboxListeners: checkboxListeners.length,
      listenerEvents: checkboxListeners.map(l => l.event),
    };
  });

  console.log('结果:', JSON.stringify(result, null, 2));

  console.log('\n=== 测试完成 ===');
  await browser.close();
})();
