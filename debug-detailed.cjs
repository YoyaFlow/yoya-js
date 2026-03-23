const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({
    executablePath: '/usr/bin/chromium',
    headless: true
  });
  const page = await browser.newPage();

  const errors = [];

  // 捕获所有控制台消息
  page.on('console', msg => {
    console.log(`[CONSOLE:${msg.type()}]`, msg.text());
    if (msg.type() === 'error') {
      errors.push({
        type: 'console',
        text: msg.text(),
        location: msg.location()
      });
    }
  });

  // 捕获页面错误
  page.on('pageerror', err => {
    console.log('[PAGE ERROR]', err.message);
    console.log('[STACK]', err.stack);
    errors.push({
      type: 'page',
      message: err.message,
      stack: err.stack
    });
  });

  // 捕获请求失败
  page.on('requestfailed', request => {
    console.log('[REQUEST FAILED]', request.url(), request.failure()?.errorText);
    errors.push({
      type: 'request',
      url: request.url(),
      error: request.failure()?.errorText
    });
  });

  console.log('正在加载 interaction.html...');

  try {
    const response = await page.goto('http://localhost:3002/v2/examples/interaction.html', {
      waitUntil: 'load',
      timeout: 30000
    });
    console.log('页面加载完成，状态:', response.status());
  } catch (e) {
    console.log('页面加载失败:', e.message);
  }

  // 等待 3 秒让 JS 执行
  await new Promise(r => setTimeout(r, 3000));

  // 获取 Vite 错误覆盖层
  const errorOverlay = await page.$('#vite-error-overlay').catch(() => null);
  if (errorOverlay) {
    const messageEl = await page.$('#vite-error-message').catch(() => null);
    const fileEl = await page.$('#vite-error-file').catch(() => null);

    if (messageEl) {
      const message = await messageEl.textContent();
      console.log('\\n=== 错误消息 ===');
      console.log(message);
    }

    if (fileEl) {
      const file = await fileEl.textContent();
      console.log('\\n=== 错误位置 ===');
      console.log(file);
    }
  }

  // 获取 #app 内容
  const appContent = await page.$eval('#app', el => el.innerHTML).catch(() => '(无法获取)');
  console.log('\\n=== #app 内容长度 ===', appContent.length);

  console.log('\\n=== 错误总数 ===', errors.length);

  await browser.close();
  console.log('=== 测试完成 ===');
})();
