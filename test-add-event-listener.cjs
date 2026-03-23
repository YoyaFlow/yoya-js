const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({
    executablePath: '/usr/bin/chromium',
    headless: false
  });
  const page = await browser.newPage();

  console.log('=== 测试 addEventListener 是否被调用 ===\n');

  // 在页面初始化前拦截 addEventListener
  await page.addInitScript(() => {
    window.addEventListenerCalls = [];
    const originalAddEventListener = EventTarget.prototype.addEventListener;
    EventTarget.prototype.addEventListener = function(event, handler, options) {
      if (event === 'change' && this.tagName === 'INPUT' && this.type === 'checkbox') {
        window.addEventListenerCalls.push({
          event,
          tagName: this.tagName,
          type: this.type,
          className: this.className,
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
      addEventListenerCalls: window.addEventListenerCalls?.length || 0,
      calls: window.addEventListenerCalls?.slice(0, 10) || [],
    };
  });

  console.log('addEventListener 调用次数:', result.addEventListenerCalls);
  console.log('前 10 次调用:', JSON.stringify(result.calls, null, 2));

  // 测试点击 checkbox
  const clickResult = await page.evaluate(() => {
    const checkbox = document.querySelectorAll('.yoya-tree input[type="checkbox"]')[1];
    if (!checkbox) return { error: 'Checkbox not found' };

    const logs = [];
    logs.push(`Initial checked: ${checkbox.checked}`);

    // 添加一个一次性监听器
    let changeFired = false;
    checkbox.addEventListener('change', () => {
      changeFired = true;
      logs.push('[Test] change event fired!');
    }, { once: true });

    // 点击
    checkbox.click();
    logs.push(`After click: checked=${checkbox.checked}, changeFired=${changeFired}`);

    return { logs };
  });

  console.log('\n点击测试结果:', JSON.stringify(clickResult, null, 2));

  console.log('\n=== 测试完成 ===');
  await browser.close();
})();
