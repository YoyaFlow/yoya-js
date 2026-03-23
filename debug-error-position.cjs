const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({
    executablePath: '/usr/bin/chromium',
    headless: true,
    args: ['--enable-logging', '--v=1']
  });
  const page = await browser.newPage();

  // 设置页面控制台监听
  page.on('console', msg => {
    console.log(`[CONSOLE:${msg.type()}]`, msg.text());
  });

  page.on('pageerror', err => {
    console.log('[PAGE ERROR]');
    console.log('Message:', err.message);
    console.log('Stack:', err.stack);
  });

  console.log('正在加载页面...');

  // 访问页面
  await page.goto('http://localhost:3002/v2/examples/interaction.html', {
    waitUntil: 'load',
    timeout: 30000
  });

  await new Promise(r => setTimeout(r, 2000));

  // 获取错误覆盖层的详细信息
  const errorInfo = await page.evaluate(() => {
    const info = {};

    const messageEl = document.querySelector('#vite-error-message');
    if (messageEl) {
      info.message = messageEl.textContent;
    }

    const fileEl = document.querySelector('#vite-error-file');
    if (fileEl) {
      info.file = fileEl.textContent;
    }

    const overlay = document.querySelector('#vite-error-overlay');
    if (overlay) {
      info.hasOverlay = true;
      info.innerHTML = overlay.innerHTML.substring(0, 1000);
    }

    return info;
  });

  console.log('\\n=== 错误信息 ===');
  console.log(errorInfo);

  await browser.close();
  console.log('\\n=== 测试完成 ===');
})();
