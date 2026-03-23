const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({
    executablePath: '/usr/bin/chromium',
    headless: false
  });
  const page = await browser.newPage();

  console.log('=== 调试事件绑定详情 ===\n');

  // 拦截 addEventListener
  await page.addInitScript(() => {
    window.addEventListenerDetails = [];
    const originalAddEventListener = EventTarget.prototype.addEventListener;
    EventTarget.prototype.addEventListener = function(event, handler, options) {
      if (this.tagName === 'INPUT' && this.type === 'checkbox') {
        // 检查调用堆栈
        const stack = new Error().stack;
        window.addEventListenerDetails.push({
          event,
          tagName: this.tagName,
          type: this.type,
          stack: stack.split('\n').slice(1, 8).join('\n'),
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
      total: window.addEventListenerDetails?.length || 0,
      details: window.addEventListenerDetails?.map(d => ({
        event: d.event,
        stack: d.stack.substring(0, 500)
      })) || []
    };
  });

  console.log('总调用次数:', result.total);
  console.log('\n调用详情:');
  result.details.forEach((d, i) => {
    console.log(`\n${i + 1}. Event: ${d.event}`);
    console.log(`   Stack: ${d.stack}`);
  });

  console.log('\n=== 测试完成 ===');
  await browser.close();
})();
