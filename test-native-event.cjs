const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({
    executablePath: '/usr/bin/chromium',
    headless: false,
    slowMo: 100
  });
  const page = await browser.newPage();
  const allLogs = [];

  page.on('console', msg => {
    allLogs.push(`[${msg.type()}] ${msg.text()}`);
  });

  console.log('正在访问 interaction.html...');
  await page.goto('http://localhost:3001/v2/examples/interaction.html', {
    waitUntil: 'networkidle',
    timeout: 60000
  });

  await new Promise(r => setTimeout(r, 3000));

  // 在浏览器中直接添加事件监听器
  await page.evaluate(() => {
    document.querySelectorAll('.yoya-tree').forEach((tree, i) => {
      console.log('Tree', i, 'has onchange:', tree.onchange);
      console.log('Tree', i, 'has change listeners (via getEventListeners):', 'unknown');

      // 手动添加原生事件监听器测试
      tree.addEventListener('change', (e) => {
        console.log('[Native] change event on tree', i, 'target:', e.target.tagName);
      });
    });
  });

  // 尝试点击复选框
  console.log('\n=== 点击复选框 ===');
  const firstCheckbox = page.locator('.yoya-tree input[type="checkbox"]').nth(1);
  await firstCheckbox.click();
  await new Promise(r => setTimeout(r, 500));

  // 检查点击后的状态
  const afterClick = await page.$$eval('.yoya-tree input[type="checkbox"]', els =>
    els.map(el => ({
      checked: el.checked,
      nodeKey: el.getAttribute('data-node-key')
    }))
  );
  console.log('点击后状态:', JSON.stringify(afterClick, null, 2));

  // 打印所有日志
  console.log('\n=== 所有日志 ===');
  allLogs.forEach(l => console.log(l));

  await browser.close();
})();
