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

  // 在浏览器中直接添加事件监听器到 checkbox 本身
  await page.evaluate(() => {
    document.querySelectorAll('.yoya-tree input[type="checkbox"]').forEach((cb, i) => {
      cb.addEventListener('change', (e) => {
        console.log('[Checkbox] change event, index:', i, 'checked:', e.target.checked, 'nodeKey:', e.target.getAttribute('data-node-key'));
      });

      cb.addEventListener('click', (e) => {
        console.log('[Checkbox] click event, index:', i, 'checked:', e.target.checked);
      });
    });
  });

  // 尝试点击复选框
  console.log('\n=== 点击复选框（索引 1）===');
  const firstCheckbox = page.locator('.yoya-tree input[type="checkbox"]').nth(1);
  console.log('点击前 checked:', await firstCheckbox.isChecked());
  await firstCheckbox.click();
  await new Promise(r => setTimeout(r, 500));
  console.log('点击后 checked:', await firstCheckbox.isChecked());

  console.log('\n=== 测试完成 ===');
  await browser.close();
})();
