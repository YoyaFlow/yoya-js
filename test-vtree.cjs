const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({
    executablePath: '/usr/bin/chromium',
    headless: false,  // 开启浏览器窗口便于观察
    slowMo: 100       // 慢动作，便于观察
  });
  const page = await browser.newPage();
  const errors = [];
  const logs = [];

  page.on('console', msg => {
    const text = msg.text();
    logs.push(`[CONSOLE:${msg.type()}] ${text}`);
    if (msg.type() === 'error' || msg.type() === 'warning') {
      errors.push({ type: 'console', text, level: msg.type() });
    }
  });

  page.on('pageerror', err => {
    console.log(`[PAGE ERROR] ${err.message}`);
    errors.push({ type: 'page', message: err.message, stack: err.stack });
  });

  console.log('正在访问 interaction.html...');
  await page.goto('http://localhost:3001/v2/examples/interaction.html', {
    waitUntil: 'networkidle',
    timeout: 60000
  });

  await new Promise(r => setTimeout(r, 3000));

  // 检查页面是否渲染
  const appChildren = await page.$eval('#app', el => el.children.length).catch(() => -1);
  console.log('#app 子元素数量:', appChildren);

  // 检查 VTree 组件是否存在
  const treeExists = await page.$('.yoya-tree').then(el => !!el).catch(() => false);
  console.log('VTree 元素是否存在:', treeExists);

  // 检查 VTree 容器
  const treeContainers = await page.$$('.yoya-tree').then(els => els.length).catch(() => 0);
  console.log('VTree 容器数量:', treeContainers);

  // 查找 VTree 部分
  const treeSection = await page.$('#tree').then(el => !!el).catch(() => false);
  console.log('VTree section 是否存在:', treeSection);

  // 尝试展开 VTree 节点
  console.log('\n=== 测试 VTree 交互 ===');

  // 查找树节点
  const treeNodes = await page.$$('[data-tree-node]');
  console.log('找到的树节点数量:', treeNodes.length);

  // 查找可点击的节点
  const clickableNodes = await page.$$eval('.yoya-tree-node', els =>
    els.map(el => ({
      text: el.textContent?.trim(),
      hasChildren: el.querySelector('.yoya-tree-children') !== null
    }))
  ).catch(() => []);

  console.log('可点击节点:', clickableNodes);

  // 截图
  await page.screenshot({ path: 'interaction-vtree-test.png', fullPage: true });
  console.log('\n截图已保存到 interaction-vtree-test.png');

  // 滚动到 VTree 部分
  console.log('\n=== 滚动到 VTree 部分 ===');
  await page.evaluate(() => {
    const treeSection = document.querySelector('#tree');
    if (treeSection) {
      treeSection.scrollIntoView({ behavior: 'smooth' });
    }
  });

  await new Promise(r => setTimeout(r, 2000));

  // 尝试点击展开节点
  console.log('尝试展开树节点...');
  try {
    await page.click('.yoya-tree-node');
    await new Promise(r => setTimeout(r, 1000));
    console.log('点击成功');
  } catch (e) {
    console.log('点击失败:', e.message);
  }

  // 再次截图
  await page.screenshot({ path: 'interaction-vtree-expanded.png', fullPage: true });
  console.log('展开后截图已保存');

  console.log('\n=== 错误总数 ===', errors.length);
  if (errors.length > 0) {
    console.log('=== 错误详情 ===');
    errors.forEach((e, i) => {
      console.log(`${i + 1}. [${e.level || 'page'}] ${e.text || e.message}`);
    });
  }

  await browser.close();
  console.log('\n=== 测试完成 ===');
})();

