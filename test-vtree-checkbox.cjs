const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({
    executablePath: '/usr/bin/chromium',
    headless: false,
    slowMo: 200
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
    waitUntil: 'networkidle',
    timeout: 60000
  });

  await new Promise(r => setTimeout(r, 3000));

  // 滚动到 VTree 部分
  console.log('\n=== 滚动到 VTree 部分 ===');
  await page.evaluate(() => {
    const treeSection = document.querySelector('#tree');
    if (treeSection) {
      treeSection.scrollIntoView({ behavior: 'smooth' });
    }
  });

  await new Promise(r => setTimeout(r, 2000));

  // 截图：初始状态
  await page.screenshot({ path: 'vtree-checkbox-0-initial.png' });
  console.log('截图 1: 初始状态');

  // 查找带复选框的 VTree（第二个 VTree）
  const trees = await page.$$('.yoya-tree');
  console.log(`找到 ${trees.length} 个 VTree 组件`);

  // 第二个 VTree 是带复选框的
  const checkboxTree = trees[1];
  if (!checkboxTree) {
    console.log('未找到带复选框的 VTree!');
    await browser.close();
    return;
  }

  // 获取初始复选框状态
  console.log('\n=== 初始复选框状态 ===');
  const initialCheckboxes = await checkboxTree.$$eval('input[type="checkbox"]', els =>
    els.map(el => ({
      checked: el.checked,
      label: el.parentElement.textContent?.trim()
    }))
  );
  console.log('复选框状态:', initialCheckboxes);

  // 查找第一个复选框（节点 1-1 应该初始被选中）
  const firstCheckbox = await checkboxTree.$('input[type="checkbox"]');
  if (firstCheckbox) {
    console.log('\n=== 点击第一个复选框 ===');
    await firstCheckbox.click();
    await new Promise(r => setTimeout(r, 1000));

    // 截图：点击后
    await page.screenshot({ path: 'vtree-checkbox-1-after-click.png' });
    console.log('截图 2: 点击第一个复选框后');

    // 获取点击后的状态
    const afterClick1 = await checkboxTree.$$eval('input[type="checkbox"]', els =>
      els.map(el => ({
        checked: el.checked,
        label: el.parentElement.textContent?.trim()
      }))
    );
    console.log('点击后状态:', afterClick1);
  }

  // 点击节点 1 的复选框
  console.log('\n=== 点击节点 1 的复选框 ===');
  const node1Checkbox = await checkboxTree.$$eval('input[type="checkbox"]', els => els[0]);
  if (node1Checkbox) {
    await firstCheckbox.click();
    await new Promise(r => setTimeout(r, 1000));

    // 截图
    await page.screenshot({ path: 'vtree-checkbox-2-toggle-back.png' });
    console.log('截图 3: 再次点击取消选中');

    const afterClick2 = await checkboxTree.$$eval('input[type="checkbox"]', els =>
      els.map(el => ({
        checked: el.checked,
        label: el.parentElement.textContent?.trim()
      }))
    );
    console.log('再次点击后状态:', afterClick2);
  }

  // 测试展开节点 2
  console.log('\n=== 测试展开节点 2 ===');
  const expandIcons = await checkboxTree.$$('.yoya-tree__node span');
  console.log(`找到 ${expandIcons.length} 个展开图标`);

  // 节点 2 的展开图标（应该是第三个有子节点的节点）
  for (let i = 0; i < expandIcons.length; i++) {
    const icon = expandIcons[i];
    const iconText = await icon.textContent();
    if (iconText === '▶') {
      console.log(`点击展开图标 ${i}: ${iconText}`);
      await icon.click();
      await new Promise(r => setTimeout(r, 1000));
      break;
    }
  }

  // 截图：展开后
  await page.screenshot({ path: 'vtree-checkbox-3-after-expand.png' });
  console.log('截图 4: 展开节点后');

  // 获取所有节点和复选框状态
  console.log('\n=== 最终状态 ===');
  const finalState = await checkboxTree.$$eval('.yoya-tree__node', els =>
    els.map(el => ({
      text: el.textContent?.trim(),
      checkboxChecked: el.querySelector('input[type="checkbox"]')?.checked || null,
      hasCheckbox: el.querySelector('input[type="checkbox"]') !== null
    }))
  );
  console.log('最终节点状态:');
  finalState.forEach(node => console.log(`  - ${node.text} [复选框：${node.hasCheckbox ? (node.checkboxChecked ? '✓' : '✗') : '无'}]`));

  // 截图
  await page.screenshot({ path: 'vtree-checkbox-4-final.png' });
  console.log('截图 5: 最终状态');

  console.log('\n=== 错误总数 ===', errors.length);
  if (errors.length > 0) {
    console.log('错误详情:');
    errors.forEach(e => console.log(`  - ${e.text}`));
  }

  await browser.close();
  console.log('\n=== 测试完成 ===');
})();

