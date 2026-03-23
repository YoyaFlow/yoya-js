const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({
    executablePath: '/usr/bin/chromium',
    headless: true
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

  // 检查 VTree 容器的事件监听器
  const treeInfo = await page.$$eval('.yoya-tree', els =>
    els.map((el, i) => ({
      index: i,
      className: el.className,
      hasChangeHandler: el.onchange !== null
    }))
  );
  console.log('VTree 容器信息:', JSON.stringify(treeInfo, null, 2));

  // 检查复选框
  const checkboxInfo = await page.$$eval('.yoya-tree input[type="checkbox"]', els =>
    els.map((el, i) => ({
      index: i,
      checked: el.checked,
      hasNodeKey: el.hasAttribute('data-node-key'),
      nodeKey: el.getAttribute('data-node-key')
    }))
  );
  console.log('复选框信息:', JSON.stringify(checkboxInfo, null, 2));

  // 尝试手动触发 change 事件
  console.log('\n=== 尝试手动触发 change 事件 ===');
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
  allLogs.filter(l => l.includes('VTree')).forEach(l => console.log(l));

  await browser.close();
})();
