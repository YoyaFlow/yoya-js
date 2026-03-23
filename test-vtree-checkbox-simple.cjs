const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({
    executablePath: '/usr/bin/chromium',
    headless: true
  });
  const page = await browser.newPage();
  const errors = [];

  page.on('console', msg => {
    if (msg.type() === 'error') {
      errors.push({ type: 'console', text: msg.text() });
    }
  });

  page.on('pageerror', err => {
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
  console.log('\n=== 测试带复选框的 VTree ===');

  // 获取复选框状态
  const getCheckboxState = async () => {
    return await page.$$eval('.yoya-tree input[type="checkbox"]', els =>
      els.map(el => ({
        checked: el.checked,
        disabled: el.disabled
      }))
    );
  };

  // 初始状态 - checkedKeys: ['1-1']
  console.log('\n--- 初始状态（checkedKeys: [\'1-1\']）---');
  const initialState = await getCheckboxState();
  console.log('复选框状态:', initialState);

  // 验证第一个复选框（节点 1-1）是否被选中
  if (initialState[0] && initialState[0].checked) {
    console.log('✓ 节点 1-1 初始选中状态正确');
  } else {
    console.log('✗ 节点 1-1 初始选中状态错误 - 应该被选中');
  }

  // 点击第一个复选框
  console.log('\n--- 点击第一个复选框（节点 1-1）---');
  await page.click('.yoya-tree input[type="checkbox"] >> nth=0');
  await new Promise(r => setTimeout(r, 500));

  const afterFirstClick = await getCheckboxState();
  console.log('点击后状态:', afterFirstClick);

  // 验证节点 1-1 是否被取消选中
  if (afterFirstClick[0] && !afterFirstClick[0].checked) {
    console.log('✓ 点击后节点 1-1 取消选中成功');
  } else {
    console.log('✗ 点击后节点 1-1 状态异常');
  }

  // 再次点击同一个复选框
  console.log('\n--- 再次点击复选框（节点 1-1）---');
  await page.click('.yoya-tree input[type="checkbox"] >> nth=0');
  await new Promise(r => setTimeout(r, 500));

  const afterSecondClick = await getCheckboxState();
  console.log('再次点击后状态:', afterSecondClick);

  // 验证节点 1-1 是否重新被选中
  if (afterSecondClick[0] && afterSecondClick[0].checked) {
    console.log('✓ 再次点击后节点 1-1 重新选中成功');
  } else {
    console.log('✗ 再次点击后节点 1-1 状态异常');
  }

  // 检查复选框总数
  const checkboxCount = await page.$$eval('.yoya-tree input[type="checkbox"]', els => els.length);
  console.log(`\n复选框总数：${checkboxCount}`);

  // 获取所有节点文本
  const nodeLabels = await page.$$eval('.yoya-tree__label', els =>
    els.map(el => el.textContent.trim())
  );
  console.log('节点标签:', nodeLabels);

  console.log('\n=== 错误总数 ===', errors.length);
  if (errors.length > 0) {
    errors.forEach(e => console.log(`  - ${e.text || e.message}`));
  }

  await browser.close();
  console.log('=== 测试完成 ===');
})();

