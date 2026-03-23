const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({
    executablePath: '/usr/bin/chromium',
    headless: true
  });
  const page = await browser.newPage();
  const errors = [];

  page.on('console', msg => {
    console.log(`[CONSOLE:${msg.type()}] ${msg.text()}`);
    if (msg.type() === 'error') {
      errors.push({ type: 'console', text: msg.text() });
    }
  });

  page.on('pageerror', err => {
    console.log(`[PAGE ERROR] ${err.message}`);
    errors.push({ type: 'page', message: err.message });
  });

  console.log('正在访问 interaction.html...');
  await page.goto('http://localhost:3001/v2/examples/interaction.html', {
    waitUntil: 'networkidle',
    timeout: 60000
  });

  await new Promise(r => setTimeout(r, 3000));

  // 获取所有 VTree 组件
  const trees = await page.$$('.yoya-tree');
  console.log(`找到 ${trees.length} 个 VTree 组件`);

  // 测试第二个 VTree（带复选框）
  const checkboxTree = trees[1];
  if (!checkboxTree) {
    console.log('未找到带复选框的 VTree!');
    await browser.close();
    return;
  }

  // 获取复选框元素并添加点击监听
  console.log('\n=== 初始状态 ===');
  const initialState = await page.$$eval('.yoya-tree input[type="checkbox"]', els =>
    els.map((el, i) => ({
      index: i,
      checked: el.checked,
      label: el.parentElement.querySelector('.yoya-tree__label')?.textContent?.trim()
    }))
  );
  console.log('初始状态:', JSON.stringify(initialState, null, 2));

  // 找到节点 1-1 的复选框（应该是索引 1）
  const node1_1Checkbox = initialState.findIndex(n => n.label === '子节点 1-1');
  console.log(`\n节点 1-1 的复选框索引：${node1_1Checkbox}`);

  // 点击节点 1-1 的复选框
  console.log(`\n=== 点击节点 1-1 的复选框（索引 ${node1_1Checkbox}）===`);

  // 使用 JavaScript 点击，确保触发事件
  await page.$$eval('.yoya-tree input[type="checkbox"]', (els, index) => {
    const checkbox = els[index];
    console.log('点击前 checked:', checkbox.checked);
    checkbox.click();
    console.log('点击后 checked:', checkbox.checked);
  }, node1_1Checkbox);

  await new Promise(r => setTimeout(r, 1000));

  const afterClick = await page.$$eval('.yoya-tree input[type="checkbox"]', els =>
    els.map((el, i) => ({
      index: i,
      checked: el.checked,
      label: el.parentElement.querySelector('.yoya-tree__label')?.textContent?.trim()
    }))
  );
  console.log('点击后状态:', JSON.stringify(afterClick, null, 2));

  // 检查节点 1-1 的复选框是否被取消选中
  const node1_1AfterClick = afterClick.find(n => n.label === '子节点 1-1');
  if (node1_1AfterClick && !node1_1AfterClick.checked) {
    console.log('✓ 节点 1-1 复选框取消选中成功');
  } else {
    console.log('✗ 节点 1-1 复选框状态未改变');
  }

  console.log('\n=== 错误总数 ===', errors.length);

  await browser.close();
  console.log('=== 测试完成 ===');
})();

