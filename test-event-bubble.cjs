const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({
    executablePath: '/usr/bin/chromium',
    headless: false
  });
  const page = await browser.newPage();

  console.log('正在访问 interaction.html...');
  await page.goto('http://localhost:3001/v2/examples/interaction.html', {
    waitUntil: 'networkidle',
    timeout: 60000
  });

  await new Promise(r => setTimeout(r, 3000));

  // 在浏览器中直接添加事件监听器 - 使用事件捕获
  await page.evaluate(() => {
    document.querySelectorAll('.yoya-tree').forEach((tree, i) => {
      // 使用捕获阶段监听
      tree.addEventListener('change', (e) => {
        console.log('[Capture] change event on tree', i, 'target:', e.target.tagName, 'bubbles:', e.bubbles);
      }, true);

      // 使用冒泡阶段监听
      tree.addEventListener('change', (e) => {
        console.log('[Bubble] change event on tree', i, 'target:', e.target.tagName, 'bubbles:', e.bubbles);
      }, false);
    });

    // 在 document 层面监听
    document.addEventListener('change', (e) => {
      if (e.target.tagName === 'INPUT' && e.target.type === 'checkbox') {
        console.log('[Document] change event, target:', e.target.getAttribute('data-node-key'));
      }
    }, true);
  });

  // 尝试点击复选框
  console.log('\n=== 点击复选框 ===');
  const firstCheckbox = page.locator('.yoya-tree input[type="checkbox"]').nth(1);
  await firstCheckbox.click();
  await new Promise(r => setTimeout(r, 500));

  console.log('\n=== 测试完成 ===');
  await browser.close();
})();
