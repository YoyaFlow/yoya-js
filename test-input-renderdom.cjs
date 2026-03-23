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
    waitUntil: 'load',
    timeout: 60000
  });

  await new Promise(r => setTimeout(r, 5000));

  // 查找包含 "INPUT renderDom" 的日志
  const inputLogs = allLogs.filter(l => l.includes('INPUT renderDom'));
  console.log(`\n找到 ${inputLogs.length} 条 INPUT renderDom 日志`);
  if (inputLogs.length > 0) {
    console.log('前 10 条日志:');
    inputLogs.slice(0, 10).forEach(l => console.log('  ' + l));
  }

  // 查找包含 "shouldApply" 的日志
  const shouldApplyLogs = allLogs.filter(l => l.includes('shouldApply'));
  console.log(`\n找到 ${shouldApplyLogs.length} 条 shouldApply 日志`);
  if (shouldApplyLogs.length > 0) {
    console.log('前 10 条日志:');
    shouldApplyLogs.slice(0, 10).forEach(l => console.log('  ' + l));
  }

  // 检查复选框状态
  const checkboxInfo = await page.$$eval('.yoya-tree input[type="checkbox"]', els =>
    els.map((el, i) => ({
      index: i,
      checked: el.checked,
      hasOnchange: el.onchange !== null
    }))
  );
  console.log('\n复选框状态:', JSON.stringify(checkboxInfo, null, 2));

  await browser.close();
})();
