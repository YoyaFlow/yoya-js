const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({
    executablePath: '/usr/bin/chromium',
    headless: false
  });
  const page = await browser.newPage();

  console.log('=== 测试事件处理器捕获 ===\n');

  // 拦截 addEventListener 并检查 handler
  await page.addInitScript(() => {
    window.eventHandlers = [];
    const originalAddEventListener = EventTarget.prototype.addEventListener;
    EventTarget.prototype.addEventListener = function(event, handler, options) {
      if (this.tagName === 'INPUT' && this.type === 'checkbox' && event === 'change') {
        // 检查 handler 是否是函数
        window.eventHandlers.push({
          event,
          isFunction: typeof handler === 'function',
          handlerStr: handler.toString?.().substring(0, 100) || 'unknown',
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

  const result = await page.evaluate(() => {
    return {
      total: window.eventHandlers?.length || 0,
      handlers: window.eventHandlers || []
    };
  });

  console.log('总事件处理器:', result.total);
  console.log('\n处理器详情:');
  result.handlers.forEach((h, i) => {
    console.log(`${i + 1}. isFunction: ${h.isFunction}, handler: ${h.handlerStr}`);
  });

  console.log('\n=== 测试完成 ===');
  await browser.close();
})();
