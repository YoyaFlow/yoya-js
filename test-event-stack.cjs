const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({
    executablePath: '/usr/bin/chromium',
    headless: false
  });
  const page = await browser.newPage();

  console.log('=== 测试事件监听器绑定顺序 ===\n');

  // 拦截 addEventListener
  await page.addInitScript(() => {
    window.addEventListenerCalls = [];
    const originalAddEventListener = EventTarget.prototype.addEventListener;
    EventTarget.prototype.addEventListener = function(event, handler, options) {
      if (event === 'change' && this.tagName === 'INPUT' && this.type === 'checkbox') {
        window.addEventListenerCalls.push({
          event,
          tagName: this.tagName,
          type: this.type,
          hasHandler: typeof handler === 'function',
          stack: new Error().stack?.split('\n').slice(1, 6).join('\n'),
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
      totalCalls: window.addEventListenerCalls?.length || 0,
      calls: window.addEventListenerCalls?.map((c, i) => ({ index: i, stack: c.stack?.substring(0, 200) })) || [],
    };
  });

  console.log('总调用次数:', result.totalCalls);
  console.log('\n调用堆栈:');
  result.calls.slice(0, 5).forEach(c => {
    console.log(`\n调用 ${c.index}:`);
    console.log(c.stack);
  });

  console.log('\n=== 测试完成 ===');
  await browser.close();
})();
