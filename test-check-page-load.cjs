const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({
    executablePath: '/usr/bin/chromium',
    headless: true
  });
  const page = await browser.newPage();
  const errors = [];
  const logs = [];

  page.on('console', msg => {
    const text = msg.text();
    logs.push(`[${msg.type()}] ${text}`);
    if (msg.type() === 'error') {
      errors.push({ type: 'console', text });
    }
  });

  page.on('pageerror', err => {
    logs.push(`[PAGE ERROR] ${err.message}`);
    errors.push({ type: 'page', message: err.message });
  });

  console.log('正在访问 interaction.html...');
  await page.goto('http://localhost:3001/v2/examples/interaction.html', {
    waitUntil: 'load',
    timeout: 60000
  });

  // 等待网络空闲和 JS 执行
  await Promise.all([
    page.waitForFunction(() => document.getElementById('app')?.children.length > 0, { timeout: 10000 }),
    new Promise(r => setTimeout(r, 5000))
  ]);

  console.log('\\n=== 页面加载后的日志 ===');
  logs.forEach(l => console.log(l));

  // 检查 VTree
  const trees = await page.$$('.yoya-tree');
  console.log(`\\n找到 ${trees.length} 个 VTree 组件`);

  if (trees.length > 0) {
    const checkboxInfo = await page.$$eval('.yoya-tree input[type="checkbox"]', els =>
      els.map((el, i) => ({
        index: i,
        checked: el.checked,
        hasOnchange: el.onchange !== null
      }))
    );
    console.log('复选框信息:', JSON.stringify(checkboxInfo, null, 2));
  }

  console.log('\\n=== 错误总数 ===', errors.length);

  await browser.close();
})();
