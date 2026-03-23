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

  await new Promise(r => setTimeout(r, 5000));

  // 检查 VTree 部分
  console.log('\n=== VTree 检查 ===');

  // 获取 VTree 容器的 HTML
  const treeHTML = await page.$$eval('.yoya-tree', els =>
    els.map(el => ({
      classList: Array.from(el.classList),
      innerHTML: el.innerHTML.substring(0, 500),
      childrenLength: el.children.length
    }))
  );
  console.log('VTree 容器:', JSON.stringify(treeHTML, null, 2));

  // 获取树节点
  const treeNodes = await page.$$eval('.yoya-tree__node', els =>
    els.map(el => ({
      text: el.textContent?.trim(),
      classList: Array.from(el.classList)
    }))
  );
  console.log('树节点:', treeNodes);

  // 检查 DocSection 内容
  const sections = await page.$$eval('[data-section]', els =>
    els.map(el => ({
      id: el.id,
      hasContent: el.innerHTML.length > 0
    }))
  );
  console.log('章节:', sections);

  // 获取所有 yoya 相关元素
  const yoyaElements = await page.$$eval('[class*="yoya"]', els =>
    Array.from(new Set(els.map(el => el.className)))
  );
  console.log('\nYoya 类名:', yoyaElements);

  // 截图
  await page.screenshot({ path: 'vtree-debug.png', fullPage: true });
  console.log('\n截图已保存到 vtree-debug.png');

  console.log('\n=== 错误总数 ===', errors.length);
  if (errors.length > 0) {
    errors.forEach(e => console.log(e));
  }

  await browser.close();
  console.log('=== 测试完成 ===');
})();

