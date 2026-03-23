const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({
    executablePath: '/usr/bin/chromium',
    headless: false // 使用有头模式以便调试
  });
  const page = await browser.newPage();

  const errors = [];
  page.on('pageerror', err => {
    console.log('[PAGE ERROR]', err.message);
    console.log('[PAGE ERROR STACK]', err.stack);
    errors.push({ message: err.message, stack: err.stack });
  });

  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.log('[CONSOLE ERROR]', msg.text());
      errors.push(msg.text());
    }
  });

  console.log('正在加载页面...');
  await page.goto('http://localhost:3002/v2/examples/interaction.html', {
    waitUntil: 'networkidle',
    timeout: 30000
  });

  await new Promise(r => setTimeout(r, 2000));

  // 截图
  await page.screenshot({ path: 'error-screenshot.png' });
  console.log('截图已保存到 error-screenshot.png');

  // 获取页面 HTML
  const html = await page.content();
  console.log('页面长度:', html.length);

  // 查找错误信息
  if (html.includes('error')) {
    const errorMatch = html.match(/error-overlay[^>]*>|<pre[^>]*>([\s\S]*?)<\/pre>/);
    if (errorMatch) {
      console.log('错误信息:', errorMatch[0].substring(0, 500));
    }
  }

  await browser.close();
  console.log('=== 测试完成 ===');
})();
