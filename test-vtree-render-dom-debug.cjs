const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({
    executablePath: '/usr/bin/chromium',
    headless: true
  });
  const page = await browser.newPage();
  const logs = [];
  const errors = [];

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
    waitUntil: 'networkidle',
    timeout: 60000
  });

  await new Promise(r => setTimeout(r, 3000));

  // 检查 VTree 和复选框
  const trees = await page.$$('.yoya-tree');
  console.log(`找到 ${trees.length} 个 VTree 组件`);

  if (trees.length < 2) {
    console.log('VTree 数量不足，可能渲染有问题');
    await browser.close();
    return;
  }

  // 获取第二个 VTree（带复选框）的复选框信息
  const checkboxInfo = await page.$$eval('.yoya-tree input[type="checkbox"]', els =>
    els.map((el, i) => ({
      index: i,
      checked: el.checked,
      disabled: el.disabled,
      // 检查是否有 change 事件监听器
      hasOnchange: el.onchange !== null,
      // 获取事件监听器数量（通过 getEventListeners 需要 devtools 协议，这里只能用 onchange 属性）
      label: el.parentElement.querySelector('.yoya-tree__label')?.textContent?.trim()
    }))
  );

  console.log('\\n=== 复选框信息 ===');
  console.log(JSON.stringify(checkboxInfo, null, 2));

  // 检查页面是否有任何调试日志
  const hasDebugLogs = logs.some(l => l.includes('[VTree]') || l.includes('checkbox'));
  console.log('\\n=== 调试日志检查 ===');
  if (hasDebugLogs) {
    const relevantLogs = logs.filter(l => l.includes('[VTree]') || l.includes('checkbox') || l.includes('input'));
    console.log('相关日志:');
    relevantLogs.forEach(l => console.log(`  ${l}`));
  } else {
    console.log('没有找到 [VTree] 相关的调试日志');
    console.log('所有日志:');
    logs.slice(0, 20).forEach(l => console.log(`  ${l}`));
  }

  // 尝试手动点击第一个复选框
  console.log('\\n=== 尝试点击第一个复选框 ===');
  try {
    const firstCheckbox = await page.$('.yoya-tree input[type="checkbox"] >> nth=1');
    if (firstCheckbox) {
      console.log('找到第一个复选框，准备点击...');
      await firstCheckbox.click();
      await new Promise(r => setTimeout(r, 500));

      // 检查点击后的状态
      const afterClick = await page.$$eval('.yoya-tree input[type="checkbox"]', els =>
        els.map(el => ({
          checked: el.checked,
          label: el.parentElement.querySelector('.yoya-tree__label')?.textContent?.trim()
        }))
      );
      console.log('点击后状态:', JSON.stringify(afterClick, null, 2));
    } else {
      console.log('未找到复选框');
    }
  } catch (e) {
    console.log('点击失败:', e.message);
  }

  console.log('\\n=== 错误总数 ===', errors.length);
  if (errors.length > 0) {
    errors.forEach(e => console.log(`  - ${e.text || e.message}`));
  }

  await browser.close();
  console.log('=== 测试完成 ===');
})();
