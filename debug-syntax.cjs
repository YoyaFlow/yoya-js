const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({
    executablePath: '/usr/bin/chromium',
    headless: true
  });
  const page = await browser.newPage();

  // 启用控制台日志捕获
  page.on('console', msg => {
    console.log(`[CONSOLE:${msg.type()}]`, msg.text());
  });

  page.on('pageerror', err => {
    console.log(`[PAGE ERROR]`, err.message);
    console.log(`[STACK]`, err.stack);
  });

  console.log('正在加载 interaction.html...');

  // 访问页面
  const response = await page.goto('http://localhost:3002/v2/examples/interaction.html', {
    waitUntil: 'domcontentloaded',
    timeout: 30000
  });

  console.log('页面响应状态:', response.status());

  // 等待一段时间让 JS 执行
  await new Promise(r => setTimeout(r, 3000));

  // 获取页面中的错误覆盖层内容
  const errorOverlay = await page.$('#vite-error-overlay').catch(() => null);
  if (errorOverlay) {
    const overlayContent = await errorOverlay.innerHTML();
    console.log('\n=== Vite 错误覆盖层内容 ===');
    console.log(overlayContent.substring(0, 2000));
  }

  // 获取页面 HTML
  const html = await page.content();
  console.log('\n=== 页面 HTML 长度 ===', html.length);

  // 检查 app 内容
  const appContent = await page.$eval('#app', el => el.innerHTML).catch(() => '(无法获取)');
  console.log('=== #app 内容长度 ===', appContent.length);

  // 获取所有网络请求
  const requests = await page.evaluate(() => {
    if (window.performance && window.performance.getEntriesByType) {
      return window.performance.getEntriesByType('resource')
        .filter(r => r.name.includes('localhost'))
        .map(r => ({ name: r.name, status: 'loaded' }));
    }
    return [];
  });
  console.log('\n=== 加载的资源 ===');
  console.log(requests);

  await browser.close();
  console.log('\n=== 测试完成 ===');
})();
